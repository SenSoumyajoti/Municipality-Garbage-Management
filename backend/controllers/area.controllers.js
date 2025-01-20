// area.controllers.js

const areaModel = require("../models/areaModel");

class areaController {
    async createArea(req, res) {
        try{

            const { areaName, areaId } = req.body;
    
            // Check if area name already exists
            const areaNameCheck = await areaModel.findOne({areaName});
            if(areaNameCheck){
                console.log(areaNameCheck);
                return res.status(409).json("Area name is not available");  // 409 Conflict
            }
    
            // Check if area id already exists
            const areaIdCheck = await areaModel.findOne({areaId});
            if(areaIdCheck){
                return res.status(409).json("Area id is not available");  // 409 Conflict
            }
    
            // Create new area
            const createdArea = await areaModel.create({
                areaName,
                areaId
            });
    
            if(createdArea){
                return res.status(201).json({message: "Area created successfully"});  // 201 Created
            }

            return res.status(500).json({message: "Failed to create area"});  // 500 Internal server error

        } catch(err){
            console.error(err);
            return res.status(500).json({message: "Something went wrong", error: err.message});  // 500 Internal server error
        }

    }

    async getAllAreas(req, res) {
        try{
            const { areaId } = req.params;

            // Fetch specific area if areaId is provided
            if(areaId){
                const area = await areaModel.findOne({areaId});
                if(!area){
                    return res.status(404).json({message: "No such area found"});  // 404 Not found
                }
                return res.status(200).json({message: "Area fetched successfully", area: area});  // 200 OK
            }

            // Fetch all areas if no areaId is provided
            else{
                const areas = await areaModel.find();
                if(areas.length == 0){
                    return res.status(404).json({message: "No area found"});  // 404 Not found
                }
                return res.status(200).json({message: "Areas fetched successfully", areas: areas});  // 200 OK
            }

        } catch(err){
            console.error(err)
            return res.status(500).json({message: "Failed to fetch areas", error: err.message});  // 500 Internal server error
        }
    }

    async deleteArea(req, res) {
        try{

            const { areaId } = req.body;

            // Delete area by areaId
            const deletedArea = await areaModel.deleteOne({areaId});
            if(deletedArea.deletedCount > 0){
                return res.status(200).json({message: "Area deleted successfully", deletedArea: deletedArea});  // 200 OK
            }
            return res.status(404).json({message: "No such area found to delete"});  // 404 Not found

        } catch(err){
            console.log(err);
            return res.status(500).json({message: "Failed to delete area", error: err.message});  // 500 Internal server error
        }
    }
}

module.exports = new areaController();