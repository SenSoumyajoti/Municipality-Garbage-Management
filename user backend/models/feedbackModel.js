const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    feedbackId : {
        type:String,
        required:true
    },
    cleanedtoday : {
        type: Boolean,
        required: true
    },
    onTime : {
        type: Boolean,
        required: true
    },
    feedbackPic : {
        type: String,
        required:false
    },
    rating : {
        type: Number,
        required: true
    },
    suggestion : {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("feedback", feedbackSchema);
