const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName : {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    profilePic : Buffer,
    isUser : {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("user", userSchema);