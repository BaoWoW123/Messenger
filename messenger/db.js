const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology:true, useNewUrlParser:true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'))

const userSchema = new Schema({
    username: {type: String, required:true, unique:true },
    description: {type: String, minlength:1, maxlength:100},
    email: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    createdAt: {type: Date, default: Date.now, required: true},
}, {collection: 'Users'})

const messageSchema = new Schema({
    content: {type: String, required:true},
    date: {type: Date, required:true}
}, {collection: 'Messages'})

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = {User, Message}