import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./homeBlog.css";

// Backend that serves both the blog list and the uploaded images
const API_BASE = "http://localhost:4000";
const BLOGS_URL = `${API_BASE}/api/blog/all`;

// "uploads\\1746255389856.png" -> "http://localhost:4000/uploads/1746255389856.png"
const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image; // already a full URL (e.g. Cloudinary)
  return `${API_BASE}/${image.replace(/\\/g, "/")}`;
};

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(BLOGS_URL);
        setBlogs(res.data?.blogs || []);
      } catch (err) {
        console.log("Blog fetch failed:", err.message);
        setError("Could not load blogs. Please make sure the blog server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <h1 className="blog-title">Blog Details</h1>

      <div className="homeblog-container">
        {loading && <p>Loading blogs...</p>}

        {!loading && error && <p>{error}</p>}

        {!loading && !error && blogs.length === 0 && <p>No blogs available</p>}

        {!loading && !error && blogs.map((blog) => (
          <div key={blog._id} className="blog-card">
            <p className="blog-title-text">{(blog.topic || "").trim()}</p>

            {blog.image && (
              <img
                src={getImageUrl(blog.image)}
                alt={blog.topic || "Blog"}
                className="blog-image"
              />
            )}

            <p className="blog-description">
              {(blog.description || "").split(/\r?\n/).map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>

            <p className="blog-email">{blog.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;