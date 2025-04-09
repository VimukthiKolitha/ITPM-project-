import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const MyAppointment = () => {
  const { doctors } = useContext(AppContext);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Appointment</h1>
      <div className="space-y-6">
        {doctors.slice(0, 2).map((item, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Doctor Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-full object-cover bg-indigo-50"
                />
              </div>

              {/* Doctor Details */}
              <div className="flex-1 space-y-2">
                <p className="text-xl font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{item.speciality}</p>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Address:</p>
                  <p>{item.address.line1}</p>
                  <p>{item.address.line2}</p>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date & Time:</span> 25, July, 2024 | 8.30 PM
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                  Payment
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300">
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment;