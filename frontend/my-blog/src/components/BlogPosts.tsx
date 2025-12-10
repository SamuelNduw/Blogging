import { useState, useEffect } from "react";
import BlogCard from './BlogCard';
import { MdDelete } from "react-icons/md";
import { getBlogs, deleteBlogPost } from '../services/blogService';
import { useNavigate } from "react-router-dom";

import toast, { Toaster } from 'react-hot-toast';
import BlobsBackground from "./BlobsBackground";
import { useBlog } from "../context/BlogContext";
import { stripHtml } from "../utils/stripHtml.js";

const BlogPosts = () => {
    
    const { setSelectedBlogRead, setOtherBlogs } = useBlog();

    const [selectedBlog, setSelectedBlog] = useState(null)
    const navigate = useNavigate();

    const handleBlogClick = (blog) => {
        setSelectedBlog(blog)
        console.log(blog)
    };
    const handleBlogClosed = () => {
        setSelectedBlog(null);
    };
    

    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const response = await getBlogs();
            setBlogs(response)
        };

        fetchBlogs();
    }, []);

    const handleDelete = async (blogID: number) => {
        await deleteBlogPost(blogID);

        const targetIndex = blogs.findIndex(obj => obj.id === blogID);
        if(targetIndex !== -1){
            const newArray = blogs.filter((item, index) => index !== targetIndex);
            setBlogs(newArray)
        }
    }

    const handleRead = (blog) => {
        setSelectedBlogRead(blog);
        // setOtherBlogs(blogs.filter((b) => b.id !== blog.id));
        navigate('/posts/read')
    }

    return (
        <>
            <Toaster />
            <div className='w-full px-8 pt-24 md:pt-0 pb-24 relative'>
                <BlobsBackground />
                <h1 className='hidden md:block text-center font-bold text-4xl p-10'>
                    Blogging
                </h1>
                <div className='container mx-auto grid sm:grid-cols-3 grid-cols-1 gap-4 justify-items-center'>
                    {
                        blogs.length ?
                        blogs.map((blog: any, index) => (
                            <BlogCard title={blog.title}
                            body={stripHtml(blog.body)}
                            author={blog.author}
                            image={blog.image_url} 
                            key={index}
                            // onClick={() => handleBlogClick(blog)} 
                            onClick={() => handleRead(blog)} 
                            />
                        ))  :
                        null
                    }
                </div>
                {
                    selectedBlog && (
                        <div className='z-10 fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-35 flex items-center justify-center px-5' onClick={handleBlogClosed}>
                            <div className='bg-white rounded-md h-[87vh] max-w-xl mx-auto px-12 py-8 border-2 border-gray-200 flex  flex-col gap-2'>
                                <div className='flex justify-end'>
                                    <button className='relative w-10 text-2xl font-bold top-0 right-0 text-black hover:text-red-500' onClick={handleBlogClosed} >
                                        x
                                    </button>
                                </div>
                                <img className="" src={selectedBlog.image_url} alt="Blog picture" />
                                <h1 className='font-semibold text-center text-2xl'>
                                    {selectedBlog.title}
                                </h1>
                                <h2 className='font-semibold text-gray-900 text-center'>
                                    by {selectedBlog.author}
                                </h2>
                                <p className='font-semibold text-gray-700 h-48 w-full overflow-scroll'>
                                    {selectedBlog.body}
                                </p>
                                

                                <button 
                                    onClick={() => handleRead(selectedBlog)}
                                    className="inline-flex justify-end pr-4 italic hover:text-blue-400 duration-200 ease-linear"
                                >
                                    Read more...
                                </button>
                                
                                <div className='flex justify-end'>
                                    <MdDelete size={30} 
                                        className='fill-gray-600 hover:fill-red-500'
                                        onClick={() => {
                                            handleDelete(selectedBlog.id);
                                            setSelectedBlog(null);
                                        }}/>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default BlogPosts;
