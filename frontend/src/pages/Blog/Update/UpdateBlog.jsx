import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateBlog() {
    const [inputs, setInputs] = useState(null); // Start with null
    const [loading, setLoading] = useState(true); // Track loading state
    const [selectedImage, setSelectedImage] = useState(null); // Track new image
    const history = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                console.log('Fetching blog with ID:', id);
                const res = await axios.get(`http://localhost:5000/blogwriter/${id}`);

                console.log('API Response:', res.data);

                if (res.data && res.data.blogs) {
                    setInputs(res.data.blogs);
                    setLoading(false);
                } else {
                    console.error('Blog data is undefined');
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
                setLoading(false);
            }
        };

        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        try {
            const formData = new FormData();
            formData.append("Id", inputs.Id);
            formData.append("Title", inputs.Title);
            formData.append("Description", inputs.Description);
            formData.append("Email", inputs.Email);
            
            // If a new image is selected, append it
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            await axios.put(`http://localhost:5000/blogwriter/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            history('/blogsDisplay');
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]); // Store new selected image
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest();
    };

    if (loading) {
        return <h2>Loading...</h2>; // Show loading message while fetching data
    }

    return (
       <>
       <Nav />
        <div className="page-cover">
            <h1 className="Addblog-title">Update Blog</h1>
            <form onSubmit={handleSubmit} className="Addblog-form">
                <label>ID</label>
                <input type="text" name="Id" onChange={handleChange} value={inputs?.Id || ''} required />

                <label>Title</label>
                <input type="text" name="Title" onChange={handleChange} value={inputs?.Title || ''} required />

                <label>Description</label>
                <textarea name="Description" onChange={handleChange} value={inputs?.Description || ''} required></textarea>

                <label>Email</label>
                <input type="email" name="Email" onChange={handleChange} value={inputs?.Email || ''} required />

                {/* Display Current Image */}
                {inputs?.Image && (
                    <div>
                        <p>Current Image:</p>
                        <img 
                            src={`http://localhost:5000/files/${inputs.Image}`} 
                            alt="Current Blog" 
                            style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "10px" }}
                        />
                    </div>
                )}

                {/* File Input to Upload New Image */}
                <label>Change Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </div>
       </>
    );
}

export default UpdateBlog;
