import { useState, useEffect } from "react";
import { IoMdMenu, IoMdTrendingUp, IoMdInformationCircleOutline } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { NavLink } from 'react-router-dom';

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

const Navbar = () => {

    const [nav, setNav] = useState(false);
    const [login, isLogin] = useState(false)
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate("/");
    }

    const handleLogin = () => {
        navigate('/signup2')
    }
    
    useEffect(() => {
        if(Cookies.get('accessToken') && Cookies.get('refreshToken')){
            isLogin(true);
        }
    }, [])

  return (
    <>
        <div className="w-full h-12 relative md:relative z-10 bg-indigo-600 text-white flex items-center justify-around ">
            <div className="flex justify-between md:justify-around w-full">
                <div className="text-center pl-5 md:pl-0 ">
                    <h1 className="text-3xl ">
                        <NavLink to='/' end activeclassname='acitve'>
                            Blogging
                        </NavLink>
                    </h1>
                </div>
                <div className=' hidden md:block'>
                    <ul className="flex gap-4">
                        <NavLink to='/create-post' activeclassname='active'>
                            <li className="px-4 py-2 hover:cursor-pointer flex items-center gap-2 text-shadow rounded-md bg-none hover:bg-indigo-500 duration-150 ease-in-out">
                                <BsPencilSquare />
                                Compose
                            </li>
                        </NavLink>
                        <NavLink to='/posts' activeclassname='active'>
                            <li className="px-4 py-2 hover:cursor-pointer text-shadow rounded-md bg-none hover:bg-indigo-500 duration-150 ease-in-out">Posts</li>
                        </NavLink>
                        <NavLink to='/trending' activeclassname='active'>
                            <li className="px-4 py-2 hover:cursor-pointer text-shadow rounded-md bg-none hover:bg-indigo-500 duration-150 ease-in-out">Trending</li>
                        </NavLink>
                        <NavLink to='/about' activeclassname='active'>
                            <li className="px-4 py-2 hover:cursor-pointer text-shadow rounded-md bg-none hover:bg-indigo-500 duration-150 ease-in-out">
                                About
                            </li>
                        </NavLink>
                        {login ? (
                            <button onClick={handleLogout}>
                                <li className="px-4 py-2 hover:cursor-pointer text-shadow rounded-md bg-none hover:bg-indigo-500 duration-150 ease-in-out">
                                    Logout
                                </li>
                            </button>
                        ): (
                            <button onClick={handleLogin}>
                                <li className="px-4 py-2 hover:cursor-pointer text-shadow rounded-md bg-none hover:bg-indigo-500 duration-150 ease-in-out">
                                    Login
                                </li>
                            </button>
                        )
                        }
                    </ul>
                </div>
            </div>
            <div className="md:hidden pr-5 md:pr-0 scale-150"
                onClick={() => setNav(!nav)}>
                {
                    nav ?
                    <IoCloseSharp/> :
                    <IoMdMenu />
                }
            </div>
        </div>
        
            
            <div className={`w-48 overflow-hidden h-full sliding-container z-50 fixed top-12  shadow-md shadow-gray-800 ${nav ? ' max-h-screen' : 'max-h-0'}  bg-indigo-600`}>
                <ul className="flex flex-col items-start gap-5 py-10 pl-10">
                    <NavLink to='/create-post'>
                        <li className="px-4 py-2 hover:cursor-pointer flex items-center gap-2 text-white text-lg">
                            Compose <BsPencilSquare/> 
                        </li>
                    </NavLink>
                    <NavLink to='/posts'>
                        <li className="px-4 py-2 hover:cursor-pointer flex items-center gap-2 text-white text-lg">
                            Posts 
                        </li>
                    </NavLink>
                   <NavLink>
                        <li className="px-4 py-2 hover:cursor-pointer flex items-center gap-2 text-white text-lg">
                            Trending <IoMdTrendingUp />
                        </li>
                    </NavLink>
                    <NavLink>
                        <li className="px-4 py-2 hover:cursor-pointer flex items-center gap-2 text-white text-lg">
                            About <IoMdInformationCircleOutline />
                        </li>
                    </NavLink>
                </ul>
            </div> 
        
    </>
  )
};

export default Navbar;
