// import necessary package
const express = require("express");
const dotenv = require("dotenv");
const { storage } = require("./storage");
const multer = require("multer");
const upload = multer({ storage });
const cors = require("cors");
const Post = require("./model/postModel");
const db = require("./db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).send({
      status: "error",
      message: "No file uploaded",
    });
  }

  res.status(200).send({
    status: "success",
    message: "Image uploaded successfully",
    url: req.file.path,
  });
});

app.post("/create-post", async (req, res) => {
  const body = req.body;
  try {
    const post = new Post(body);
    await post.save();
    res.status(200).send({
      status: "success",
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error creating post",
      error: error,
    });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).send({
      status: "success",
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error retrieving posts",
      err: err,
    });
  }
});

app.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).send({
      status: "success",
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error retrieving post",
      error: error,
    });
  }
});

app.delete("/post/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send({
        status: "error",
        message: "Post not found",
      });
    }
    res.status(200).send({
      status: "success",
      message: "Post deleted successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error deleting post",
      error: error,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
