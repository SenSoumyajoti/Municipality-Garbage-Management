// dustbinModel.js

const mongoose = require('mongoose');

const dustbinModel = mongoose.Schema({
    dustbinId: {
        type: String,
        required: true
    },
    dustbinNo: {
        type: Number,
        required: true
    },
    pathId: {
        type: String,
        ref: "path"
    },
    coords: {
        lat: Number,
        lng: Number
    },
    isVisited: {
        type: Boolean,
        default: false,
    },
    visitedTime: {
        type: Date,
        default: null,
    },
})

module.exports = mongoose.model('dustbin', dustbinModel);