const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Removed `unique: true`
  pfolder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null }, // Reference to itself
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], // Reference to Image schema
});

module.exports = mongoose.model("Folder", folderSchema);
