import React from "react";
import {Logo, Container, LogoutBtn} from "../index.js"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header(){

    const authStatus = useSelector((state)=>state.auth.status)
    const navigate = useNavigate()

    const navItems=[
        {
            name: 'Home',
            slug: "/",
            active: true
        }, 
        {
            name: "Login",
            slug: "/login",
            active: !authStatus,
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus,
        },
        {
            name: "All Posts",
            slug: "/all-posts",
            active: authStatus,
        },
        {
            name: "Add Post",
            slug: "/add-post",
            active: authStatus,
        }
    ]
        //Container expects a children prop(a prop which is bydefault treated, what is under a component, just like <Container>....</Container>. But, if another prop other than children would have used, then it would have not work in the same way it is used here). Alternatively, we can also have done <Container children={<nav>...</nav>}/>. But, this should not be used for complex codes under childern.)
    return( 
        <header className="py-3 shadow bg-gray-500">
            <Container>   
                <nav className="flex">
                    <div className="mr-4">
                        <Link to='/'>
                            <Logo width="70px"/>
                        </Link>
                    </div>
                    <ul className="flex ml-auto">
                        {navItems.map((item)=>(
                            item.active ? (
                                <li key={item.name}>
                                    <button
                                        onClick={()=> navigate(item.slug)}
                                        className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
                                    >
                                    {item.name}
                                    </button>
                                </li>
                            ) : (null)
                        ))}
                        {authStatus && (       //this syntax means that if the first thing(i.e. authStatus) is true, then only execute or display the second part. Very common syntax
                            <li>                    
                                <LogoutBtn/>        
                            </li>
                        )}
                    </ul>
                </nav>
            </Container>
        </header>
    )
}

export default Header