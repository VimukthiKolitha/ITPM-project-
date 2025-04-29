import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/adminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AllApointments from './pages/Admin/AllApointments';
import DoctorsList from './pages/Admin/DoctorsList';
import AddDoctor from './pages/Admin/AddDoctor';
import Dashboard from './pages/Admin/Dashboard';
import { Route, Routes } from 'react-router-dom';
import { DoctorContex } from './context/DoctorContext';
import DoctorDashbord from './pages/Doctor/DoctorDashbord';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import WriteBlog from './pages/Blog/WriteBlog';
import BlogList from './pages/Blog/BlogList';
import PayDashboard from './pages/Payment/PayDashboard'
const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContex)

  return aToken || dToken ?(
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
       <Routes>
        {/*Admin Routes */}
              <Route path='/' element={<></>} />
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/all-appointments' element={<AllApointments />} />
              <Route path='/add-doctors' element={<AddDoctor />} />
              <Route path='/doctors-list' element={<DoctorsList />} />

              {/*Doctor Routes */}
              <Route path='/doctors-dashbord' element={<DoctorDashbord />} />
              <Route path='/doctors-appointments' element={<DoctorAppointments />} />
              <Route path='/doctors-profile' element={<DoctorProfile />} />

               {/*Blog Routes */}
               <Route path='/blog-write' element={<WriteBlog />} />
               <Route path='/blog-list' element={<BlogList />} />

                {/*paymrnt Routes */}
                <Route path='/pay-dash' element={<PayDashboard/>}/>
  
       </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App
