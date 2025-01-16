const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");
const validate = require("../middlewares/validate");

// Import Joi schemas
const {
  createChannelSchema,
  updateChannelSchema,
} = require("../validators/channelValidators");

// Create channel
router.post(
  "/",
  validate(createChannelSchema),
  channelController.createChannel
);

// Get all channels
router.get("/", channelController.getAllChannels);

// Get channel by ID
router.get("/:channelId", channelController.getChannelById);

// Update channel
router.put(
  "/:channelId",
  validate(updateChannelSchema),
  channelController.updateChannel
);

// Delete channel
router.delete("/:channelId", channelController.deleteChannel);

module.exports = router;
