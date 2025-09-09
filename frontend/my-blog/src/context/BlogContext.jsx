import { createContext, useContext, useState, useEffect } from 'react';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
    const [selectedBlogRead, setSelectedBlogRead] = useState(null);
    const [otherBlogs, setOtherBlogs] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("selectedBlog");
        if(saved){
            try{
                const parsed = JSON.parse(saved);
                setSelectedBlogRead(parsed);
            }catch(e){
                console.warn("Invalid blog in localStorage");
            }
        }
    }, [])

    useEffect(() => {
        if(selectedBlogRead){
            localStorage.setItem("selectedBlogRead", JSON.stringify(selectedBlogRead));
        }
    }, [selectedBlogRead])

    useEffect(() => {
        if(otherBlogs){
            localStorage.setItem("otherBlogs", JSON.stringify(otherBlogs))
        }
    }, [otherBlogs])

    return (
        <BlogContext.Provider 
            value={{ 
                selectedBlogRead, 
                setSelectedBlogRead, 
                otherBlogs, 
                setOtherBlogs 
            }}
        >
            {children}
        </BlogContext.Provider>
    )
};

export const useBlog = () => useContext(BlogContext);