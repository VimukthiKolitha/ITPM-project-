import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './addBlogForm.css';

function AddBlog() {
  const history = useNavigate();

  // Input field state
  const [inputs, setInputs] = useState({
    Id: "",
    Title: "",
    Description: "",
    Email: "",
    Image: null  // New state for image
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImgChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      Image: e.target.files[0]  // Store the selected image file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Id", inputs.Id);
    formData.append("Title", inputs.Title);
    formData.append("Description", inputs.Description);
    formData.append("Email", inputs.Email);

    if (inputs.Image) {
        formData.append("image", inputs.Image); // Append the selected image
    }

    try {
        await axios.post("http://localhost:5000/uploadImg", formData, {
            headers: { "content-type": "multipart/form-data" },
        });
        alert("Blog with image uploaded successfully!");
        history('/blogsDisplay'); // Redirect after submission
    } catch (error) {
        console.error("Error uploading blog:", error);
        alert("Error uploading blog. Try again!");
    }
  };

  return (
    <>
      <div className="page-cover">
        <h1 className="Addblog-title">Add Blog</h1>
        <form className="Addblog-form" onSubmit={handleSubmit}>
          <label>ID</label>
          <input type="text" name="Id" onChange={handleChange} value={inputs.Id} required />

          <label>Title</label>
          <input type="text" name="Title" onChange={handleChange} value={inputs.Title} required />

          <label>Description</label>
          <textarea name="Description" onChange={handleChange} value={inputs.Description} required />

          <label>Email</label>
          <input type="email" name="Email" onChange={handleChange} value={inputs.Email} required />

          {/* Image upload input */}
          <label>Image</label>
          <input type="file" accept="image/*" onChange={handleImgChange} />

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </>
  );
}

export default AddBlog;
