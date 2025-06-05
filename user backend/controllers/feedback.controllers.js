const feedbackModel = require("../models/feedbackModel");
//const genToken = require("../utils/genToken");

class feedbackController {

    //submit feedback
    async submitFeedback(req, res) {
        try {
            
            const {cleanedtoday, onTime, feedbackPic, rating, suggestion} = req.body;
            const feedbackId = Date.now().toString(36) + Math.random().toString(36).slice(2);

            const createdFeedback= await feedbackModel.create({
                feedbackId,
                cleanedtoday,
                onTime,
                feedbackPic,
                rating,
                suggestion
            });

            return res.status(201).json({message: "feedback submitted successfully..", createdFeedback});
          
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ messgae: "failed to submit..", error: err.message });
        }
    };


    // get all feedbacks
    async getAllFeedbacks(req, res) {
        try {
            const { feedbackId } = req.params;

            // return particular feedback if id is provided
            if(feedbackId){
                const feedback = await feedbackModel.findOne({ feedbackId }).sort({ createdAt : -1 });

                if(!feedback) {
                    return res.status(404).json({ message: "No such feedback found" });
                }
                return res.status(200).json({ message: "Feedback fetched successfully", feedback });
            }

            // return all the feedbacks if id is not provided
            const feedbacks = await feedbackModel.find().sort({ createdAt : -1 });

            if(feedbacks.length > 0){
                return res.status(200).json({ message: "All feedbacks fetched successfully", feedbacks });
            }
            else if(feedbacks.length == 0){
                return res.status(200).json({ message: "No feedbacks found", feedbacks: [] });
            }
            return res.status(500).json({ message: "Something went wrong" });
        }
        catch (err) {
            console.error('Get feedback error:', err);
            return res.status(500).json({ message: "Failed to fetch feedbacks", error: err.message });
        }
    };

    async deleteFeedback(req, res) {
        try{
            const { feedbackId } = req.body;

            // Delete area by areaId
            const deletedFeedback = await feedbackModel.deleteOne({ feedbackId });
            if(deletedFeedback.deletedCount > 0){
                return res.status(200).json({message: "Feedback deleted successfully", deletedFeedback: deletedFeedback});  // 200 OK
            }
            return res.status(404).json({message: "No such feedback found to delete"});  // 404 Not found
    
            } catch(err){
                console.log(err);
                return res.status(500).json({message: "Failed to delete feedback", error: err.message});  // 500 Internal server error
            }
        }

}

module.exports = new feedbackController();
