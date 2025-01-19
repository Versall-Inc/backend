const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger");
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  const whiteListEmails = [
    "elifsaghbini@gmail.com",
    "khalifa.seck@protonmail.com",
    "arian.shariati@outlook.com",
    "mohammadmahdi82.e@gmail.com",
    "zrr.arshia@gmail.com",
    "zakeri.arshia@yahoo.com",
  ];

  if (!whiteListEmails.includes(email.toString().toLowerCase())) {
    return res.status(400).json({
      error:
        "It appears that your email address is not included in our beta testing list at this time. If you believe you should be on the list, please contact our team for assistance.",
    });
  }

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
    timezone,
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
    user.timezone = timezone ?? user.timezone;
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

    const expiary = req.user.exp;
    const expToFormat = expiary - Math.floor(Date.now() / 1000);
    const exp = expToFormat > 86400 ? "30d" : "24h";
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

    res.status(200).json({ user, token });
  } catch (err) {
    logger.error("Profile completion failed:", err);
    console.log(err);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getMe = async (req, res, next) => {
  const id = req.user.id;
  console.log(id);
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    logger.error("Get user failed:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
