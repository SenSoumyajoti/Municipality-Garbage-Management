// path.controllers.js

const pathModel = require("../models/pathModel");

class pathController {
    async createPath(req, res) {
        try{

            const { pathName, pathId } = req.body;
    
            // Check if path name already exists
            const pathNameCheck = await pathModel.findOne({pathName});
            if(pathNameCheck){
                console.log(pathNameCheck);
                return res.status(409).json("Path name is not available");  // 409 Conflict
            }
    
            // Check if path id already exists
            const pathIdCheck = await pathModel.findOne({pathId});
            if(pathIdCheck){
                return res.status(409).json("Path id is not available");  // 409 Conflict
            }
    
            // Create new path
            const createdPath = await pathModel.create({
                pathName,
                pathId
            });
    
            if(createdPath){
                return res.status(201).json({message: "Path created successfully", createdPath: createdPath});  // 201 Created
            }

            return res.status(500).json({message: "Failed to create path"});  // 500 Internal server error

        } catch(err){
            console.error(err);
            return res.status(500).json({message: "Something went wrong", error: err.message});  // 500 Internal server error
        }

    }

    async addCheckPoint(req, res) {
        try{
            const { checkPoint, pathId } = req.body;
            console.log(pathId, checkPoint)

            const path = await pathModel.findOne({pathId});

            if(!path){
                return res.status(404).json({message: "No such path found"});  // 404 Not found
            }
            path.checkPoints.push(checkPoint);
            await path.save();
            return res.status(200).json({message: "Checkpoint added successfully", addedCheckPoint: checkPoint});
        } catch(err) {
            console.log(err);
        }
    }

    async deleteCheckPoint(req, res) {
        const { CPId, pathId } = req.body;

        if(!CPId) {
            return res.json({message: "No checkpoint ID provided"});
        }
        if(!pathId) {
            return res.json({message: "No path ID provided"});
        }

        const path = await pathModel.findOne({pathId});
        if(!path){
            return res.status(404).json({message: "No such path found"});  // 404 Not found
        }
        path.checkPoints.map(async (eachCheckPoint, idx) => {
            // console.log(eachCheckPoint)
            if(eachCheckPoint.CPId == CPId) {
                console.log(path.checkPoints, idx);
                
                path.checkPoints.splice(idx, 1);
                await path.save()
            }
        });
        return res.status(200).json({message: "Checkpoint deleted successfully"});  // 200 OK

    }

    async getAllPaths(req, res) {
        try{
            const { pathId } = req.params;

            // Fetch specific path if pathId is provided
            if(pathId){
                const path = await pathModel.findOne({pathId});
                if(!path){
                    return res.status(404).json({message: "No such path found"});  // 404 Not found
                }
                return res.status(200).json({message: "Path fetched successfully", path: path});  // 200 OK
            }

            // Fetch all paths if no pathId is provided
            else{
                const paths = await pathModel.find();
                if(paths.length == 0){
                    return res.status(404).json({message: "No path found"});  // 404 Not found
                }
                return res.status(200).json({message: "Paths fetched successfully", paths: paths});  // 200 OK
            }

        } catch(err){
            console.error(err)
            return res.status(500).json({message: "Failed to fetch paths", error: err.message});  // 500 Internal server error
        }
    }

    async deletePath(req, res) {
        try{

            const { pathId } = req.body;

            // Delete path by pathId
            const deletedPath = await pathModel.deleteOne({pathId});
            if(deletedPath.deletedCount > 0){
                return res.status(200).json({message: "Path deleted successfully", deletedPath: deletedPath});  // 200 OK
            }
            return res.status(404).json({message: "No such path found to delete"});  // 404 Not found

        } catch(err){
            console.log(err);
            return res.status(500).json({message: "Failed to delete path", error: err.message});  // 500 Internal server error
        }
    }
}

module.exports = new pathController();