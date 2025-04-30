import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/adminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const WriteBlog = () => {
  const [image, setImage] = useState(false)
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')

  const { aToken } = useContext(AdminContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!image) {
      toast.info('You are publishing a blog without a cover image')
    }

    try {
      const formData = new FormData()
      if (image) formData.append('image', image)
      formData.append('topic', title)
      formData.append('email', email)
      formData.append('description', description)

      const { data } = await axios.post(
        'http://localhost:4000/api/blog/add',
        formData,
        {
          headers: { aToken },
        }
      )

      if (data.success) {
        toast.success('Blog published successfully!')
        setImage(false)
        setTitle('')
        setEmail('')
        setDescription('')
      } else {
        toast.error('Failed to publish blog. Please try again.')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Something went wrong while publishing the blog.')
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Write Blog</p>
      <div className='bg-white px-8 py-6 border-rounded w-full max-w-4xl'>

        {/* Upload Image Section */}
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor='blog-img'>
            <img
              className='w-20 h-20 object-cover bg-gray-100 rounded-full cursor-pointer'
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt='Upload'
            />
          </label>
          <input
            type='file'
            id='blog-img'
            hidden
            accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
          />
          <p>Upload Blog <br /> Cover Image</p>
        </div>

        {/* Input Fields */}
        <div className='flex flex-col gap-5 text-gray-600'>
          <div className='flex flex-col gap-1'>
            <label>Blog Title</label>
            <input
              type='text'
              placeholder='Enter Blog Title'
              className='border rounded px-3 py-2'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label>Email</label>
            <input
              type='email'
              placeholder='Author Email'
              className='border rounded px-3 py-2'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label>Description</label>
            <textarea
              placeholder='Write your blog here...'
              rows={6}
              className='w-full border rounded px-4 pt-2'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            className='bg-primary px-10 py-3 text-white rounded-full mt-4'
          >
            Publish Blog
          </button>
        </div>
      </div>
    </form>
  )
}

export default WriteBlog
