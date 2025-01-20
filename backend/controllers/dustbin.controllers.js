// dustbin.controllers.js

const pathModel = require("../models/pathModel");
const dustbinModel = require("../models/dustbinModel");

class dustbinController {
    async createDustbin(req, res) {
        try{

            const { dustbinId, dustbinNo, pathId, coords } = req.body;
    
            // Check if dustbin id already exists
            const dustbinIdCheck = await dustbinModel.findOne({dustbinId});
            if(dustbinIdCheck){
                return res.status(409).json({message: "Dustbin id is not available"});  // 409 Conflict
            }
    
            // Create new dustbin
            const addedDustbin = await dustbinModel.create({
                dustbinId,
                dustbinNo,
                pathId,
                coords
            });
    
            if(addedDustbin){
                const path = await pathModel.findOne({ pathId });
                path.dustbins.push(addedDustbin.dustbinId);
                path.noOfDustbins++;
                await path.save();
                return res.status(201).json({message: "Dustbin added successfully", addedDustbin: addedDustbin});  // 201 Created
            }

            return res.status(500).json({message: "Failed to create dustbin"});  // 500 Internal server error

        } catch(err){
            console.error(err);
            return res.status(500).json({message: "Something went wrong", error: err.message});  // 500 Internal server error
        }

    }

    async getAllDustbins(req, res) {
        try{

            const { pathId } = req.params;

            // Fetch all dustbins of the provided path
            const dustbins = await dustbinModel.find({ pathId });
            if(dustbins.length == 0){
                return res.status(200).json({message: "No dustbin found", dustbins: []});  // 200 OK
            }
            return res.status(200).json({message: "Dustbins fetched successfully", dustbins: dustbins});  // 200 OK

        } catch(err){
            console.error(err)
            return res.status(500).json({message: "Failed to fetch dustbins", error: err.message});  // 500 Internal server error
        }
    }

    async deleteDustbin(req, res) {
        try{

            const { dustbinId, pathId } = req.body;

            // Delete dustbin by dustbinId
            const deletedDustbin = await dustbinModel.deleteOne({ dustbinId });
            if(deletedDustbin.deletedCount > 0){
                let path = await pathModel.findOne({ pathId });
                path.dustbins = path.dustbins.filter(element => element != dustbinId);
                path.noOfDustbins--;
                await path.save();
                return res.status(200).json({message: "Dustbin deleted successfully"});  // 200 OK
            }
            return res.status(404).json({message: "No such dustbin found to delete"});  // 404 Not found

        } catch(err){
            console.log(err);
            return res.status(500).json({message: "Failed to delete dustbin", error: err.message});  // 500 Internal server error
        }
    }
}

module.exports = new dustbinController;