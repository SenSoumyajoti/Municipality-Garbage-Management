const reqCollectionModel = require("../models/reqcollectionModel");


class reqCollectionController {
    async reqCollectionSubmit(req, res) {
        try{
            
            //const username=req.user.fullName;        
            const {address, quantity, phone_no,dropdown } = req.body;
            const reqId = Date.now() + "-" + Math.floor(Math.random() * 1000);

            const haverequest = await reqCollectionModel.findOne({ user: reqId,
                status: 'pending'});
            if(haverequest) {
                return res.status(409).json({success:false,message:'You have a pending request.please wait!.. '});
            }

    
            const createReqest = await reqCollectionModel.create({
                reqId, 
                address,quantity,phone_no,dropdown,status:'pending'
            });
            return res.status(201).json({message: "collection request submitted successfully", data:createReqest});

        } catch(err) {
            console.error(err);
            return res.status(500).json({message: "Failed to submit", error: err.message});
        }
    }
}


module.exports = new reqCollectionController();