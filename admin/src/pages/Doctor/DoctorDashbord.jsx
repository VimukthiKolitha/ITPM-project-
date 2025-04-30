import React, { useContext, useEffect, useState } from 'react';
import { DoctorContex } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DoctorDashbord = () => {
  const { dToken, dashData, setDashdata, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContex);
  const { currency } = useContext(AppContext);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  const reportData = [
    { name: 'Earnings', value: dashData?.earnings || 0 },
    { name: 'Appointments', value: dashData?.appointment || 0 },
    { name: 'Patients', value: dashData?.patients || 0 }
  ];

  return dashData && (
    <div className="m-5">
      {/* REPORT Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={() => setShowReport(!showReport)}
        >
          {showReport ? 'Hide Report' : 'View Report'}
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.earning_icon} alt="Earnings Icon" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{currency}{dashData?.earnings || 0}</p>
            <p>Earnings</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointments_icon} alt="Appointments Icon" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData?.appointment || 0}</p>
            <p>Appointments</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="Patients Icon" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData?.patients || 0}</p>
            <p>Patients</p>
          </div>
        </div>
      </div>

      {/* Report Chart */}
      {showReport && (
        <div className="bg-white mt-6 p-4 rounded border shadow-md">
          <h3 className="text-lg font-semibold mb-4">Dashboard Report</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Latest Bookings Section */}
      <div className="bg-white mt-10 rounded border">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <img src={assets.list_icon} alt="List Icon" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-4">
          {dashData?.latestAppointments?.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div className="flex items-center px-3 py-3 gap-40 hover:bg-gray-100" key={index}>
                <img className="rounded-full w-10" src={item.userData?.image || assets.default_user} alt="User" />
                <div className="flex flex-col text-sm">
                  <p className="text-gray-800 font-medium">{item.userData?.name || 'Unknown'}</p>
                  <p className="text-gray-600">{item.slotDate || 'No date available'}</p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">Completed</p>
                ) : (
                  <div className="flex">
                    <img onClick={() => cancelAppointment(item._id)} className="w-10 cursor-pointer" src={assets.cancel_icon} alt="Cancel" />
                    <img onClick={() => completeAppointment(item._id)} className="w-10 cursor-pointer" src={assets.tick_icon} alt="Complete" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-3">No recent appointments found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashbord;
