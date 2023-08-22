const index = require("../routes/index");
const request = require("supertest");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
//recreate new express app, not touching app.js
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.use("/", index);

describe("basic GET routes works", () => {
  test("index route", (done) => {
    const res = request(app)
      .get("/")
      .expect("Content-Type", /text\/html/)
      .expect(200)
      .end((err, res) => {
        expect(res.text).toContain("<title>Messenger</title>");
        done();
      });
  });
  test("signup route", (done) => {
    const res = request(app)
      .get("/signup")
      .expect("Content-Type", /text\/html/)
      .expect(200)
      .end((err, res) => {
        expect(res.text).toContain("<title>Sign Up</title>");
        done();
      });
  });
  test("login route", (done) => {
    const res = request(app)
      .get("/login")
      .expect("Content-Type", /text\/html/)
      .expect(200)
      .end((err, res) => {
        expect(res.text).toContain("<title>Log In</title>");
        done();
      });
  });
});

describe("POST Signup With Various Inputs", () => {
  test("valid inputs", async () => { 
    const user = {
      username: "Bobby",
      email: "email123@gmail.com",
      password: "12345",
      confirmPassword: "12345",
    };
    const res = await request(app).post("/signup").type("form").send(user);
    expect(res.statusCode).toBe(302);
    expect(res.header["location"]).toContain("/home");
    //if saved to mongodb, should reroute to home. Not saved users reroutes to login
  });

  test("Incorrect password", async () => {
    const user = {
      username: "Bobby",
      email: "email123@gmail.com",
      password: "12345",
      confirmPassword: "123456",
    };
    const res = await request(app).post("/signup").type("form").send(user);
    expect(res.text).toMatch(/Passwords do not match/)
    expect(res.statusCode).toBe(401);
  });

  test("Taken username", async () => {
    const user = {
      username: "taken",
      email: "email123@gmail.com",
      password: "12345",
      confirmPassword: "12345",
    };
    const res = await request(app).post("/signup").type("form").send(user);
    expect(res.text).toMatch(/Username taken/)
    expect(res.statusCode).toBe(401);
  });

  test("Taken email", async () => {
    const user = {
      username: "Bobby",
      email: "taken@gmail.com",
      password: "12345",
      confirmPassword: "12345",
    };
    const res = await request(app).post("/signup").type("form").send(user);
    expect(res.text).toMatch(/Email taken/)
    expect(res.statusCode).toBe(401);
  }); 
});

 describe("POST Login Route", () => {
  test("Valid Login Inputs", async () => {
    const user = {
      username: "taken",
      email: "taken@gmail.com",
      password: "taken",
    };
    const res = await request(app).post("/login").type("form").send(user);
    expect(res.headers.location).toBe('/home');
    expect(res.statusCode).toBe(302);
  });
  test("Invalid Username", async () => {
    const user = {
      username: "Bobby",
      email: "taken@gmail.com",
      password: "taken",
    };
    const res = await request(app).post("/login").type("form").send(user);
    expect(res.text).toMatch(/Could not find username/);
    expect(res.statusCode).toBe(401);
  });
  test("Invalid Email", async () => {
    const user = {
      username: "taken",
      email: "wrong@gmail.com",
      password: "taken",
    };
    const res = await request(app).post("/login").type("form").send(user);
    expect(res.text).toMatch(/Invalid email/);
    expect(res.statusCode).toBe(401);
  });
  test("Invalid Password", async () => {
    const user = {
      username: "taken",
      email: "taken@gmail.com",
      password: "wrong",
    };
    const res = await request(app).post("/login").type("form").send(user);
    expect(res.text).toMatch(/Wrong password/);
    expect(res.statusCode).toBe(401);
  }); 
}); 

describe("Cookies created", () => {
  test("Token cookie on POST signup", async () => {
    const user = {
      username: "Bobby",
      email: "email@gmail.com",
      password: "12345",
      confirmPassword: "12345",
    };
    const res = await request(app).post("/signup").type("form").send(user);
    const cookieHeader = res.header["set-cookie"][0];

    expect(cookieHeader).toBeDefined();
    expect(cookieHeader).toContain("HttpOnly");
    expect(cookieHeader).toContain("Secure");
    expect(res.header['location']).toBe('/home')
    expect(res.statusCode).toBe(302);
  });
  test("Token cookie on POST login", async () => {
    const user = {
      username: "taken",
      email: "taken@gmail.com",
      password: "taken",
    };
    const res = await request(app).post("/login").type("form").send(user);
    const cookieHeader = res.header["set-cookie"][0];

    expect(cookieHeader).toBeDefined();
    expect(cookieHeader).toContain("HttpOnly");
    expect(cookieHeader).toContain("Secure");
    expect(res.header['location']).toBe('/home')
    expect(res.statusCode).toBe(302);
  }); 
});

describe("Authorization For Protected Route", () => {
  let authToken;
  const user = {
    username: "taken",
    email: "taken@gmail.com",
    password: "taken",
  };
  test("Unauthorized Route", async () => {
    const res = await request(app).get("/home");
    expect(res.text).toBe("Found. Redirecting to /login");
    expect(res.statusCode).toBe(302);
  });

  test("JWT & Cookie Created POST Login", async () => {
    const res = await request(app).post("/login").type("form").send(user);;
    expect(res.text).toMatch('Found. Redirecting to /home');
    expect(res.header["set-cookie"]).toBeDefined();
    authToken = res.header["set-cookie"][0];
    expect(res.statusCode).toBe(302);
  });

  test("Access to Protected Route", async () => {
    if (!authToken) throw new Error("JWT token not found");

    const res = await request(app).get("/home").set("Cookie", authToken);
    expect(res.statusCode).toBe(200);
  });
});
