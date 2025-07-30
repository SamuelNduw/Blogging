import { useEffect } from "react";
import BlobsBackground from '../components/BlobsBackground.jsx';
import HeroSection from '../components/HeroSection.jsx';
import { useNavigate } from "react-router-dom";
import { tokenRefresh } from "../services/blogService.js";
import Cookies from 'js-cookie'


const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    if(!Cookies.get('accessToken') && Cookies.get('refreshToken')){
      const getNewAccessToken = async () => {
        const credentials = {'refresh': Cookies.get('refreshToken')};
        const response = await tokenRefresh(credentials);
        Cookies.set('accessToken', response.access, { expires: 1/24 });
      }
      getNewAccessToken();
      console.log('success')
      navigate('/posts')
    } else if(Cookies.get('accessToken') && Cookies.get('refreshToken')){
      navigate('/posts')
    } 
  }, [])

  return (
    <>
        <div className='w-full pt-32 md:pt-16 relative'>        
            <BlobsBackground />
            <HeroSection />
        </div>
    </>
  );
};

export default Home;
