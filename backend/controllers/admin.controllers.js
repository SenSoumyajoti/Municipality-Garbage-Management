const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const adminModel = require("../models/adminModel");
const genToken = require('../utils/genToken');

class adminController {
    async adminRegister(req, res) {
        try{
            const {fullName, username, email, password} = req.body;

            const user = await adminModel.findOne({email});
            if(user) {
                return res.status(409).json("You already have an account. Please log in");
            }

            const userNameCheck = await adminModel.findOne({username});
            if(userNameCheck) {
                return res.status(409).json("Username is not available. Please try another");
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
    
            const createdUser = await adminModel.create({
                fullName,
                username,
                email,
                password : hash
            });

            const sentUser = await adminModel.findById(createdUser._id).select("-password");

            const token = genToken(sentUser);
            res.cookie("token", token, {httpOnly : true});
            console.log("registered");
            return res.status(201).json({message: "Admin registration successful", user: sentUser});

        } catch(err) {
            console.error(err);
            return res.status(500).json({message: "Failed to register", error: err.message});
        }
    }

    async adminLogin(req, res){
        try{
            const {email, password} = req.body;

            const user = await adminModel.findOne({email});
    
            if(!user){
                return res.status(401).json({message: "Wrong email or password"});
            }
    
            const result = await bcrypt.compare(password, user.password);
    
            if(result){
                const sentUser = await adminModel.findById(user._id).select("-password");
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

    async adminLogout(req, res) {
        try{
            res.cookie("token", "");
            res.status(200).json({message: "Log out successful"})
        } catch(err){
            res.status(500).json({message: "Failed to log out"});
        }
    }
}

module.exports = new adminController()