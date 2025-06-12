const reqCollectionModel = require("../models/reqcollectionModel");


class reqCollectionController {
    // get all collection requests
    async getAllreqCollection(req, res) {
        try {
            const { reqId } = req.params;
            const { userId } = req.query;

            // return particular collection request if id is provided
            if(reqId){
                const reqCollection = await reqCollectionModel.findOne({ reqId }).sort({ createdAt : -1 });

                if(!reqCollection) {
                    return res.status(404).json({ message: "No such request found" });
                }
                return res.status(200).json({ message: "Request fetched successfully", reqCollection });
            }

            if( userId ) {
                const reqCollection = await reqCollectionModel.find({ userId }).sort({ createdAt : -1 });

                if(reqCollection.length == 0) {
                    return res.status(200).json({ message: "No requests yet" });
                }
                return res.status(200).json({ message: "Requests fetched successfully", reqCollection });
            }

            // return all the collection requests if id is not provided
            const reqCollections = await reqCollectionModel.find().sort({ createdAt : -1 });

            if(reqCollections.length > 0){
                return res.status(200).json({ message: "All feedbacks fetched successfully", reqCollections });
            }
            else if(reqCollections.length == 0){
                return res.status(200).json({ message: "No collection requests found", reqCollections: [] });
            }
            return res.status(500).json({ message: "Something went wrong" });
        }
        catch (err) {
            console.error('Get collection request error:', err);
            return res.status(500).json({ message: "Failed to fetch collection requests", error: err.message });
        }
    };
}


module.exports = new reqCollectionController();