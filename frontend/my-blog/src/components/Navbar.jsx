import React, { useState } from "react";
import { IoMdMenu, IoMdTrendingUp, IoMdInformationCircleOutline } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { NavLink } from 'react-router-dom';

const Navbar = () => {

    const [nav, setNav] = useState(false);

  return (
    <>
        <div className="w-full h-12 fixed md:relative z-10 bg-indigo-600 text-white flex items-center justify-around ">
            <div className="flex justify-between md:justify-around w-full">
                <div className="text-center pl-5 md:pl-0 ">
                    <h1 className="text-3xl ">
                        <NavLink to='/' end activeClassName='acitve'>
                            Blogging
                        </NavLink>
                    </h1>
                </div>
                <div className=' hidden md:block'>
                    <ul className="flex gap-4">
                        <NavLink to='/create-post' activeClassName='active'>
                            <li className="px-4 py-2 hover:cursor-pointer flex items-center gap-2 text-shadow rounded-md bg-none hover:bg-indigo-500 duration-150 ease-in-out">
                                <BsPencilSquare />
                                Compose
                            </li>
                        </NavLink>
                        <NavLink to='/trending' activeClassName='active'>
                            <li className="px-4 py-2 hover:cursor-pointer text-shadow rounded-md bg-none hover:bg-indigo-500 duration-150 ease-in-out">Trending</li>
                        </NavLink>
                        <NavLink to='/about' activeClassName='active'>
                            <li className="px-4 py-2 hover:cursor-pointer text-shadow rounded-md bg-none hover:bg-indigo-500 duration-150 ease-in-out">
                                About
                            </li>
                        </NavLink>
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
        
            
            <div className={`w-48 overflow-hidden h-full sliding-container z-10 fixed top-12  shadow-md shadow-gray-800 ${nav ? ' max-h-screen' : 'max-h-0'}  bg-indigo-600`}>
                <ul className="flex flex-col items-start gap-5 py-10 pl-10">
                    <li className="px-4 py-2 hover:cursor-pointer flex items-center gap-2 text-white text-lg">
                        Compose <BsPencilSquare/> 
                    </li>
                    <li className="px-4 py-2 hover:cursor-pointer flex items-center gap-2 text-white text-lg">
                        Trending <IoMdTrendingUp />
                    </li>
                    <li className="px-4 py-2 hover:cursor-pointer flex items-center gap-2 text-white text-lg">
                        About <IoMdInformationCircleOutline />
                    </li>
                </ul>
            </div> 
        
    </>
  )
};

export default Navbar;
