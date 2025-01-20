const { v4:uuidv4 } = require('uuid');
const trackingStatusModel = require("../models/trackingStatusModel");

class trackingStatusController {
    async createStatus(req, res) {
        try{

            const { title, message, pathId, dustbinId, driverUsername, vehicleReg } = req.body;

            // Finding no of exsisting tracking statuses for status ID
            const existingStatuses = await trackingStatusModel.find();
            // const length = existingStatuses.length;
            // const timeStamp = new Date();

            const createdStatus = await trackingStatusModel.create({
                trackingStatusId: `TRK-STS-${uuidv4()}`,
                title,
                message,
                pathId,
                dustbinId,
                driverUsername,
                vehicleReg
            });

            if(createdStatus){
                return res.status(201).json({message: "Tracking status messsage created successfully", createdStatus: createdStatus});  // 201 Created
            }
            return res.status(500).json({message: "Failed to create tracking status message"});  // 500 Internal server error

        } catch(err) {
            console.error(err);
            return res.status(500).json({message: "Something went wrong", error: err.message});  // 500 Internal server error
        }
    }

    async getAllStatuses(req, res) {
        try {

            // Finding the query name and value for specific search
            const queryParameters = req.query;
            const entries = Object.entries(queryParameters)

            // If search filter is provided, return the specific statuses
            if(entries.length > 0){
                let queryName, queryVal;
                entries.map(([key, value]) => {
                    queryName = key
                    queryVal = value
                });

                let statuses;

                // If filter is timestamp
                if(queryName == 'createdAt'){
                    const timeArr = queryVal.split('to');
                    const start = timeArr[0];

                    const startDate = new Date(start)
                    startDate.setHours(0,0,0,0)

                    let endDate
                    if(timeArr.length > 1){
                        const end = timeArr[1];
                        endDate = new Date(end)
                    }
                    else{
                        endDate = new Date(start)
                    }
                    endDate.setHours(23,59,59,999)

                    statuses = await trackingStatusModel.find({
                        createdAt : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }).sort({ createdAt: -1 })
                }

                // If filter is other than timestamp
                else{
                    statuses = await trackingStatusModel.find({[queryName] : queryVal}).sort({ createdAt: -1 })
                }
                
                if(statuses.length > 0){
                    return res.status(200).json({message: "Tracking status message fetched succesfully",statuses});  // 200 OK
                }
                return res.status(404).json({message: "No such tracking status found"});  // 500 Internal server error
            }

            // If no search filter is provided, return all the statuses
            else{
                const statuses = await trackingStatusModel.find().sort({ createdAt: -1 })
                
                if(statuses.length > 0){
                    return res.status(200).json({message: "All Tracking status message fetched succesfully",statuses});  // 200 OK
                }
                return res.status(404).json({message: "No tracking status found"});  // 500 Internal server error
            }
            
        } catch(err) {
            console.error(err);
            return res.status(500).json({message: "Something went wrong", error: err.message});  // 500 Internal server error
        }
    }
}

module.exports = new trackingStatusController()