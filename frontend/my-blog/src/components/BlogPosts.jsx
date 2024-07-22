import React from "react";
import BlogCard from './BlogCard';

const BlogPosts = () => {
    return (
        <div className='w-full px-8 font-archivo'>
            <h1 className='text-center font-bold text-4xl p-10'>
                Blogging
            </h1>
            <div className='container mx-auto grid sm:grid-cols-3 grid-cols-1 gap-4 justify-items-center'>
                <BlogCard title="Hello World" 
                body="This is the first blog post on the Django + React JS project." 
                author='Samuel Nduw'/>
                <BlogCard title="Hello World" 
                body="This is the first blog post on the Django + React JS project." 
                author='John Doe'/>
                <BlogCard title="Understanding Serverless Architecture for Scalable Applications" 
                body="Serverless architecture allows developers to build scalable applications without managing servers. This model abstracts server management, enabling automatic scaling, reduced operational costs, and improved deployment speed, fostering agile development practices." 
                author='Captain Price'/>
                <BlogCard title="The Rise of Edge Computing in Modern Web Development" 
                body="Edge computing is revolutionizing web development by bringing computation closer to the data source. This reduces latency, enhances performance, and ensures real-time processing, making applications faster and more efficient." 
                author='Pink Banana'/>
                <BlogCard title='Exploring AI in Web Design' 
                body='AI transforms web design with personalized experiences and automated processes.' 
                author='Logical King'/>
                <BlogCard title='Benefits of Microservices Architecture' 
                body='Progressive Web Apps (PWAs) combine the best of web and mobile applications. They offer offline capabilities, push notifications, and app-like experiences, enhancing user engagement and accessibility across various devices.' 
                author='Green Star'/>
                <BlogCard title='The power of GraphQL' 
                body='GraphQL optimizes data fetching with precise queries.' 
                author='Big CEO'/>
            </div>
        </div>
    );
};

export default BlogPosts;
