module.exports = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }
  req.user = { id: userId };
  next();
};
