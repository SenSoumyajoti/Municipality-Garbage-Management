const mongoose = require('mongoose');

const driverModel = mongoose.Schema({
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
    // phNo : {
    //     type: Number,
    //     required: true
    // },
    profilePic : String
});

module.exports = mongoose.model("driver", driverModel);