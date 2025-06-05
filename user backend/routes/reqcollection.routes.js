const express = require('express');
const route = express.Router();
const { submitReqCollection, getAllreqCollection } = require('../controllers/reqCollection.controllers');

route.post("/submit", submitReqCollection );
route.get("/getAllReqCollections", getAllreqCollection);
route.get("/getAllReqCollections/:reqId", getAllreqCollection);

module.exports = route;