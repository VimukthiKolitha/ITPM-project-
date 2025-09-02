import { createContext, useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [doctors, setDoctors] = useState([]);
    const [appointments,setAppointments] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("Backend URL:", backendUrl);

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/all-doctors`, 
                {}, 
                { headers: { aToken } }
            );

            if (data.success) {
                setDoctors(data.doctors);
                console.log(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching doctors");
        }
    }

    const changeAvailability = async(docId) =>{
        try {
            const {data} = await axios.post(backendUrl + '/change-availability',{docId},{headers:{aToken}})
            if(data.success)
            {
                toast.success(data.message)
                getAllDoctors()
            }
            else
            {
               toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching doctors");
        }
    }

    const getAllAppointments = async () =>{
        try {
            const {data} = await axios.get(backendUrl + '/appointments',{headers:{aToken}})
            if(data.success)
            {
                setAppointments(data.appointments)
                console.log(data.appointments);
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) =>{

        try {
            const {data} = await axios.post(backendUrl + '/cancel-appointment',{appointmentId},{headers:{aToken}})
    
            if(data.success)
            {
                toast.success(data.message)
                getAllAppointments()
            }else{
                toast.error(error.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
     }

    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        getAllDoctors,changeAvailability,
        appointments,setAppointments,
        getAllAppointments,
        cancelAppointment
    }   
    
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
