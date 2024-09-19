import React from "react";
import BlogCard from '../components/BlogCard.jsx';

const HeroSection = () => {
  return (
    <>
        <div className='flex flex-col gap-10 justify-center items-center px-10'>
                <h1 className='text-6xl uppercase font-bold gradient-text animate-gradient'>
                    Think out loud
                </h1>
                <p className="max-w-4xl text-center text-lg">
                    Share your thoughts in an instant, right at your fingertips. Let your friends know what you are thinking about. The most trendy, controversial and shocking blogs, right here.
                </p>
                <div className='w-full flex justify-center'>
                    <button className='px-4 py-2 bg-indigo-500 hover:bg-indigo-400 shadow-md rounded-lg text-white text-lg duration-500 ease-in-out hover:scale-105'>
                        Register
                    </button>
                </div>
            </div>

            <div className='relative mx-auto py-10'>

                <div className='absolute left-1/4 -translate-x-1/4 hover:z-30'>
                    <BlogCard title="Understanding Serverless Architecture for Scalable Applications" 
                        body="Serverless architecture allows developers to build scalable applications without managing servers. This model abstracts server management, enabling automatic scaling, reduced operational costs, and improved deployment speed, fostering agile development practices."
                        author="Captain Price"
                        home={true}/>
                </div>
                <div className='absolute left-1/2 -translate-x-1/2 top-24 z-10 hover:z-30'>
                    <BlogCard title="Benefits of Microservices" 
                        body="Progressive Web Apps (PWAs) combine the best of web and mobile applications. They offer offline capabilities, push notifications, and app-like experiences, enhancing user engagement and accessibility across various devices."
                        author="Green Star"
                        home={true}/>
                </div>
                <div className='absolute left-3/4 -translate-x-3/4 top-48 z-20 hover:z-30'>
                    <BlogCard title="The Future of Artificial Intelligence: Trends to Watch in 2023" 
                        body="As we enter a new year, it's clear that artificial intelligence (AI) will continue to play a major role in shaping the tech industry. From virtual assistants to self-driving cars, AI is transforming the way we live and work. In 2023, we can expect to see significant advancements in areas such as natural language processing, computer vision, and machine learning. One trend to watch is the rise of Explainable AI (XAI), which aims to make AI decision-making more transparent and accountable. Another trend is the increasing use of AI in edge computing, enabling faster and more efficient processing of data at the edge of the network. As AI continues to evolve, it's essential to stay informed about the latest developments and trends."
                        author="Rachel Lee, Tech Correspondent"
                        home={true}/>
                </div>
            </div>
    </>
  );
};

export default HeroSection;
