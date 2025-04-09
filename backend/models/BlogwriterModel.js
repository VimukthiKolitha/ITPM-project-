const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Blog Schema with Image Field
const blogSchema = new Schema({
  Id: {
    type: String,
    required: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Image: {
    type: String, // Store image URL or filename
    required: false, // Not mandatory if a blog doesn't have an image
  },
});

module.exports = mongoose.model("BlogwriterModel", blogSchema);
