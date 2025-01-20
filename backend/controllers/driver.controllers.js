const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const driverModel = require("../models/driverModel");
const genToken = require('../utils/genToken');

class driverController {
    async driverRegister(req, res) {
        try{
            const {fullName, username, email, password} = req.body;

            const driver = await driverModel.findOne({email});
            if(driver) {
                return res.status(409).json("You already have an account. Please log in");
            }

            const userNameCheck = await driverModel.findOne({username});
            if(userNameCheck) {
                return res.status(409).json("Username is not available. Please try another");
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
    
            const createdDriver = await driverModel.create({
                fullName,
                username,
                email,
                password : hash
            });

            const sentDriver = await driverModel.findById(createdDriver._id).select("-password");

            const token = genToken(sentDriver);
            res.cookie("token", token, {httpOnly : true});
            console.log("registered");
            return res.status(201).json({message: "driver registration successful", addedDriver: sentDriver});

        } catch(err) {
            console.error(err);
            return res.status(500).json({message: "Failed to register", error: err.message});
        }
    }

    async driverLogin(req, res){
        try{
            const {username, password} = req.body;

            const user = await driverModel.findOne({username});
    
            if(!user){
                return res.status(401).json({message: "Wrong username or password"});
            }
    
            const result = await bcrypt.compare(password, user.password);
    
            if(result){
                const sentUser = await driverModel.findById(user._id).select("-password");
                const token = genToken(sentUser);
                res.cookie("token", token, {httpOnly : true});
                return res.status(200).json({message: "Log in successful", user: sentUser});
            } else {
                return res.status(401).json({message: "Wrong email or password"});
            }
        } catch(err) {
            console.error(err);
            return res.status(500).json({message: "Failed to log in", error: err.message});
        }
    }

    async driverLogout(req, res) {
        try{
            res.cookie("token", "");
            res.status(200).json({message: "Log out successful"})
        } catch(err){
            res.status(500).json({message: "Failed to log out"});
        }
    }

    async getAllDrivers(req, res) {
        try{
            const { username } = req.params;

            // Fetch specific path if pathId is provided
            if(username){
                const user = await driverModel.findOne({username}).select("-password");
                if(!user){
                    return res.status(404).json({message: "No such driver found"});  // 404 Not found
                }
                return res.status(200).json({message: "Driver details fetched successfully", driver: driver});  // 200 OK
            }

            // Fetch all paths if no pathId is provided
            else{
                const drivers = await driverModel.find().select("-password");
                if(drivers.length == 0){
                    return res.status(404).json({message: "No driver found"});  // 404 Not found
                }
                return res.status(200).json({message: "Drivers fetched successfully", drivers: drivers});  // 200 OK
            }

        } catch(err){
            console.error(err)
            return res.status(500).json({message: "Failed to fetch drivers", error: err.message});  // 500 Internal server error
        }
    }
}

module.exports = new driverController()