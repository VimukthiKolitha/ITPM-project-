import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// "8_11_2026" -> "8 Nov 2026"
const formatSlotDate = (slotDate) => {
  const [day, month, year] = slotDate.split('_')
  return `${day} ${months[Number(month) - 1]} ${year}`
}

const MyAppointment = () => {
  const { backendUrl, token, doctors, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
      if (data.success) {
        setAppointments([...data.appointments].reverse()) // newest first
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData && getDoctorsData() // free up the slot
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    } else {
      setLoading(false)
    }
  }, [token])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Appointment</h1>

      {!token && <p className="text-gray-600">Please log in to see your appointments.</p>}
      {token && loading && <p className="text-gray-600">Loading appointments...</p>}
      {token && !loading && appointments.length === 0 && (
        <p className="text-gray-600">You have no appointments yet.</p>
      )}

      <div className="space-y-6">
        {appointments.map((appt) => {
          // Use doctor data sent by the backend, or look it up from the doctors list
          const item = appt.docData || doctors.find(doc => doc._id === appt.docId)
          if (!item) return null

          return (
            <div key={appt._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
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
                    <p>{item.address?.line1}</p>
                    <p>{item.address?.line2}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date & Time:</span> {formatSlotDate(appt.slotDate)} | {appt.slotTime}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  {appt.cancelled ? (
                    <p className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-center">
                      Appointment cancelled
                    </p>
                  ) : (
                    <>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                        Payment
                      </button>
                      <button
                        onClick={() => cancelAppointment(appt._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                      >
                        Cancel Appointment
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyAppointment