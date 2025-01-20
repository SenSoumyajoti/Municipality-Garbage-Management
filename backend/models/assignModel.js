const mongoose = require('mongoose');

const assignModel = mongoose.Schema({
    pathId: {
        type: String,
        ref: "path"
    },
    driverUsername: {
        type: String,
        ref: "driver"
    },
    vehicleReg: {
        type: String,
        ref: "vehicle"
    }
})

module.exports = mongoose.model('assign', assignModel);