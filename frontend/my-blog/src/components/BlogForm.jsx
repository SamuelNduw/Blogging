import React, { useState } from "react";
import { createBlog } from "../services/blogService";

const BlogForm = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newBlog = { title, body, author };
        await createBlog(newBlog)
    } 

  return (
    <div className="bg-gray-300 w-full">
        <div className="container font-archivo flex flex-col justify-center py-24 gap-10 ">
            <div className="w-full flex justify-center">
                <h1 className="font-bold text-3xl">
                    Create a new Post
                </h1>
            </div>
            <form className='bg-gray-200 flex flex-col gap-5 w-full md:w-5/12 mx-auto py-5 rounded-md' 
            onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 px-4 ">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter the title for your post"/>
                </div>
                <div className="flex flex-col gap-2 px-4 ">
                    <label>Body</label>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} required placeholder="Write the content of your post here..." />
                </div>
                <div className="flex flex-col gap-2 px-4 ">
                    <label>Author</label>
                    <input className="" 
                    type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required placeholder="Enter your name"/>
                </div>
                <div className="flex justify-center w-full">
                    <button className="text-white bg-blue-600 px-4 py-2 rounder-md"
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
