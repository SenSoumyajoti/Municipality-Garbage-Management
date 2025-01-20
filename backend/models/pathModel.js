// pathModel.js

const mongoose = require('mongoose');

const pathModel = mongoose.Schema({
    pathId: {
        type: String,
        required: true
    },
    pathName: {
        type: String,
        required: true
    },
    checkPoints: [
        {
            CPId: String,
            lat: Number,
            lng: Number
        }
    ],
    dustbins: [
        {
            type: String,
            ref: "dustbin"
        }
    ],
    noOfDustbins: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('path', pathModel);