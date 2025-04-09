import React, { useState } from 'react';
import { assets } from '../assets/assets';

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    image: assets.profile_pic,
    email: 'john.doe@example.com',
    phone: '+9477 7777771',
    address: {
      line1: "57 Cross, Tichmand",
      line2: "Galee Road, Galle"
    },
    Gender: "Male",
    DOB: "2002-06-05"
  });

  const [isEdit, setIsEdit] = useState(false); // Set to false by default

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {/* Profile Picture */}
      <img className='w-36 rounded mt-7' src={userData.image} alt="Profile" />

      {/* Name */}
      {isEdit ? (
        <input
          className='bg-gray-60 text-3xl font-medium max-w-60 mt-4'
          type="text"
          value={userData.name}
          onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      )}

      <hr className='bg-zinc-400 h-[1px] border-none' />

      {/* Contact Information */}
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral'>
          <p className='font-medium'>Email:</p>
          <p className='text-blue-600'>{userData.email}</p>

          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input
              className='bg-gray-100 max-w-52'
              type="text"
              value={userData.phone}
              onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <p className='text-blue-400'>{userData.phone}</p>
          )}

          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <div>
              <input
                className='bg-gray-50'
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value }
                  }))
                }
                value={userData.address.line1}
                type="text"
              />
              <br />
              <input
                className='bg-gray-50'
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value }
                  }))
                }
                value={userData.address.line2}
                type="text"
              />
            </div>
          ) : (
            <p className='text-gray-500'>
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select
              className='max-w-20 bg-gray-100'
              onChange={(e) => setUserData((prev) => ({ ...prev, Gender: e.target.value }))}
              value={userData.Gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>{userData.Gender}</p>
          )}

          <p className='font-medium'>Birthday:</p>
          {isEdit ? (
            <input
              className='max-w-28 bg-gray-100'
              type="date"
              value={userData.DOB}
              onChange={(e) => setUserData((prev) => ({ ...prev, DOB: e.target.value }))}
            />
          ) : (
            <p className='text-gray-400'>{userData.DOB}</p>
          )}
        </div>
      </div>

      {/* Edit/Save Button */}
      <div className='mt-4'>
        {isEdit ? (
          <button
            className='bg-blue-500 text-black px-4 py-2 rounded'
            onClick={() => setIsEdit(false)} // Save and exit edit mode
          >
            Save
          </button>
        ) : (
          <button
            className='bg-blue-500 text-black px-4 py-2 rounded'
            onClick={() => setIsEdit(true)} // Enter edit mode
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;