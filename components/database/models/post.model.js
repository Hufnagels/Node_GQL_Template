const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    author: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    subtitle: { type: String, nullable: true, default: '' },
    description: { type: String, nullable: true, default: '' },
    titleimage: { type: String, nullable: true, default: '' },
  },
  {
    timestamps: true
  }
);
const Posts = mongoose.model("posts", postSchema);
module.exports = Posts