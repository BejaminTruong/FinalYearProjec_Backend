const express = require("express");
const router = express.Router();
const { logIn, signUp } = require("../controllers/auth");
router.post("/login", logIn);
router.post("/signup", signUp);
module.exports = router;
