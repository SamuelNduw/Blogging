import React, { useState } from "react";
import { IoMdMenu, IoMdTrendingUp, IoMdInformationCircleOutline } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";

const Navbar = () => {

    const [nav, setNav] = useState(false);

  return (
    <>
        <div className="w-full h-12 fixed md:relative z-10 bg-indigo-600 text-white flex items-center justify-around ">
            <div className="flex justify-between md:justify-around w-full">
                <div className="text-center pl-5 md:pl-0 ">
                    <h1 className="text-3xl ">
                        Blogging
                    </h1>
                </div>
                <div className=' hidden md:block'>
                    <ul className="flex gap-4">
                        <li className="px-4 py-2 hover:cursor-pointer flex items-center gap-2 text-shadow"><BsPencilSquare />Post</li>
                        <li className="px-4 py-2 hover:cursor-pointer text-shadow">Trending</li>
                        <li className="px-4 py-2 hover:cursor-pointer text-shadow">About</li>
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
                    Post <BsPencilSquare/> 
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
