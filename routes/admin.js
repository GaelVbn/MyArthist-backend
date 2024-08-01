const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../models/users"); // Assurez-vous que le modèle User est correctement importé
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const validateLogin = [
  check("email").isEmail().withMessage("Enter a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limite chaque IP à 5 requêtes par windowMs
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

const logger = morgan("combined");

router.post("/", logger, loginLimiter, validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const token = uid2(256);
    user.token = token;
    await user.save();

    res
      .status(200)
      .json({ message: "Login successful", token, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
