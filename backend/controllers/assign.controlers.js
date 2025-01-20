const { model } = require('mongoose');
const assignModel = require('../models/assignModel');
const { select } = require('async');

class assignController {
    async saveAssign(req, res) {
        try {
            const { pathId } = req.params;
            const { driverUsername, vehicleReg } = req.body;

            const existingAssign = await assignModel.findOne({pathId});

            let assigned;

            if(existingAssign) {
                assigned = await assignModel.findOneAndUpdate({pathId : pathId}, {
                    driverUsername,
                    vehicleReg
                }, {new: true})
            }
            else{
                assigned = await assignModel.create({
                    pathId,
                    driverUsername,
                    vehicleReg
                });
            }
            
            if(assigned){
                return res.status(201).json({ message: "Assigned successfully", assigned: assigned });
            }
            else {
                return res.status(500).json({ message: "Failed to assign" });
            }
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({ message: "Something went wrong", error: err.message });
        }

    }

    async deleteAssign(req, res) {
        try{

            const { pathId } = req.params;
    
            const deleted = await assignModel.deleteOne({pathId});
            if(deleted.deletedCount) {
                return res.status(201).json({ message: "Assignment deleted successfully" });
            }
            return res.status(500).json({ message: "Failed to delete" });

        }
        catch(err){
            console.log(err);
            return res.status(500).json({ message: "Something went wrong", error: err.message });
        }
    }

    async getAllAssigns(req, res) {
        try {
            let { pathId, driverUsername } = req.params;
            const { populatePath, populateDustbin, populateDriver, populateVehicle } = req.query;

            if(pathId == '_'){
                pathId = undefined
            }

            if(pathId) {
                let assignment = await assignModel.findOne({pathId});
                
                if(assignment){
                    // if(populatePath == 'true'){
                        // In your function to populate pathId
                        if (populatePath === 'true') {
                            assignment = await assignment.populate({
                                path: 'pathId',
                                localField: 'pathId',      // Field in assignModel to match
                                foreignField: 'pathId',    // Field in pathModel to match
                            });
                        }

                        if(populateDustbin == 'true'){
                            assignment = await assignment.populate({
                                path: 'pathId.dustbins',
                                localField: 'dustbins',
                                foreignField: 'dustbinId' 
                            })
                        }

                    // }
                    if(populateDriver == 'true'){
                        assignment = await assignment.populate({
                            path: 'driverUsername',
                            model: 'driver',
                            localField: 'username',
                            foreignField: 'username',
                        });
                        // assignment = assignment.select("-password");
                    }
                    if(populateVehicle == 'true'){
                        assignment = await assignment.populate({
                            path: 'vehicleReg',
                            model: 'vehicle',
                            localField: 'vehicleReg',
                            foreignField: 'vehicleReg'
                        });
                    }
                    return res.status(200).json({ message: "Assignment fetched successfully", assignment: assignment });
                }
                return res.status(404).json({ message: "No assignment found for the path" });
            }

            if(driverUsername) {
                let assignment = await assignModel.findOne({driverUsername});
                
                if(assignment){
                    // if(populatePath == 'true'){
                        // In your function to populate pathId
                        if (populatePath === 'true') {
                            assignment = await assignment.populate({
                                path: 'pathId',
                                localField: 'pathId',      // Field in assignModel to match
                                foreignField: 'pathId',    // Field in pathModel to match
                            });
                        }

                        if(populateDustbin == 'true'){
                            assignment = await assignment.populate({
                                path: 'pathId.dustbins',
                                localField: 'dustbins',
                                foreignField: 'dustbinId' 
                            })
                        }

                    // }
                    if(populateDriver == 'true'){
                        assignment = await assignment.populate({
                            path: 'driverUsername',
                            model: 'driver',
                            localField: 'username',
                            foreignField: 'username',
                        });
                        // assignment = assignment.select("-password");
                    }
                    if(populateVehicle == 'true'){
                        assignment = await assignment.populate({
                            path: 'vehicleReg',
                            model: 'vehicle',
                            localField: 'vehicleReg',
                            foreignField: 'vehicleReg'
                        });
                    }
                    return res.status(200).json({ message: "Assignment fetched successfully", assignment: assignment });
                }
                return res.status(404).json({ message: "No assignment found for the path" });
            }

            const assignments = await assignModel.find();
            if(assignments.length > 0){
                if (populatePath === 'true') {
                    for(let eachAssignment of assignments) {
                        eachAssignment = await eachAssignment.populate({
                            path: 'pathId',
                            localField: 'pathId',      // Field in assignModel to match
                            foreignField: 'pathId',    // Field in pathModel to match
                        });
                    }
                }
                if(populateDustbin == 'true'){
                    for(let eachAssignment of assignments) {
                        eachAssignment = await eachAssignment.populate({
                            path: 'pathId.dustbins',
                            localField: 'dustbins',
                            foreignField: 'dustbinId' 
                        })
                    }
                }
                if(populateDriver == 'true'){
                    for(let eachAssignment of assignments) {
                        eachAssignment = await eachAssignment.populate({
                            path: 'driverUsername',
                            model: 'driver',
                            localField: 'username',
                            foreignField: 'username',
                            // select: "-password"
                        });
                        // eachAssignment = eachAssignment.select("-password")
                    }
                }
                if(populateVehicle == 'true'){
                    for(let eachAssignment of assignments) {
                        eachAssignment = await eachAssignment.populate({
                            path: 'vehicleReg',
                            model: 'vehicle',
                            localField: 'vehicleReg',
                            foreignField: 'vehicleReg'
                        });
                    }
                }
                return res.status(200).json({ message: "Assignments fetched successfully", assignments: assignments });
            }
            return res.status(200).json({ message: "No assignment found", assignments: [] });
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({ message: "Something went wrong", error: err.message });
        }
    }
}

module.exports = new assignController;