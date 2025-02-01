const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

/**
 * Route: POST /send-emails
 * Description: Receives a list of user IDs, fetches their details, and sends emails.
 */
router.post("/send-emails", userController.sendEmailsToUsers);

module.exports = router;
