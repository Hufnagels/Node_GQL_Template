const mongoose = require("mongoose");
const { Schema } = mongoose;

const mapSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    owner: { type: String, required: true},
    title: { type: String, required: true},
    description: { type: String, required: true, default: ''},
    originalMap: {type: String, required: true},
    currentMap: {type: String, required: true},
    mapimage: {type: String, default: ''},
    editinghistory: [new Schema({
      updated: {type: Date, default: Date.now, required: true},
      editedMap: {type: String, required: true},
    })],
  },
  {
    timestamps: true
  }
);
const Maps = mongoose.model("maps", mapSchema);
module.exports = Maps