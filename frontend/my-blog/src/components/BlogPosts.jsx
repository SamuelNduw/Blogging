import React, { useState, useEffect } from "react";
import BlogCard from './BlogCard';
import axios from 'axios';

const BlogPosts = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/blogging')
        .then(response => {
            setBlogs(response.data);
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }, [])
    return (
        <div className='w-full px-8 font-archivo'>
            <h1 className='text-center font-bold text-4xl p-10'>
                Blogging
            </h1>
            <div className='container mx-auto grid sm:grid-cols-3 grid-cols-1 gap-4 justify-items-center'>
                {
                    blogs.length ?
                    blogs.map((blog, index) => (
                        <BlogCard title={blog.title}
                        body={blog.body}
                        author={blog.author} key={index}/>
                    )) :
                    null
                }
            </div>
        </div>
    );
};

export default BlogPosts;
