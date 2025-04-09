const express = require("express");
const blogRoute = express.Router();
const BlogControl = require("../Controlers/BlogwriterCotrol");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store images in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage: storage });

// Blog Routes
blogRoute.get("/", BlogControl.getAllBlogs);
blogRoute.get("/:id", BlogControl.getById);
blogRoute.post("/", upload.single("image"), BlogControl.addBlog); // Image upload enabled
blogRoute.put("/:id", upload.single("image"), BlogControl.updateBlog); // Image upload enabled
blogRoute.delete("/:id", BlogControl.deleteBlog);

// Export the routes
module.exports = blogRoute;
