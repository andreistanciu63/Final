const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
     isAdmin: {
        type: Boolean,
        default: false, // By default, a user is not an admin
    },
     userId: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model("users", userSchema)