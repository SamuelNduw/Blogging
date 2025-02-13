import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage'
import { storage } from '../firebase/firebaseConfig';
import { createBlog } from "../services/blogService";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const BlogForm = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const navigate = useNavigate();

    const handleUpload = async () => {
        if(!file) return "";

        const storageRef = ref(storage, `blogImages/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.log(`There was an error! Upload Failed! \n ${error}`);
                },
                async () => {
                    try{
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log('File available at: ', downloadURL);
                        resolve(downloadURL);
                    } catch(error){
                        reject(error);
                    }
                }
            )
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title || !body || !author){
            toast.error('Please fill out all fields.');
            return;
        }

        
        setIsSubmitting(true);
        
        try{
            var image_url;
            var newBlog;
            if(file){
                image_url = await handleUpload();
                newBlog = {title, body, author, image_url}
            } else{
                newBlog = {title, body, author}
            }
            // const image_url = file ? await handleUpload() : "";
            // const newBlog = { title, body, author, image_url };
            await createBlog(newBlog);
            toast.success('Form submitted successfully.');
            console.log('success')
            setTimeout(() => {
                navigate('/');
            }, 1500);
            console.log('success 2')
        } catch(e){
            console.log(e);
            toast.error('Something went wrong. Try again.')
        } finally{
            setIsSubmitting(false);
        }

        
    } 

  return (
    <div className="bg-blue-100 w-full flex ">
    <Toaster />
        <div className="container flex flex-col justify-center mx-auto pt-10 pb-24 gap-10">
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
                <div className="flex flex-col gap-2 px-4">
                    <label className="px-3">Image</label>
                    <input type="file" id="imageUpload" className="hidden" onChange={handleFileChange} />
                    <label for="imageUpload" className="cursor-pointer px-3 py-2 text-white bg-indigo-400 text-center">
                        Choose a Photo
                    </label>
                    {
                        file &&
                        (<>
                        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-indigo-400 transition-all"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p>Upload Progress: {progress}%</p>
                        </>
                        )
                    }
                </div>
                <div className="flex justify-center w-full mt-5 px-4">
                    <button className="text-white bg-indigo-600 hover:bg-indigo-500 px-24 py-2 rounded-md w-full text-lg"
                        type='submit' disabled={isSubmitting}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
};

export default BlogForm;
