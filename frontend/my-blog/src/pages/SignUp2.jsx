import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

import BlobsBackground from "../components/BlobsBackground";
import toast, { Toaster } from 'react-hot-toast'
import { useState } from "react";
import { getTokens } from "../services/blogService";

const SignUp2 = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    var accessToken;
    var refreshToken;
    if(!username || !password){
      toast.error('Please fill out all fields.')
      return;
    }

    try{
      const data = {username, password};
      const response = await getTokens(data);
      console.log(response)
      if(response.status == 200){
        accessToken = response.data.access;
        refreshToken = response.data.refresh;
        console.log(response)
      } else{
        throw new Error("Error Logging In.")
      }

      Cookies.set('accessToken', accessToken, { expires: 1/24 });
      Cookies.set('refreshToken', refreshToken, { expires: 7});

      toast.success('Successfully Logged In.')

      setTimeout(() => {
        navigate('/posts')
      }, 1500)

    } catch(e){
      console.error("Login failed.", e);
    }
  };

  return (
    <>
      <div className='w-full px-8 pt-24 md:pt-10 pb-24 relative'>
        <Toaster />
        <BlobsBackground />   
        <div className="container mx-auto bg-[#ffffff91] px-12 py-16 rounded-md shadow-lg flex justify-center">
            <form action=""
                className="flex flex-col gap-5 w-80 md:w-[40rem]"
                onSubmit={handleSubmit}
            >
                <h1 className="text-center text-4xl">
                    Login
                </h1>
                <input 
                    className="mb-5 shadow-md px-4 py-3 rounded-md focus:outline-none" 
                    type="username" 
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    className="mb-5 shadow-md px-4 py-3 rounded-md focus:outline-none" 
                    type="password"  
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white rounded-md duration-300 ease-in-out" type="submit">
                    Submit
                </button>
            </form>
        </div> 
      </div> 
    </>
  );
};

export default SignUp2;
