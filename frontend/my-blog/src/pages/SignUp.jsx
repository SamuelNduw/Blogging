import { useState, useEffect } from "react";
import BlobsBackground from '../components/BlobsBackground';
import { registerUser, getTokens, tokenRefresh } from '../services/blogService';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'

const SignUp = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();

    useEffect(()=> {
        if(!Cookies.get('accessToken')){
            const getNewAccessToken = async () => {
                const credentials = {'refresh': Cookies.get('refreshToken')};
                console.log(credentials)
                const response = await tokenRefresh(credentials);
                Cookies.set('accessToken', response.access, { expires: 1/24 });
            }
            getNewAccessToken();
            console.log('success')
        } else{
            navigate('/posts')
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        var accessToken;
        var refreshToken;
        if(!username || !email || !password){
            toast.error('Please fill out all fields.');
            return;
        }

        try{
            const data = {username, email, password};
            const response = await registerUser(data);
            if(response.status === 201){
                const tokens = await getTokens(data);
                accessToken = tokens.data.access;
                refreshToken = tokens.data.refresh;
            }else{
                throw new Error("Error signing up");
            }

            Cookies.set('accessToken', accessToken, { expires: 1/24 });
            Cookies.set('refreshToken', refreshToken, { expires: 7 });

            toast.success('Successfully Signed Up.');

            setTimeout(() => {
                navigate('/posts')
            }, 1500)
        } catch(e){
            console.error("Sign Up failed", e);
        }
    }

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
                        Sign Up
                    </h1>
                    <input 
                        className="mb-5 shadow-md px-4 py-3 rounded-md focus:outline-none" 
                        type="text"  
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        className="mb-5 shadow-md px-4 py-3 rounded-md focus:outline-none" 
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

export default SignUp;
