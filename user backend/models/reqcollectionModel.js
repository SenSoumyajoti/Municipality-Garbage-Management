const mongoose = require('mongoose');

const reqSchema = mongoose.Schema({
    fullName : {
        type: String,
        required: true
    },
    address : {
        type: String,
        required: true,
    },
    quantity : {
        type:Number,
        required: true,
        
    },
    phone_no : {
        type: Number,
        required: true
    },
    dropdown:{
        type: String,
        enum: ['dry', 'wet', 'Mixed'],
        default:undefined,
        required:true
    },
    date : {
        type: Date,
        default: true
    }
});

module.exports = mongoose.model("req", reqSchema);