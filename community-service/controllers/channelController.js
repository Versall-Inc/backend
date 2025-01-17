const axios = require("axios");
const { Channel, ChannelMember } = require("../models");

/**
 * Create a new channel
 */
exports.createChannel = async (req, res) => {
  const userId = req.user.id;
  try {
    const { name, isPublic } = req.body;

    const channel = await Channel.create({
      name,
      isPublic,
      ownerId: userId,
    });

    await ChannelMember.create({
      channelId: channel.id,
      userId: userId,
    });

    return res.status(201).json(channel);
  } catch (error) {
    console.error("Error creating channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all channels
 */
exports.getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.findAll();
    return res.json(channels);
  } catch (error) {
    console.error("Error getting channels:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a channel by ID
 */
exports.getChannelById = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    return res.json(channel);
  } catch (error) {
    console.error("Error getting channel by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get my channels
 */
exports.getMyChannels = async (req, res) => {
  try {
    const userId = req.user.id;
    const channels = await Channel.findAll({
      where: { ownerId: userId },
    });
    return res.json(channels);
  } catch (error) {
    console.error("Error getting my channels:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get my feed channels
 */
exports.getMyFeedChannels = async (req, res) => {
  try {
    const userId = req.user.id;
    const channels = await ChannelMember.findAll({
      where: { userId },
    });
    return res.json(channels);
  } catch (error) {
    console.error("Error getting my feed channels:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update channel
 */
exports.updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { name, isPublic } = req.body;

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    channel.name = name ?? channel.name;
    channel.isPublic =
      typeof isPublic === "boolean" ? isPublic : channel.isPublic;
    await channel.save();

    return res.json(channel);
  } catch (error) {
    console.error("Error updating channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a channel
 */
exports.deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    await channel.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Join a channel (the authenticated user joins)
 */
exports.joinChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Insert a row into ChannelMember for userId
    await ChannelMember.create({
      channelId,
      userId,
    });

    return res.json({ message: "Joined channel successfully" });
  } catch (error) {
    console.error("Error adding member to channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Leave a channel (the authenticated user leaves)
 */
exports.leaveChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Remove the row in ChannelMember
    await ChannelMember.destroy({
      where: {
        channelId,
        userId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error removing member from channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Add a member to a channel (owner can add another user)
 */
exports.addMemberToChannel = async (req, res) => {
  try {
    const ownerId = req.user.id; // The user making the request
    const { channelId } = req.params;
    const { userId } = req.body; // The user being added

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // If channel is private, only the owner can add members
    if (!channel.isPublic && channel.ownerId !== ownerId) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this private channel" });
    }

    await ChannelMember.create({
      channelId,
      userId,
    });

    return res.status(200).json({ message: "Member added successfully" }); // CHANGED: return a response
  } catch (error) {
    console.error("Error adding member to channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Remove a member from a channel (owner can remove any user)
 */
exports.deleteMemberFromChannel = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { channelId } = req.params;
    const { userId } = req.body;

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Only the channel owner can remove a member
    if (channel.ownerId !== ownerId) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this channel" });
    }

    await ChannelMember.destroy({
      where: {
        channelId,
        userId,
      },
    });

    return res.status(200).json({ message: "Member removed successfully" }); // CHANGED: return a response
  } catch (error) {
    console.error("Error removing member from channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all members (userIds) of a channel
 */
exports.getMembers = async (req, res) => {
  try {
    const { channelId } = req.params;
    const members = await ChannelMember.findAll({
      where: { channelId },
    });
    return res.json(members);
  } catch (error) {
    console.error("Error getting members of channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get detailed member info from external user-management service
 */
exports.getMembersDetail = async (req, res) => {
  try {
    const { channelId } = req.params;
    const members = await ChannelMember.findAll({
      where: { channelId },
    });
    const userIds = members.map((m) => m.userId);

    if (userIds.length === 0) {
      return res.json([]);
    }

    // Call user-management microservice in bulk
    // Make sure you import axios and have the correct endpoint
    const userData = await axios.post("http://user-management/bulk", {
      ids: userIds,
    });

    // userData is the axios response object
    // userData.data is the actual array of user objects
    return res.json(userData.data);
  } catch (error) {
    console.error("Error getting members detail:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
