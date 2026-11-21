import { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    // Initialize token state from localStorage
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashdata] = useState(false);

    // Base backend URL (e.g., http://localhost:4000)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Automatically sync aToken with localStorage on state changes
    useEffect(() => {
        if (aToken) {
            localStorage.setItem('aToken', aToken);
        } else {
            localStorage.removeItem('aToken');
        }
    }, [aToken]);

    // Fetch all doctors list
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/all-doctors`, 
                {}, 
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Toggle doctor availability state
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/change-availability`,
                { docId },
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Fetch all patient appointments
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/appointments`,
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                setAppointments(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Cancel an appointment by ID
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/cancel-appointment`,
                { appointmentId },
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Fetch admin dashboard metrics
    const getDashData = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/dashboard`,
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                setDashdata(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        getAllDoctors, changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment,
        getDashData, dashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;