import React from 'react'
import {assets} from '../assets/assets'
const Contact = () => {
  return (
    <div>
      <div>
        <p>CONTACT <span>US</span></p>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[300px]' src={assets.about_image} alt=''/>
        <div className='flex flex-col justify-center items-start gap-6'>

          <p className='font-semibold text-lg text-gray-600'>Our Office</p>
          <p className='text-gray-500'> malabe,<br></br> sri lanaka
          </p>
          <p className='text-gray-500'>Tel :077 4283236 <br></br> Email :suwasetha@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600'>Careers at Prescrition</p>
          <p className='text-gray-500'>Learn more about out teams and job openings.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact
