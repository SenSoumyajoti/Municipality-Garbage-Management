const mongoose = require('mongoose');

const trackingStatusModel = mongoose.Schema({
    trackingStatusId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    pathId: {
        type: String,
        ref: "path"
    },
    dustbinId: {
        type: String,
        ref: "dustbin"
    },
    driverUsername: {
        type: String,
        ref: "driver"
    },
    vehicleReg: {
        type: String,
        ref: "vehicle"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('trackingStatus', trackingStatusModel);