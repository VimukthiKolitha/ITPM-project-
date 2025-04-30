import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { AdminContext } from '../context/adminContext';
import { DoctorContex } from '../context/DoctorContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContex);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showBlogDropdown, setShowBlogDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-white border-r">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          {/* Admin Dropdown */}
          <li
            className="flex items-center justify-between px-3 md:px-9 py-3.5 cursor-pointer md:min-w-72"
            onClick={() => setShowAdminDropdown(!showAdminDropdown)}
          >
            <div className="flex items-center gap-3">
              <img src={assets.people_icon} alt="" />
              <p className="hidden md:block">Admin</p>
            </div>
            {showAdminDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </li>

          {/* Admin Dropdown Links */}
          {showAdminDropdown && (
            <div className="ml-6">
              <NavLink to="/admin-dashboard" className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                }`
              }>
                <img src={assets.home_icon} alt="" />
                <p className="hidden md:block">Dashboard</p>
              </NavLink>

              <NavLink to="/all-appointments" className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                }`
              }>
                <img src={assets.appointment_icon} alt="" />
                <p className="hidden md:block">Appointment</p>
              </NavLink>

              <NavLink to="add-doctors" className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                }`
              }>
                <img src={assets.add_icon} alt="" />
                <p className="hidden md:block">Add Doctor</p>
              </NavLink>

              <NavLink to="/doctors-list" className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                }`
              }>
                <img src={assets.people_icon} alt="" />
                <p className="hidden md:block">Doctor list</p>
              </NavLink>
            </div>
          )}

          {/* Blog Dropdown */}
          <li
            className="flex items-center justify-between px-3 md:px-9 py-3.5 cursor-pointer md:min-w-72"
            onClick={() => setShowBlogDropdown(!showBlogDropdown)}
          >
            <div className="flex items-center gap-3">
              <img src={assets.add_icon} alt="" />
              <p className="hidden md:block">Blogs</p>
            </div>
            {showBlogDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </li>

          {showBlogDropdown && (
            <div className="ml-6">
              <NavLink to="/blog-write" className="flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer">
                <img src={assets.add_icon} alt="" />
                <p className="hidden md:block">Write Blog</p>
              </NavLink>
              <NavLink to="/blog-list" className="flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer">
                <img src={assets.people_icon} alt="" />
                <p className="hidden md:block">Blog List</p>
              </NavLink>
            </div>
          )}
        </ul>
      )}

      {/* Doctor Section */}
      {dToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to="/doctors-dashbord"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink
            to="/doctors-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Appointment</p>
          </NavLink>

          <NavLink
            to="/doctors-profile"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}

      {/* Payment Section */}
   <li
     className="flex items-center justify-between px-3 md:px-9 py-3.5 cursor-pointer md:min-w-72"
     onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
   >
      <div className="flex items-center gap-3">
      <img src={assets.payment_icon || assets.add_icon} alt="" />
     <p className="hidden md:block">Payment</p>
  </div>
      {showPaymentDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
  </li>

   {showPaymentDropdown && (
    <div className="ml-6">
    <NavLink to="/pay-dash" className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
        isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
       }`
      }>
         <img src={assets.home_icon} alt="" />
        <p className="hidden md:block">Dashboard</p>
       </NavLink>
     </div>
  )}


    </div>
  );
};

export default Sidebar;
