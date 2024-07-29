const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
});

const Image = mongoose.model("Images", imageSchema);

module.exports = Image;
