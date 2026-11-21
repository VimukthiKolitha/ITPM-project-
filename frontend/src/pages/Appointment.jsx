import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'

const Appointment = () => {

  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  // Each item: { date: Date, slots: [{ datetime: Date, time: string }] }
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = () => {
    const info = doctors.find(doc => doc._id === docId)
    setDocInfo(info)
  }

  const getAvailableSlots = () => {
    const now = new Date()
    const days = []

    for (let i = 0; i < 7; i++) {
      // The date for this day (midnight-based, so it never drifts)
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)

      // Clinic hours: 10:00 - 21:00
      const endTime = new Date(day)
      endTime.setHours(21, 0, 0, 0)

      const cursor = new Date(day)
      if (i === 0) {
        // Today: start at the next free half-hour slot, but not before 10:00
        cursor.setHours(now.getHours(), now.getMinutes() < 30 ? 30 : 60, 0, 0)
        if (cursor.getHours() < 10) cursor.setHours(10, 0, 0, 0)
      } else {
        cursor.setHours(10, 0, 0, 0)
      }

      const slots = []
      while (cursor < endTime) {
        slots.push({
          datetime: new Date(cursor),
          time: cursor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
        cursor.setMinutes(cursor.getMinutes() + 30)
      }

      // Skip days with no slots left (e.g. today after closing time)
      if (slots.length > 0) {
        days.push({ date: day, slots })
      }
    }

    setDocSlots(days)
    setSlotIndex(0)
    setSlotTime('')
  }

  const bookAppointment = async () => {
    if (!slotTime) {
      toast.warn('Please select a time slot first')
      return
    }

    const bookedDay = docSlots[slotIndex].date
    const slotDate = `${bookedDay.getDate()}_${bookedDay.getMonth() + 1}_${bookedDay.getFullYear()}`

    if (!token) {
      toast.warn('Login to book an appointment')
      return navigate('/login')
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData && getDoctorsData() // refresh doctor slots_booked
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) getAvailableSlots()
  }, [docInfo])

  if (!docInfo) return null

  const selectedDay = docSlots[slotIndex]

  return (
    <div>
      {/*----Doctor Details----*/}
      <div className='flex flex-col sm:flex-row gap-4 mt-8'>
        <div>
          <img className='bg-green w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt='' />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-800px] sm:mt-0'>
          {/*-----Doctors Information */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt='' /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          {/*----Doctor About----- */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt='' /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-675 font-medium mt-4'>Appointment Fee: <span className='text-black font-bold'>{currencySymbol}.{docInfo.fees}.00</span></p>
        </div>
      </div>

      {/*------- Booking Slots------- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-10 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.map((item, index) => (
            <div
              onClick={() => { setSlotIndex(index); setSlotTime('') }}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
              key={index}
            >
              <p>{daysOfWeek[item.date.getDay()]}</p>
              <p>{item.date.getDate()}</p>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {selectedDay && selectedDay.slots.map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-custom-purple text-white' : 'text-gray-600 border border-gray-300'}`}
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-20'
        >
          Book Appointment
        </button>
      </div>

      {/* --------Related Doctors-------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment