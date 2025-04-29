// controllers/blogController.js
import BlogModel from "../models/blogModel.js";
import fs from "fs";

const addBlog = async (req, res) => {
  try {
    const { topic, description, email } = req.body;
    const image = req.file?.path;

    if (!topic || !description || !email || !image) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newBlog = new BlogModel({ topic, description, email, image });
    await newBlog.save();
    res.status(201).json({ success: true, message: "Blog added successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find().sort({ date: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { topic, description, email } = req.body;
    const blog = await BlogModel.findById(blogId);

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    const updatedFields = { topic, description, email };

    if (req.file?.path) {
      // Delete old image
      if (fs.existsSync(blog.image)) {
        fs.unlinkSync(blog.image);
      }
      updatedFields.image = req.file.path;
    }

    await BlogModel.findByIdAndUpdate(blogId, updatedFields);
    res.status(200).json({ success: true, message: "Blog updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await BlogModel.findById(blogId);

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (fs.existsSync(blog.image)) {
      fs.unlinkSync(blog.image);
    }

    await BlogModel.findByIdAndDelete(blogId);
    res.status(200).json({ success: true, message: "Blog deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addBlog, getAllBlogs, updateBlog, deleteBlog };