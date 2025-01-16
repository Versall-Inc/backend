const { Channel } = require("../models");

exports.createChannel = async (req, res) => {
  const userId = req.user.id;
  try {
    const { name, isPublic } = req.body;
    const channel = await Channel.create({
      name,
      isPublic,
      createdBy: userId,
      members: [userId],
    });
    return res.status(201).json(channel);
  } catch (error) {
    console.error("Error creating channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.findAll();
    return res.json(channels);
  } catch (error) {
    console.error("Error getting channels:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

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

exports.addMember = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { channelId } = req.params;
    const { userId } = req.body;

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    if (channel.members.includes(userId)) {
      return res.status(400).json({ error: "User is already a member" });
    }

    channel.members.push(userId);
    await channel.save();

    return res.json(channel);
  } catch (error) {
    console.error("Error adding member to channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

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
