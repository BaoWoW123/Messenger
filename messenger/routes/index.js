var express = require("express");
var router = express.Router();
const { User, Message } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

/* GET home page. */
//GET ROUTES RETURN JSON FOR TESTS
router.get("/", function (req, res, next) {
  res.json({ title: "Index" });
  //res.render("index", { title: "Index" });
});

router.get("/signup", function (req, res, next) {
  res.json({ title: "Sign Up" });
  //res.render("signup", { title: "Sign up" });
});

router.get("/login", function (req, res, next) {
  //res.json({ title: "Log In" });
  res.render("login", { title: "Log in" });
});

router.post(
  "/signup",
  [
    check("password", "Password must be at least 5 characters long")
      .trim()
      .isLength({ min: 5 })
      .escape(),
    check(
      "confirmPassword",
      "Confirmed password must be at least 5 characters long"
    )
      .trim()
      .isLength({ min: 5 })
      .escape(),
    check("username", "Username must be at least 5-20 characters long")
      .trim()
      .isLength({ min: 5, max: 20 })
      .escape(),
    check("username").custom(async (username) => {
      let usernameTaken = await User.findOne({ username: username });
      if (usernameTaken) {
        throw new Error("Username taken");
      }
    }),
    check("email").custom(async (email) => {
      let emailTaken = await User.findOne({ email: email });
      if (emailTaken) {
        throw new Error("Email taken");
      }
    }),
    check("confirmPassword").custom((password, { req }) => {
      if (password !== req.body.password) {
        throw new Error(`Passwords do not match`);
      } else return true;
    }),
  ],
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(401).json({ errors: errors.array() });

    try {
      const { username, email, password } = req.body;
      bcrypt.hash(password, 10, async (err, hashedPw) => {
        if (err) return next(err);

        const user = new User({
          username: username,
          email: email,
          password: hashedPw,
        });
        //await user.save();  not saved for testing
        const token = jwt.sign({ user: user._id }, process.env.SECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true, secure: true });
        res.json({ title: "Sign up POST", user: user });
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.post("/login", async function (req, res, next) {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(401).json({ msg: "Could not find username" });
  if (user.email != req.body.email)
    return res.status(401).json({ msg: "Invalid email" });
  try {
    bcrypt.compare(req.body.password, user.password, async (err, isMatch) => {
      if (err) return next(err).status(401);
      if (isMatch) {
        const token = jwt.sign({ user: user._id }, process.env.SECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true, secure: true });
        return res.status(200).json({ msg: `Welcome ${user.username}` });
      } else return res.status(401).json({ msg: "Wrong password" });
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Internal Server Error: Post Login Route Handler" });
  }
});

module.exports = router;
