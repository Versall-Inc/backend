const ChannelUserModel = require('../models/channelUserModel');

/**
 * @desc Add a user to a channel
 * @route POST /channels/:channelId/join
 */
exports.joinChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.id; // Extracted from auth middleware

    if (!channelId) {
      return res.status(400).json({ message: 'Channel ID is required' });
    }

    await ChannelUserModel.addUserToChannel(channelId, userId);

    res.status(200).json({ message: 'User joined the channel successfully' });
  } catch (err) {
    console.error('Error joining channel:', err.message);
    res.status(500).json({ message: 'Error joining channel', error: err.message });
  }
};

/**
 * @desc Get all users in a channel
 * @route GET /channels/:channelId/users
 */
exports.getUsersInChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId) {
      return res.status(400).json({ message: 'Channel ID is required' });
    }

    const users = await ChannelUserModel.getUsersInChannel(channelId);

    res.status(200).json({ users });
  } catch (err) {
    console.error('Error fetching users in channel:', err.message);
    res.status(500).json({ message: 'Error fetching users in channel', error: err.message });
  }
};

/**
 * @desc Remove a user from a channel
 * @route DELETE /channels/:channelId/users/:userId
 */
exports.removeUserFromChannel = async (req, res) => {
  try {
    const { channelId, userId } = req.params;

    if (!channelId || !userId) {
      return res.status(400).json({ message: 'Channel ID and User ID are required' });
    }

    await ChannelUserModel.removeUserFromChannel(channelId, userId);

    res.status(200).json({ message: 'User removed from the channel successfully' });
  } catch (err) {
    console.error('Error removing user from channel:', err.message);
    res.status(500).json({ message: 'Error removing user from channel', error: err.message });
  }
};
