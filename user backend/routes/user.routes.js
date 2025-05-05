const express = require('express');
const upload = require("../configs/multerConfig");
const {userRegister, userLogin, userLogout, userEdit} = require('../controllers/user.controllers');
const route = express.Router();

route.get("/register", (req, res) => {
    res.render("register");
});

route.post("/register", userRegister);

route.get("/login", (req, res) => {
    res.render("login");
});

route.post("/login", userLogin);
route.post("/edit", upload.single("image"), userEdit);
route.get("/logout", userLogout);

module.exports = route;