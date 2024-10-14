const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');
const userSchema = require('../schemas/userSchema');

exports.register = async (req, res) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    firstName,
    middleName,
    lastName,
    address,
    phoneNumber
  } = req.body;

  if (password === undefined || password === null) {
    return res.status(400).json({ error: "Password required" });
  }
  if (confirmPassword === undefined || confirmPassword === null) {
    return res.status(400).json({ error: "confirmPassword required" });
  }
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      middleName,
      lastName,
      address,
      phoneNumber
    });
    res.status(201).json(user);
  } catch (err) {
    logger.error('User registration failed:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });
    console.log(token);
    console.log(user.id);

    res.json({ token });
    
  } catch (err) {
    logger.error('Login failed:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};