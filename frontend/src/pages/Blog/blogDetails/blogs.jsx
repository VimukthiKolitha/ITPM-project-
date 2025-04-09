import React, { useEffect, useState, useRef } from 'react';
import Nav from "../Nav/Nav";
import axios from 'axios';
import { useReactToPrint } from "react-to-print";
import Blog from '../Blog/blog'; // Import the existing Blog component

const URL = "http://localhost:5000/blogwriter";
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Blogs() {
  const [blogs, setBlogs] = useState();
  
  useEffect(() => {
    fetchHandler().then((data) => setBlogs(data.blogs));
  }, []);

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <>
      <Nav /> {/* Navbar stays outside the border */}
      <div className="page-container">
        <h1 className="blog-title">Blog Details</h1>
        <div ref={contentRef}>
          <table className="blog-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs && blogs.map((blog) => (
                <tr key={blog._id}>
                  <Blog blog={blog} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={reactToPrintFn} className="report-btn">Download Report</button>
      </div>
    </>
  );
}

export default Blogs;
