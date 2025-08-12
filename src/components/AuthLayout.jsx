import React,{useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({
    children,
    authentication=true
}){
    const navigate = useNavigate()
    const [loader,setLoader]= useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(()=>{
        // basic
        // if (authStatus ===true){
        //     navigate("/")
        // } else if (authStatus === false) {
        //     navigate("/login")
        // }
        

        //more advanced

        //Example: You’re logged out ❌ and you try to open /dashboard (members-only).
        //The page requires login but you’re not logged in, so you get sent to /login to sign in first.
        if(authentication && authStatus !== authentication){
            navigate("/login")
        } 

        //Example:You’re logged in ✅ and you try to open /login (or /signup).
        //This page is meant only for logged-out visitors — it doesn’t make sense for logged-in users to see a signup or login page.
        //The system detects you are logged in, so it redirects you to / (home).
        else if(!authentication && authStatus !== authentication){
            navigate("/")
        }

        //Example:You’re logged out ❌ and you open /login (or /signup).
        //This page is meant for logged-out visitors and you are logged out, so you can see it normally, without any redirection.

        //Example:You’re logged in ✅ and you open /dashboard (which is a members-only area).
        //Since the page requires login and you are logged in, you can enter without any redirection
        
        setLoader(false)
    },[authStatus,navigate,authentication])

    return loader ? <h1>Loading...</h1> : <>{children}</>
}
