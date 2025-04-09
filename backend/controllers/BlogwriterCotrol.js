const Blog = require("../Model/BlogwriterModel");
const multer = require("multer");
const path = require("path");

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store images in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage: storage });

// Retrieve all blogs
const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (err) {
        console.log(err);
    }
    if (!blogs) {
        return res.status(404).json({ message: "No Blogs found!" });
    }
    return res.status(200).json({ blogs });
};

// Add a new blog (with image upload)
const addBlog = async (req, res, next) => {
    const { Id, Title, Description, Email } = req.body;
    const Image = req.file ? req.file.filename : null; // Check if an image was uploaded

    let blogs;
    try {
        blogs = new Blog({ Id, Title, Description, Email, Image });
        await blogs.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error occurred" });
    }
    if (!blogs) {
        return res.status(400).json({ message: "Unable to add Blog" });
    }
    return res.status(201).json({ blogs });
};

// Get blog by ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    let blogs;
    try {
        blogs = await Blog.findById(id);
    } catch (error) {
        console.log(error);
    }
    if (!blogs) {
        return res.status(404).json({ message: "Unable to find blog" });
    }
    return res.status(200).json({ blogs });
};

// Update blog (with optional image upload)
const updateBlog = async (req, res, next) => {
    const id = req.params.id;
    const { Id, Title, Description, Email } = req.body;
    let Image = req.body.Image; // Default to existing image

    if (req.file) {
        Image = req.file.filename; // Update with new image if uploaded
    }

    let blogs;
    try {
        blogs = await Blog.findByIdAndUpdate(
            id,
            { Id, Title, Description, Email, Image },
            { new: true, runValidators: true }
        );
    } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({ message: "Server error occurred" });
    }

    if (!blogs) {
        return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ blogs });
};

// Delete blog
const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndDelete(id);
    } catch (error) {
        console.log(error);
    }
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({ blog });
};

// Serve uploaded images statically
const express = require("express");
const app = express();
app.use("/uploads", express.static("uploads"));

exports.getAllBlogs = getAllBlogs;
exports.addBlog = addBlog;
exports.getById = getById;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
exports.upload = upload; // Export multer middleware
