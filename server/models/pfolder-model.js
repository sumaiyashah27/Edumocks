const mongoose = require("mongoose");

const pFolderSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Parent Folder Name
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }], // References multiple folders
});

module.exports = mongoose.model("PFolder", pFolderSchema);
