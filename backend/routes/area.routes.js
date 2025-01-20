const express = require('express');
const { createArea, getAllAreas, deleteArea } = require('../controllers/area.controllers');
const route = express.Router();

route.post("/createArea", createArea);
route.get("/getAllAreas/:areaId?", getAllAreas);
route.delete("/deleteArea", deleteArea);

module.exports = route;