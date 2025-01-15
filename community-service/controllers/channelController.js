const ChannelModel = require("../models/channelModel");
const { v4: uuidv4 } = require("uuid");

/**
 * @desc Create a new channel
 * @route POST /channels
 */
exports.createChannel = async (req, res) => {
  try {
    const { name, handle, isPrivate } = req.body;

    // Check if the handle already exists
    const existingChannel = await ChannelModel.findByHandle(handle);
    if (existingChannel) {
      return res.status(400).json({ message: "Channel handle already exists" });
    }

    const photo = req.file ? req.file.filename : null;

    // Create the channel
    await ChannelModel.create({
      name,
      handle,
      isPrivate: isPrivate === "true", // Convert string "true"/"false" to boolean
      ownerId: req.user.id, // Extracted from authentication middleware
      photo,
    });

    res.status(201).json({ message: "Channel created successfully" });
  } catch (err) {
    console.error("Error creating channel:", err.message);
    res
      .status(500)
      .json({ message: "Error creating channel", error: err.message });
  }
};

/**
 * @desc Get all channels
 * @route GET /channels
 */
exports.getChannels = async (req, res) => {
  try {
    const { isPrivate } = req.query;

    // If isPrivate is provided, convert it to boolean
    const isPrivateFilter =
      isPrivate === "true" ? true : isPrivate === "false" ? false : null;

    // Fetch all channels (with optional isPrivate filter)
    const channels = await ChannelModel.findAll(isPrivateFilter);

    res.status(200).json({ channels });
  } catch (err) {
    console.error("Error fetching channels:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching channels", error: err.message });
  }
};

/**
 * @desc Get a single channel by handle
 * @route GET /channels/:handle
 */
exports.getChannelByHandle = async (req, res) => {
  try {
    const { handle } = req.params;

    // Fetch the channel by handle
    const channel = await ChannelModel.findByHandle(handle);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json({ channel });
  } catch (err) {
    console.error("Error fetching channel:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching channel", error: err.message });
  }
};

/**
 * @desc Delete a channel by ID
 * @route DELETE /channels/:id
 */
exports.deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the channel
    await ChannelModel.deleteById(id);

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (err) {
    console.error("Error deleting channel:", err.message);
    res
      .status(500)
      .json({ message: "Error deleting channel", error: err.message });
  }
};
