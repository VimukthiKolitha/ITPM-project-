import { createContext } from "react";



export const DoctorContex = createContext()

const DoctorContextProvider = (props) =>{
    const value = {

    }
    return(
        <DoctorContex.Provider value={value}>
            {props.children}
        </DoctorContex.Provider>
    )
}

export default DoctorContextProvider