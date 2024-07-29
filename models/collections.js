const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
});

const collectionSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String,
  price: Number,
  images: [imageSchema],
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
