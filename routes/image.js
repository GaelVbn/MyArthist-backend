var express = require("express");
var router = express.Router();

const Image = require("../models/image");

/* GET home page. */
router.get("/", function (req, res, next) {
  Image.find()
    .then((images) => {
      res.json(images);
    })
    .catch((err) => {
      console.error("Erreur serveur:", err); // Afficher l'erreur dans la console du serveur
      res.status(500).json({ error: "Erreur lors de la recherche des images" });
    });
});

router.post("/", async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    // Validation des données
    if (!title || !imageUrl) {
      return res.status(400).json({
        error: "Titre et imageUrl sont requis",
      });
    }
    // Créer une nouvelle instance de la collection
    const newImage = new Image({
      title,
      description,
      imageUrl,
    });

    // Sauvegarder la collection dans la base de données
    await newImage.save();
    res.status(201).json({
      message: "Image ajoutée avec succès",
      image: newImage,
    });
  } catch (err) {
    console.error("Erreur serveur:", err); // Afficher l'erreur dans la console du serveur
    res.status(500).json({ error: "Erreur lors de l'ajout de l'image" });
  }
});

module.exports = router;
