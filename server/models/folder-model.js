const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], // Reference to Image schema
});

module.exports = mongoose.model("Folder", folderSchema);
