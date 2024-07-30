var express = require("express");
var router = express.Router();

const Collection = require("../models/collections");

/* GET home page. */
router.get("/", function (req, res, next) {
  Collection.find()
    .then((collections) => {
      res.json(collections);
    })
    .catch((err) => {
      console.error("Erreur serveur:", err); // Afficher l'erreur dans la console du serveur
      res
        .status(500)
        .json({ error: "Erreur lors de la recherche des collections" });
    });
});

router.post("/", async (req, res) => {
  try {
    const { name, description, price, imageUrl, images } = req.body;

    // Validation des données
    if (!name || !images || !Array.isArray(images)) {
      return res.status(400).json({
        error: "Nom et images sont requis et images doivent être un tableau",
      });
    }

    // Créer une nouvelle instance de la collection
    const newCollection = new Collection({
      name,
      description,
      imageUrl,
      price,
      images,
    });

    // Sauvegarder la collection dans la base de données
    await newCollection.save();
    res.status(201).json({
      message: "Collection ajoutée avec succès",
      collection: newCollection,
    });
  } catch (err) {
    console.error("Erreur serveur:", err); // Afficher l'erreur dans la console du serveur
    res.status(500).json({ error: "Erreur lors de l'ajout de la collection" });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Collection.findById(id)
    .then((collection) => {
      if (!collection) {
        return res.status(404).json({ error: "Collection non trouvée" });
      }
      res.json(collection);
    })
    .catch((err) => {
      console.error("Erreur serveur:", err); // Afficher l'erreur dans la console du serveur
      res
        .status(500)
        .json({ error: "Erreur lors de la recherche de la collection" });
    });
});

module.exports = router;
