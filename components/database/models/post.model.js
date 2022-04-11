const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    author: { type: String, required: true},
    title: { type: String, required: true, unique: true },
    subtitle: { type: String, nullable: true},
    description: { type: String, nullable: true},
    titleimage: {type: String, nullable: true},
  },
  {
    timestamps: true
  }
);
const Posts = mongoose.model("posts", postSchema);
module.exports = Posts