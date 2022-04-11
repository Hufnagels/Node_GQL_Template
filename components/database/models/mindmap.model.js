const mongoose = require("mongoose");
const { Schema } = mongoose;

const mindmapSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    owner: { type: String, required: true},
    title: { type: String, required: true},
    description: { type: String},
    originalMap: {type: String, required: true},
    currentMap: {type: String, required: true},
    mapimage: {type: String},
    editinghistory: [new Schema({
      updated: {type: Date, default: Date.now, required: true},
      editedMap: {type: String, required: true},
    })],
  },
  {
    timestamps: true
  }
);
const Mindmaps = mongoose.model("mindmaps", mindmapSchema);
module.exports = Mindmaps