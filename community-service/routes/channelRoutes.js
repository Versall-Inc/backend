const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");
const validate = require("../middlewares/validate");

// Import Joi schemas
const {
  createChannelSchema,
  updateChannelSchema,
  addMemberSchema,
} = require("../validators/channelValidators");

// ------------------------
// Channel CRUD Routes
// ------------------------

// Create a new channel
router.post(
  "/",
  validate(createChannelSchema),
  channelController.createChannel
);

// Get all channels
router.get("/", channelController.getAllChannels);

// Get a specific channel by ID
router.get("/:channelId", channelController.getChannelById);

// Get all channels that a user is a member of
router.get("/user/:userId", channelController.getMyFeedChannels);

// Get all channels that a user owns
router.get("/owner/:userId", channelController.getMyChannels);

// Update a specific channel by ID
router.put(
  "/:channelId",
  validate(updateChannelSchema),
  channelController.updateChannel
);

// Delete a specific channel by ID
router.delete("/:channelId", channelController.deleteChannel);

// ------------------------
// Channel Membership Routes
// ------------------------

// Join a channel (authenticated user joins)
router.post("/:channelId/join", channelController.joinChannel);

// Leave a channel (authenticated user leaves)
router.post("/:channelId/leave", channelController.leaveChannel);

// Add a member to a channel (channel owner adds another user)
router.post(
  "/:channelId/members",
  validate(addMemberSchema),
  channelController.addMemberToChannel
);

// Remove a member from a channel (channel owner removes a user)
router.delete(
  "/:channelId/members/:userId",
  channelController.deleteMemberFromChannel
);

// Get all members (user IDs) of a channel
router.get("/:channelId/members", channelController.getMembers);

// Get detailed member information by fetching from user-management service
router.get("/:channelId/members/detail", channelController.getMembersDetail);

module.exports = router;
