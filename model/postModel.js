const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
    },
    postDescription: {
      type: String,
      required: true,
    },
    postImage: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
);

const Post = mongoose.model("post", PostSchema);

module.exports = Post;