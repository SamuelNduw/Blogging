import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid'
import { useEffect, useState, useRef } from 'react';
import BlogCard from '../components/BlogCard';
import { getLatestBlogs } from '../services/blogService';

const BlogReaderPage = () => {

  const navigate = useNavigate()  
  const { selectedBlogRead, setSelectedBlogRead, setOtherBlogs} = useBlog();
  const [blogs, setBlogs] = useState([]);

  const [loadingImage, setLoadingImage] = useState(true)

  const audioRef = useRef(null);

  useEffect(() => {
    if(!selectedBlogRead){
        const saved = localStorage.getItem("selectedBlogRead");
        if(saved){
            setSelectedBlogRead(JSON.parse(saved));
        } else {
            navigate('/posts');
        }
    }
  }, [selectedBlogRead, setSelectedBlogRead, navigate]);

  if (!selectedBlogRead) {
    return null;
  }

  useEffect(() => {
    const retrieveLatestBlogs = async () => {
        const latestBlogs = await getLatestBlogs();
        if(latestBlogs.status == 200){
            setBlogs(latestBlogs.data.filter((b) => b.id !== selectedBlogRead.id));
            setOtherBlogs(latestBlogs.data.filter((b) => b.id !== selectedBlogRead.id));
        } 
    }
    retrieveLatestBlogs();
  }, [selectedBlogRead]);

  const playAudio = async () => {
    const response = await axios.post("http://localhost:8001/stream-audio", {
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: selectedBlogRead.body }),
    });

    if (!response.ok){
        console.error("Audio stream failed.");
        return;
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    audioRef.current.src = audioUrl;
    audioRef.current.play();
  };


  return (
    <>
    <div className="max-w-3xl mx-auto p-4">
        <div className="w-full h-[2rem] md:h-72 bg-gray-200 rounded-md overflow-hidden relative">
            {loadingImage && (
                <div className="w-full h-full animate-pulse bg-gray-300 absolute top-0 left-0 z-10"/>
            )}
            <img 
                src={selectedBlogRead.image_url} 
                alt="" 
                onLoad={() => setLoadingImage(false)}
                className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${
                    loadingImage ? 'opacity-0' : 'opacity-100'
                }`}
            />
        </div>

        <div className='flex justify-end pt-2 pr-5'>
            <button onClick={playAudio}>
                <SpeakerWaveIcon className='size-6 text-gray-600 hover:text-gray-800' />
            </button>
            <audio ref={audioRef} />
        </div>
        
        <div className='flex justify-between pt-10'>
            <h1 className="text-4xl font-bold mb-4">
                {selectedBlogRead.title}
            </h1>
            <h1 className='font-medium italic pr-5'>
                {selectedBlogRead.author}
            </h1>
        </div>
        <p className=" text-gray-800 whitespace-pre-line pb-10">
            {selectedBlogRead.body}
        </p>
    </div>
    {/* Latest Blogs */}
    <div className='max-w-3xl mx-auto py-12 px-4'>
        <h1 className="text-4xl pb-10">
            Latest Blogs
        </h1>
        <div className='grid grid-cols-3 gap-2'>
            {
                blogs.slice(0, 3).map((blog) => (
                    <BlogCard 
                        key={blog.id} 
                        title={blog.title}
                        author={blog.author}
                        body={blog.body} 
                        onClick={() => {
                            setSelectedBlogRead(blog);
                            navigate('/posts/read');
                        }}
                    />
                ))
            }
        </div>
    </div>
    </>
  );
};

export default BlogReaderPage;
