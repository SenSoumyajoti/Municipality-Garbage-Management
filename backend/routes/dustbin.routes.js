const express = require('express');
const { createDustbin, getAllDustbins, deleteDustbin } = require('../controllers/dustbin.controllers');
const route = express.Router();

route.post("/createDustbin", createDustbin);
route.get("/getAllDustbins/:pathId", getAllDustbins);
route.delete("/deleteDustbin", deleteDustbin);

module.exports = route;