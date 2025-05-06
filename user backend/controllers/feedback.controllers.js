const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
// const multer = require('multer')

const feedbackModel = require("../models/feedbackModel");
const genToken = require("../utils/genToken");

class feedbackController {


  //submit feedback
  async submituserFeedback(req, res) {
    try {
      req.body.user = req._id;

      const feedback = await feedbackModel.create(req.body);

      return (
        res.status(201).json({
          message: "feedback submitted successfully",
          feedback,
        })
      );
    } catch (err) {
      console.log(err);
      return (
        res.status(500),
        json({
          messgae: "failed to submit..",
          error: err.message,
        })
      );
    }
  };


  //all feedback get
  async getallUserFeedback(req, res) {
    try {
        const feedback = await feedbackModel.find({ user: req.user._id })
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: feedback.length,
        data: feedback
      });
    } catch (err) {
      console.error('Get feedback error:', err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch feedback",
        error: err.message
      });
      
    }
  };


  //single feedback get
  async getFeedback(req, res) {
    try {
        const feedback = await feedbackModel.feedbackModel.findById(req.params.id);

        if(!feedback){
            return res.status(404).json({
                success:false,
                error:'feedback Not found'
            })
        }
        if(!feedback.user.equals(req.user._id)){
            return res.status(403).json({
                success:false,
                error:'feedback Not authorised'
            })
        }
      res.status(200).json({
        success: true,
        data: feedback,
      });
    } catch (err) {
        console.log('get feedback error:',err);
        res.status(500).json({
            success:false,
            message:"failed to fetch message",
            error: err.message 
        });
    }
  };
}

module.exports = new feedbackController();
