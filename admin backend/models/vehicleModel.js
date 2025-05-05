const mongoose = require('mongoose');

const vehicleModel = mongoose.Schema({
    vehicleId: {
        type: String,
        required: true
    },
    vehicleReg: {
        type: String,
        required: true
    },
    capacity: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
})

module.exports = mongoose.model('vehicle', vehicleModel);