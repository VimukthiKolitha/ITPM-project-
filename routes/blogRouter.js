// routes/blogRouter.js
import express from "express";
import {
  addBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const blogRouter = express.Router();

blogRouter.post("/add", authAdmin, upload.single("image"), addBlog); //Corrected route
blogRouter.get("/all", getAllBlogs);
blogRouter.put("/update/:id", upload.single("image"), updateBlog);
blogRouter.delete("/delete/:id", deleteBlog);

export default blogRouter;