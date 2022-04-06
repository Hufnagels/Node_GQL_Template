const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    author: { type: String, required: true},
    title: { type: String, required: true},
    subtitle: { type: String},
    description: { type: String},
    titleimage: {type: String},
  },
  {
    timestamps: true
  }
);
const Posts = mongoose.model("posts", postSchema);
module.exports = Posts