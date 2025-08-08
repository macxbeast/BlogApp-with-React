import React from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth.js"
import {logout} from "../../store/authSlice.js"

function LogoutBtn(){
    const dispatch = useDispatch()
    const handleLogout = ()=>{
        authService.logout()    //Even though this function doesn't return anything explicitly, an async function always returns a Promise.
        .then(()=>{              //So authService.logout() still returns a Promise, which will:
            dispatch(logout())   //resolve when the function completes (even if it returns nothing)
        })                       //reject if an uncaught error is thrown
        .catch((err)=>{
            console.log("Error in logoutBtn inside header component: ", err)
        })
    }
    return(
        <button
        className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
        onClick={handleLogout}
        >
        Logout
        </button>
    )
}

export default LogoutBtn