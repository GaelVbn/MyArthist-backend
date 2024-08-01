const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/users"); // Assurez-vous que le modèle User est correctement importé
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const router = express.Router();

// Route d'inscription
router.post(
  "/signup",
  [
    // Validation des champs
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Vérification si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Création d'un nouvel utilisateur
      const newUser = new User({ username, email, password });
      await newUser.save();

      // Génération d'un token pour l'utilisateur
      const token = uid2(256); // Génère un token de 256 caractères
      newUser.token = token; // Ajoutez le token à l'objet utilisateur

      await newUser.save();

      res
        .status(201)
        .json({ message: "User created successfully", token, user: username });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Route de connexion
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Vérification du mot de passe (assurez-vous de comparer le mot de passe haché)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Génération d'un nouveau token
      const token = uid2(256); // Génère un token de 256 caractères
      user.token = token;

      await user.save();

      res.status(200).json({
        message: "Login successful",
        token,
        username: user.username,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
