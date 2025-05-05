const express = require('express');
const { createVehicle, getAllVehicles, deleteVehicle } = require('../controllers/vehicle.controllers');
const route = express.Router();

route.post("/createVehicle", createVehicle);
route.get("/getAllVehicles/:vehicleId?", getAllVehicles);
route.delete("/deleteVehicle", deleteVehicle);

module.exports = route;