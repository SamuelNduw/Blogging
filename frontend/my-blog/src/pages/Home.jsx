import React from "react";
import BlogCard from '../components/BlogCard.jsx';

const Home = () => {
  return (
    <>
        <div className='w-full pt-32 md:pt-16'>

            <div className='flex flex-col gap-10 justify-center items-center  px-10'>
                <h1 className='text-5xl uppercase'>
                    Think out loud
                </h1>
                <p className="max-w-4xl text-center text-lg">
                    Share your thoughts in an instant, right at your fingertips. Let your friends know what you are thinking about. The most trendy, controversial and shocking blogs, right here.
                </p>
                <div className='w-full flex justify-center'>
                    <button className='px-4 py-2 bg-indigo-500 rounded-md text-white text-lg'>
                        Register
                    </button>
                </div>
            </div>

            <div className='relative mx-auto py-10'>

                <div className='absolute left-1/4 -translate-x-1/4'>
                    <BlogCard title="Benefits of Microservices" 
                        body="Progressive Web Apps (PWAs) combine the best of web and mobile applications. They offer offline capabilities, push notifications, and app-like experiences, enhancing user engagement and accessibility across various devices."
                        author="Green Star"
                        home={true}/>
                </div>
                <div className='absolute left-1/2 -translate-x-1/2 top-24 z-10'>
                    <BlogCard title="Benefits of Microservices" 
                        body="Progressive Web Apps (PWAs) combine the best of web and mobile applications. They offer offline capabilities, push notifications, and app-like experiences, enhancing user engagement and accessibility across various devices."
                        author="Green Star"
                        home={true}/>
                </div>
                <div className='absolute left-3/4 -translate-x-3/4 top-48 z-20'>
                    <BlogCard title="Benefits of Microservices" 
                        body="Progressive Web Apps (PWAs) combine the best of web and mobile applications. They offer offline capabilities, push notifications, and app-like experiences, enhancing user engagement and accessibility across various devices."
                        author="Green Star"
                        home={true}/>
                </div>
            </div>
            

        </div>
    </>
  );
};

export default Home;
