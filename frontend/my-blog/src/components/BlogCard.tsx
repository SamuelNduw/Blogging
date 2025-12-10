import React from "react";
import { FaEdit } from "react-icons/fa";

interface BlogCardProps {
    title: string;
    body: string;
    author: string;
    onClick: () => void;
    home?: boolean; // home is optional
    image: string;
    profile: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({title, body, author, onClick, home, image, profile}) => {


    return (
        <div className={`max-w-md ${home ? 'sm:min-w-[28rem] w-[15rem]' : 'max-w-md' } bg-white border-2 border-gray-200 px-4 py-2 rounded-md flex flex-col gap-3 hover:shadow-md hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out delay-75`} onClick={onClick}>
            {profile && (
                <div className="w-full flex justify-end">
                    <FaEdit className="text-gray-400  hover:text-gray-800 transition-all duration-300 scale-105 ease-linear"/>
                </div>
            )}
            <h1 className='font-semibold text-center text-2xl truncate-title'>
                {title}
            </h1>
            <p className='font-semibold text-gray-700 w-full overflow-hidden truncate-body'>
                {body}
            </p>
            <h2 className='font-semibold text-gray-900 text-center'>
                by {author}
            </h2>
            <img src={image} alt=""  className="object-cover h-36"/>
        </div>
    );
};

export default BlogCard;
