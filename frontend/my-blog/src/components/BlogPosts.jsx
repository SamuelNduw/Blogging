import React, { useState, useEffect } from "react";
import BlogCard from './BlogCard';
import BlogForm from './BlogForm';
import { getBlogs } from '../services/blogService';

const BlogPosts = () => {
    
    const [selectedBlog, setSelectedBlog] = useState(null)
    const handleBlogClick = (blog) => {
        setSelectedBlog(blog)
        console.log(blog)
    };
    const handleBlogClosed = () => {
        setSelectedBlog(null)
    };
    


    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const response = await getBlogs();
            setBlogs(response)
        };

        fetchBlogs();
    }, []);
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
                        author={blog.author} 
                        key={index}
                        onClick={() => handleBlogClick(blog)} />
                    ))  :
                    null
                }
            </div>
            {
                selectedBlog && (
                    <div className='fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-35 flex items-center justify-center px-5' onClick={handleBlogClosed}>
                        <div className='bg-white rounded-md max-w-xl mx-auto px-12 py-8 border-2 border-gray-200 flex  flex-col gap-8'>
                            <div className='flex justify-end'>
                                <button className='relative w-10 text-2xl font-bold top-0 right-0 text-black hover:text-red-500' onClick={handleBlogClosed} >
                                    x
                                </button>
                            </div>
                            <h1 className='font-semibold text-center text-2xl'>
                                {selectedBlog.title}
                            </h1>
                            <p className='font-semibold text-gray-700 w-full overflow-hidden'>
                                {selectedBlog.body}
                            </p>
                            <h2 className='font-semibold text-gray-900 text-center'>
                                by {selectedBlog.author}
                            </h2>
                        </div>
                    </div>
                )
            }
            <BlogForm />
        </div>
    );
};

export default BlogPosts;
