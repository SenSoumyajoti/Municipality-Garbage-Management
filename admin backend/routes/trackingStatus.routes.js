const express = require('express');
const { createStatus, getAllStatuses } = require('../controllers/trackingStatus.controllers');
const route = express.Router();

route.post("/create", createStatus)
route.get("/getAllStatuses", getAllStatuses)

module.exports = route;