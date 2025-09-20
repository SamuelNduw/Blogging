import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid'
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
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
    try {
      // If blog already has audio_url, use it directly
      if (selectedBlogRead.audio_url) {
        audioRef.current.src = selectedBlogRead.audio_url;
        await audioRef.current.play();
        return;
      }

      // Otherwise, request backend to synthesize and store, then return URL
      const resp = await axios.post(`http://localhost:8000/ai/text_to_speech`, {
        blog_id: selectedBlogRead.id,
      });

      const { audio_url } = resp.data || {};
      if (!audio_url) {
        console.error('No audio_url returned');
        return;
      }

      // Update local state and localStorage copy
      const updated = { ...selectedBlogRead, audio_url };
      setSelectedBlogRead(updated);
      localStorage.setItem('selectedBlogRead', JSON.stringify(updated));

      audioRef.current.src = audio_url;
      await audioRef.current.play();
    } catch (e) {
      console.error('Audio playback failed: ', e);
      if (e.response) {
        console.error('Server response:', e.response.data);
      }
    }
  };


    return (
        <div className="max-w-7xl mx-auto p-4">
        {/* Main layout container - desktop: flex row, mobile: flex column */}
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main blog content */}
            <div className="flex-1 lg:max-w-4xl">
            {/* Blog image */}
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

            {/* Audio control */}
            <div className='flex justify-end pt-2 pr-5'>
                <button onClick={playAudio}>
                <SpeakerWaveIcon className='size-6 text-gray-600 hover:text-gray-800' />
                </button>
                <audio ref={audioRef} />
            </div>
            
            {/* Blog header */}
            <div className='flex flex-col md:flex-row md:justify-between pt-10'>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {selectedBlogRead.title}
                </h1>
                <h1 className='font-medium italic pr-5 text-gray-600 mb-4 md:mb-0'>
                {selectedBlogRead.author}
                </h1>
            </div>
            
            {/* Blog content */}
            <p className="text-gray-800 whitespace-pre-line pb-10 text-md leading-relaxed">
                {selectedBlogRead.body}
            </p>
            </div>

            {/* Sidebar - Latest Blogs (desktop: right sidebar, mobile: bottom section) */}
            <div className="w-full lg:w-80 lg:sticky lg:top-4 lg:self-start">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Latest Blogs
                </h2>
                
                {/* Latest blogs list - vertical layout */}
                <div className="space-y-4">
                {blogs.slice(0, 3).map((blog) => (
                    <div 
                    key={blog.id}
                    onClick={() => {
                        setSelectedBlogRead(blog);
                        navigate('/posts/read');
                    }}
                    className="flex cursor-pointer hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
                    >
                    {/* Blog thumbnail */}
                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 mr-4">
                        <img 
                        src={blog.image_url} 
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Blog info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                        {blog.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-1">
                        by {blog.author}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                        {blog.body}
                        </p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default BlogReaderPage;
