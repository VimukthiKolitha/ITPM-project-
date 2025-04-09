import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './blogs.css';

function Blog(props) {
  const { _id, Id, Title, Description, Email } = props.blog;
  const navigate = useNavigate();

  // Get only the first sentence or first line of description
  const shortDescription = Description.split(".")[0] + ".";

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:5000/blogwriter/${_id}`)
      .then(res => res.data)
      .then(() => navigate("/"))
      .then(() => navigate("/blogsDisplay"));
  };

  return (
    <>
      <td>{Id}</td>
      <td>{Title}</td>
      <td>{shortDescription}</td>
      <td>{Email}</td>
      <td>
        <Link to={`/blogsDisplay/${_id}`} className="update-btn">Update</Link>
        <button onClick={deleteHandler} className="delete-btn">Delete</button>
      </td>
    </>
  );
}

export default Blog;
