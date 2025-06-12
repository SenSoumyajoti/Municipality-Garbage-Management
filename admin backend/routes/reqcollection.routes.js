const express = require('express');
const route = express.Router();
const { submitReqCollection, getAllreqCollection } = require('../controllers/reqCollection.controllers');

route.get("/getAllReqCollections", getAllreqCollection);
route.get("/getAllReqCollections/:reqId", getAllreqCollection);

module.exports = route;