const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

router.post("/seller/send-mail", emailController.sendEmail);

module.exports = router;
