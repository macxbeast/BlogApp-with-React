import { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import './App.css'
import authService from './appwrite/auth'
import { login,logout } from './store/authSlice'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading]=useState(true)
  const dispatch = useDispatch()

  useEffect(()=>{                     //useEffect always runs after render.
                                      //Whether it “takes time” noticeable to the user depends on what you put inside — if it’s a network call, yes, you’ll see the loading state.
    authService.getCurrentUser(false)      
    .then((userData)=>{               //So, initially App renders loading as true, but after useEffect is complete, it renders again with loading as false.
      if(userData){
        dispatch(login(userData))
      }
      else{
        dispatch(logout())
      }
    })
    .finally(()=>setLoading(false))
  },[])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header/>
            {/* <main> is an HTML5 semantic tag
            It represents the main content area of a webpage, the stuff that’s central and unique to that page.
            Screen readers, SEO engines, and accessibility tools recognize <main> as “the important part of the page.” */}
        <main>              
          <Outlet />
        </main>
        <Footer/>
      </div>
    </div>
  ) : (null)
}

export default App
