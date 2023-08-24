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
    friends: {type: [Schema.ObjectId], ref: 'User'},
}, {collection: 'Users'})

const messageSchema = new Schema({
    conversationId: {type: Schema.ObjectId, required:true, ref: 'Conversation'},
    content: {type: String, required:true},
    senderId: {type: Schema.ObjectId, required:true},
    receiverId: {type: Schema.ObjectId, required:true},
    date: {type: Date, required:true}
}, {collection: 'Messages'})

const conversationSchema = new Schema ({
    messagers: {type: [String], required:true},
    messagerIds: {type: [Schema.ObjectId], required:true},
    date: {type: Date, default: Date.now, required:true}
})

const User = mongoose.model('User', userSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = {User, Message, Conversation}