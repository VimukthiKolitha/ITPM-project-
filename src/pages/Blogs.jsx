// pages/Blogs.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Blogs.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);  // Store the list of blogs
  const [loading, setLoading] = useState(true);  // Loading state to show a spinner or loading text

  // Fetch blogs when the component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/blog/all');
        if (response.data.success) {
          setBlogs(response.data.blogs);  // Set blogs in state
        } else {
          console.error('Failed to fetch blogs');
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);  // Set loading to false after fetching
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <p>Loading blogs...</p>;  // Show loading text or spinner while fetching
  }

  return (
    <div className="blogs-page">

      <div className="blogs-list">
        {blogs.length === 0 ? (
          <p>No blogs available</p>  // Message when no blogs are available
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <h3>{blog.topic}</h3>
               {/* You can add an image and other details as well */}
               <img src={`http://localhost:4000/${blog.image}`} alt={blog.topic} />
              <p>{blog.description}</p>
              <p><strong>Email:</strong> {blog.email}</p>
             
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Blogs;
