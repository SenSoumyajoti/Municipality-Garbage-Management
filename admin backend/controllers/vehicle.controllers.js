// dustbin.controllers.js

// const pathModel = require("../models/pathModel");
const vehicleModel = require("../models/vehicleModel");

class vehicleController {
    async createVehicle(req, res) {
        try{

            const { vehicleId, vehicleReg, capacity } = req.body;
    
            // Check if vehicle id already exists
            const vehicleIdCheck = await vehicleModel.findOne({vehicleId});
            if(vehicleIdCheck){
                return res.status(409).json({message: "Vehicle id is not available"});  // 409 Conflict
            }

            // Check if vehicle already registered by Reg No.
            const vehicleRegCheck = await vehicleModel.findOne({vehicleReg});
            if(vehicleRegCheck){
                return res.status(409).json({message: "Vehicle is already registered"});  // 409 Conflict
            }
    
            // Create new dustbin
            const addedVehicle = await vehicleModel.create({
                vehicleId,
                vehicleReg,
                capacity
            });

            if(addedVehicle){
                return res.status(201).json({message: "Vehicle added successfully", addedVehicle: addedVehicle});  // 201 Created
            }

            return res.status(500).json({message: "Failed to create vehicle"});  // 500 Internal server error

        } catch(err){
            console.error(err);
            return res.status(500).json({message: "Something went wrong", error: err.message});  // 500 Internal server error
        }

    }

    async getAllVehicles(req, res) {
        try{

            const { vehicleId } = req.params;

            // Fetch particular vehicle details if vehicle id is provided
            if(vehicleId){
                const vehicle = await vehicleModel.findOne({ vehicleId });
                if(vehicle){
                    return res.status(200).json({message: "Vehicle fetched successfully", vehicle: vehicle});  // 200 OK
                }
                return res.status(404).json({message: "No such vehicle found"});  // 404 Not found
            }

            // Fetch all vehicle details if no vehicle id is provided
            const vehicles = await vehicleModel.find();
            if(vehicles){
                return res.status(200).json({message: "Vehicle fetched successfully", vehicles: vehicles});  // 200 OK
            }
            return res.status(200).json({message: "No vehicles are registered", vehicles: []});  // 404 Not found
            

        } catch(err){
            console.error(err)
            return res.status(500).json({message: "Failed to fetch dustbins", error: err.message});  // 500 Internal server error
        }
    }

    async deleteVehicle(req, res) {
        try{

            const { vehicleId } = req.body;

            // Delete dustbin by dustbinId
            const deletedVehicle = await vehicleModel.deleteOne({ vehicleId });
            if(deletedVehicle.deletedCount > 0){
                return res.status(200).json({message: "Dustbin vehicle successfully"});  // 200 OK
            }
            return res.status(404).json({message: "No such vehicle found to delete"});  // 404 Not found

        } catch(err){
            console.log(err);
            return res.status(500).json({message: "Failed to delete vehicle", error: err.message});  // 500 Internal server error
        }
    }
}

module.exports = new vehicleController;