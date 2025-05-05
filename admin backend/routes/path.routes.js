const express = require('express');
const { createPath, getAllPaths, deletePath, addCheckPoint, deleteCheckPoint } = require('../controllers/path.controllers');
const route = express.Router();

route.post("/createPath", createPath);
route.post("/addCheckPoint", addCheckPoint);
route.delete("/deleteCheckPoint", deleteCheckPoint);
route.get("/getAllPaths/:pathId?", getAllPaths);
route.delete("/deletePath", deletePath);

module.exports = route;