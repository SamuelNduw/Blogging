import React from "react";
import BlobsBackground from '../components/BlobsBackground.jsx';
import HeroSection from '../components/HeroSection.jsx';


const Home = () => {
  return (
    <>
        <div className='w-full pt-32 md:pt-16 relative'>        
            <BlobsBackground />
            <HeroSection />
        </div>
    </>
  );
};

export default Home;
