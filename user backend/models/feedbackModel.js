const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({

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
        type: String,
        required: true
    },
    suggestion : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("feedback", feedbackSchema);
