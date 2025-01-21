const express = require('express');
const upload = require("../configs/multerConfig");
const {adminRegister, adminLogin, adminLogout, adminEdit} = require('../controllers/admin.controllers');
const route = express.Router();

route.get("/register", (req, res) => {
    res.render("register");
});

route.post("/register", adminRegister);

route.get("/login", (req, res) => {
    res.render("login");
});

route.post("/login", adminLogin);
route.post("/edit", upload.single("image"), adminEdit);
route.get("/logout", adminLogout);

module.exports = route;