import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../../context/adminContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { backendUrl } = useContext(AdminContext);

  useEffect(() => {
    fetchBlogs();
  }, [backendUrl]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/blog/all');
      if (response.data.success) {
        setBlogs(response.data.blogs);
      } else {
        console.error('Failed to fetch blogs:', response.data.message);
        toast.error(`Failed to fetch blogs: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Error fetching blogs');
    }
  };

  const handleBlogClick = (blog) => {
    setIsEditing(false); // reset edit state
    if (selectedBlog && selectedBlog._id === blog._id) {
      setSelectedBlog(null);
      resetForm();
    } else {
      setSelectedBlog(blog);
      setImage(blog.image);
      setTitle(blog.topic);
      setEmail(blog.email);
      setDescription(blog.description);
    }
  };

  const resetForm = () => {
    setImage(null);
    setTitle('');
    setEmail('');
    setDescription('');
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isEditing && selectedBlog) {
      const formData = new FormData();
      formData.append('topic', title);
      formData.append('email', email);
      formData.append('description', description);

      if (image instanceof File) {
        formData.append('image', image); // add image if new one is selected
      }

      try {
        const response = await axios.put(`http://localhost:4000/api/blog/update/${selectedBlog._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success) {
          await fetchBlogs(); // refresh blog list
          setIsEditing(false);
          toast.success('Blog updated successfully!');
        } else {
          toast.error(`Failed to update blog: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Error updating blog:', error);
        toast.error('Error updating blog');
      }
    } else {
      setSelectedBlog(null); // just close the form
      toast.info('Blog details closed.');
    }
  };

  const handleDelete = async () => {
    if (selectedBlog) {
      const confirm = window.confirm("Are you sure you want to delete this blog?");
      if (!confirm) return;

      try {
        const response = await axios.delete(`http://localhost:4000/api/blog/delete/${selectedBlog._id}`);
        if (response.data.success) {
          setSelectedBlog(null);
          await fetchBlogs();
          toast.success('Blog deleted successfully!');
        } else {
          toast.error(`Failed to delete blog: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Error deleting blog');
      }
    }
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium mb-4">All Blogs</h1>

      {/* Blog Cards Grid */}
      <div className="w-full flex flex-wrap gap-4 gap-y-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border border-indigo-200 rounded-xl max-w-64 overflow-hidden cursor-pointer group hover:shadow-lg transition"
            onClick={() => handleBlogClick(blog)}
          >
            <img
              className="w-full h-40 object-cover bg-indigo-50 group-hover:bg-primary transition-all duration-500"
              src={`http://localhost:4000/${blog.image}`}
              alt="blog"
            />
            <div className="p-3">
              <p className="text-neutral-800 text-lg font-medium truncate">{blog.topic}</p>
              <p className="text-zinc-600 text-sm truncate">{blog.email}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Blog Details */}
      {selectedBlog && (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
          <p className="mb-3 text-xl font-semibold">Blog Details</p>
          <div className="bg-white px-10 py-8 border rounded-xl w-full max-w-5xl shadow-lg">

            {/* Big Image Preview */}
            <div className="mb-6 flex justify-center">
              <img
                className="max-w-full max-h-[400px] object-cover rounded-lg border"
                src={image ? `http://localhost:4000/${image}` : assets.admin_logo}
                alt="Blog Preview"
              />
            </div>

            {/* Image Input */}
            {isEditing && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Update Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="border px-3 py-2 rounded"
                  />
                </div>
              )}

            {/* Input Fields */}
            <div className="flex flex-col gap-6 text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Blog Title</label>
                <input
                  type="text"
                  className="border rounded px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="border rounded px-3 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  rows={6}
                  className="w-full border rounded px-4 pt-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isEditing}
                />
              </div>



              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="button"
                  className="bg-yellow-500 px-6 py-2 text-white rounded-full"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel Edit' : 'Edit'}
                </button>

                {isEditing ? (
                  <button
                    type="submit"
                    className="bg-green-600 px-6 py-2 text-white rounded-full"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-primary px-6 py-2 text-white rounded-full"
                  >
                    Close
                  </button>
                )}

                <button
                  type="button"
                  className="bg-red-600 px-6 py-2 text-white rounded-full"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default BlogList;