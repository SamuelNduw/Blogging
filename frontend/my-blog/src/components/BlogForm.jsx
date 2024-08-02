import React, { useState } from "react";
import { createBlog } from "../services/blogService";

const BlogForm = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newBlog = { title, body, author };
        await createBlog(newBlog);
    } 

  return (
    <div className="bg-red-400 w-full flex justify-center">
        <div className="container flex flex-col justify-center py-24 gap-10 ">
            <div className="w-full flex justify-center">
                <h1 className=" text-4xl text-white">
                    Create a new Post
                </h1>
            </div>
            <form className='bg-white flex flex-col gap-5 w-full md:w-7/12 mx-auto py-5 rounded-md' 
            onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 px-4 ">
                    <label className="px-3">
                        Title
                    </label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter the title for your post"
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:outline-indigo-500 focus:ring focus:ring-indigo-500"/>
                </div>
                <div className="flex flex-col gap-2 px-4 ">
                    <label className="px-3">
                        Body
                    </label>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} required placeholder="Write the content of your post here..." rows="10"
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:outline-indigo-500 focus:ring focus:ring-indigo-500"/>
                </div>
                <div className="flex flex-col gap-2 px-4 ">
                    <label className="px-3">
                        Author
                    </label>
                    <input className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:outline-indigo-500 focus:ring focus:ring-indigo-500" 
                    type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required placeholder="Enter your name"/>
                </div>
                <div className="flex justify-center w-full mt-5 px-4">
                    <button className="text-white bg-indigo-600 hover:bg-indigo-500 px-24 py-2 rounded-md w-full text-lg"
                    type='submit'>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
};

export default BlogForm;
