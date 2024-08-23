import React from "react";

const BlobsBackground = () => {
  return (
    <>
        <div className='fixed top-24 -left-4 w-[22rem] h-[21rem] bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob2 -z-10'></div>
        <div className='absolute top-24 right-80 w-[21rem] h-[20rem] bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob3 animation-delay-2000 -z-10'></div>
        <div className='absolute -bottom-48 left-0 sm:left-48 w-[23rem] h-[22rem] bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-5000 -z-10 hidden sm:block'></div>
        <div className='absolute top-[28rem] left-50 -translate-x-1/2 w-[23rem] h-[22rem] bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob -z-10'></div>
    </>
  );
};

export default BlobsBackground;
