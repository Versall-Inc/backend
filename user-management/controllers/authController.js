const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger");
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const isUserTaken = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }, { phoneNumber }],
      },
    });
    if (isUserTaken) {
      return res
        .status(400)
        .json({ error: "Email, username or phone number is already taken." });
    }
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
    });
    res.status(201).json(user);
  } catch (err) {
    logger.error("User registration failed:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.login = async (req, res) => {
  const { email, username, password, remember } = req.body;

  if ((!email && !username) || !password) {
    return res
      .status(400)
      .json({ error: "Email/Username and password are required." });
  }

  try {
    let user = null;
    if (email) {
      user = await User.findOne({
        where: {
          email,
        },
      });
    } else {
      user = await User.findOne({
        where: {
          username,
        },
      });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    let exp = remember === true ? "30d" : "24h";
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        profileCompleted: user.profileCompleted,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: exp,
      }
    );

    res.json({ token });
  } catch (err) {
    logger.error("Login failed:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.completeProfile = async (req, res) => {
  const id = req.user.id;
  const {
    firstname,
    lastname,
    address,
    country,
    city,
    accountStatus,
    subscriptionStatus,
    refercode,
    referredBy,
    url_linkedin,
    url_github,
    url_website,
  } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (user.profileCompleted) {
      return res.status(400).json({ error: "Profile already completed." });
    }

    user.firstname = firstname ?? user.firstname;
    user.lastname = lastname ?? user.lastname;
    user.profileCompleted = true;
    user.address = address ?? user.address;
    user.country = country ?? user.country;
    user.city = city ?? user.city;
    user.accountStatus = accountStatus ?? user.accountStatus;
    user.subscriptionStatus = subscriptionStatus ?? user.subscriptionStatus;
    user.refercode = refercode ?? user.refercode;
    user.referredBy = referredBy ?? user.referredBy;
    user.url_linkedin = url_linkedin ?? user.url_linkedin;
    user.url_github = url_github ?? user.url_github;
    user.url_website = url_website ?? user.url_website;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    logger.error("Profile completion failed:", err);
    console.log(err);
    res.status(500).json({ error: "Internal server error." });
  }
};
