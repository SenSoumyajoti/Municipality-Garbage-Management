const express = require('express');
const { reqCollectionSubmit } = require('../controllers/reqCollection.controllers');
const route = express.Router();

route.post("/request",reqCollectionSubmit );


module.exports = route;