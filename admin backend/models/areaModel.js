const mongoose = require('mongoose');

const areaModel = mongoose.Schema({
    areaName: {
        type: String,
        required: true
    },
    areaId: {
        type: String,
        required: true
    },
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

module.exports = mongoose.model('area', areaModel);