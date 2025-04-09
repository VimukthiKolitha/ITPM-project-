import React from 'react'
import {assets} from '../assets/assets'
const About = () => {
  return (
    <div>
      
     <div className='text-center text-2xl pt-10 text-gray-500'>
      <p>About <span className = 'text-gray-700 font-medium'>US</span></p>
     </div>
        <div className='my-10 flex flex-col md:flex-row gap-12'> 
        <img className="w-full md:max-w-[300px] h-auto object-cover" src={assets.about_image} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
            <p>Welcome to Suwasetha,Your trusted partner in managinf your helthcare needs conveniently and effeciently.At 
            Suwasetha,we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
            </p>
            <p>Suwasetha is commited to exellence in helthcare technology.We continuosly strive to enhance out platform,
              integrating the last advancements to improve user experiance and deliver superior service.whether you're
              inntergrating the latest advancement or managing ongoing care,Suwasetha is here to support you every step of the way.
            </p>
            <b className='text-gray-800'>
              Our Vision
            </b>
            <p>Our vision at Suwasetha is to create a seamles helthcare experiance for every user.we aim to bridge the gap between
              patients and helthcare providers,making it easier for you to access the care you need.when you need it.  
             </p>
          </div>
        </div>
    </div>
  )
}

export default About
