const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const collectionSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String,
  price: Number,
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  images: [imageSchema],
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
