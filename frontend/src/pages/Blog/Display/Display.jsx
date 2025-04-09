import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from "react-to-print";
import "./homeBlog.css"; // Import CSS file

const URL = "http://localhost:4000/getImage"; // Updated to fetch blogs with images

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setBlogs(data.data)); // Adjust to match API response structure
  }, []);

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ content: () => contentRef.current });

  return (
    <>
      <div>
        <Nav />
        <h1 className="blog-title">Blog Details</h1>
        <div ref={contentRef} className="homeblog-container">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog, i) => (
              <div key={i} className="blog-card">
                <p className="blog-title-text">{blog.Title}</p>
                {blog.Image && (
                  <img 
                    src={`http://localhost:5000/files/${blog.Image}`} 
                    alt="Blog" 
                    className="blog-image"
                  />
                )}
                <p className="blog-description">
                  {blog.Description.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <p className="blog-email">{blog.Email}</p>
              </div>
            ))
          ) : (
            <p>No blogs available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Blogs;
