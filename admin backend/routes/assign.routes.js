const express = require('express');
const { saveAssign, deleteAssign, getAllAssigns } = require('../controllers/assign.controlers');
const route = express();

route.post("/save/:pathId", saveAssign);
route.delete("/delete/:pathId", deleteAssign);
route.get("/getAllAssigns/:pathId?/:driverUsername?", getAllAssigns)

module.exports = route;