import React from "react";
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="w-full h-screen flex flex-col gap-5 items-center justify-center">
            <h1 className='text-4xl font-bold'>
                404 - Page Not Found
            </h1>
            <h2 className='text-gray-700 text-lg'>
                The page you requested could not be located. Please <br/> check the URL or try navigating back to the homepage.
            </h2>
            <button className='bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md'>
                <Link to='/'>
                    Go to Homepage
                </Link>
            </button>
        </div>
    );
};

export default NotFoundPage;
