import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';
import './SpecialityMenu.css';

const SpecialityMenu = () => {
  return (
    <div className="speciality-container" id="#speciality">
      <h1 className="speciality-title">Find By Speciality</h1>
      <p className="speciality-description">
        Simply browse through our extensive list of trusted doctors and schedule your appointment hassle-free.
      </p>
      <div className="speciality-list">
        {specialityData.map((item, index) => (
          <Link 
            onClick={() => scrollTo(0, 0)} 
            className="speciality-item" 
            key={index} 
            to={`/doctors/${item.speciality}`}
          >
            <img className="speciality-image" src={item.image} alt="" />
            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
