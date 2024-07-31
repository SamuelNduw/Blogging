import React from "react";

const BlogCard = ({title, body, author, onClick}) => {
    return (
        <div className='max-w-md border-2 border-gray-200 px-4 py-2 rounded-md flex flex-col gap-3 hover:shadow-md hover:cursor-pointer hover:scale-105 duration-200 ease-in-out delay-75' onClick={onClick}>
            <h1 className='font-semibold text-center text-2xl truncate-title'>
                {title}
            </h1>
            <p className='font-semibold text-gray-700 w-full overflow-hidden truncate-body'>
                {body}
            </p>
            <h2 className='font-semibold text-gray-900 text-center'>
                by {author}
            </h2>
        </div>
    );
};

export default BlogCard;
