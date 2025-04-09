import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'> 
        {/*----Left Section----*/}
        <div>
            <img className='mb-5 w-20' src={assets.logo} alt=''/>
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>At Suwasetha E-Channeling, we are committed to providing a seamless and efficient healthcare experience by connecting patients with trusted medical professionals. Our platform offers convenient online appointment booking, ensuring that quality healthcare is just a click away. 
            Stay connected with us for reliable and timely medical care. Your health, our priority!</p>
        </div>
        {/*----Middle Section----*/}
        <div>
            <p className='text-xl font-medium mb-5'> OUR PLATFORM</p>
            <ul className='flex flex-col gap-9 text-gray-600'>
                <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        {/*----Right Section----*/}
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+9441-4443332</li>
                <li>suwasethaechanel@gmail.com</li>
            </ul>
        </div>
      </div>
      {/*-----Copyright Text-------*/}
      <div>
            <hr className='border-t-2 border-black' />
            <p className='py-5 text-sm text-center'>Copyright 2025@ Suwasetha - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
