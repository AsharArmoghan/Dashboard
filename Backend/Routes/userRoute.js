const express = require("express");
const User = require("../Controllers/UserController");
const router = express.Router();


router.post("/login", User.login);

router.post("/signup", User.CreateUser);


module.exports = router;
