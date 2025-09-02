import React from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const HelpBox = () => {
     const navigate = useNavigate();
  return (
    <div onClick={() => navigate('/Ai-Helper')} className="fixed bottom-4 right-4 w-52 h-24 border border-black p-4 rounded-lg shadow-md bg-white z-50 cursor-pointer">
      <p className="text-sm text-gray-800">Need help to Chanel a Doctor?</p>
      <img
        className="w-12 h-12 absolute bottom-2 right-2"
        src={assets.AiDoc}
        alt="Ai"
      />
    </div>
  );
};

export default HelpBox;
