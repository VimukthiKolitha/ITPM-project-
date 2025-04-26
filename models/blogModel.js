// models/blogModel.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String, required: true } // Local path to uploaded image
});

const BlogModel = mongoose.models.blog || mongoose.model("blog", blogSchema);
export default BlogModel;
