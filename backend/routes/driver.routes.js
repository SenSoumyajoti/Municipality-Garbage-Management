const express = require('express');
const { driverRegister, driverLogin, driverLogout, getAllDrivers } = require('../controllers/driver.controllers');
const route = express.Router();

route.post("/register", driverRegister);
route.post("/login", driverLogin);
route.get("/logout", driverLogout);
route.get("/getAllDrivers/:username?", getAllDrivers);

module.exports = route;