const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // reference to your User model
        required: true
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
        type: String,
        required: true
    },
    suggestion : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("feedback", feedbackSchema);
