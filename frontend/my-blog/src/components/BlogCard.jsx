import React from "react";

const BlogCard = ({title, body, author}) => {
    return (
        <div className='max-w-md border-2 border-gray-200 px-4 py-2 rounded-md flex flex-col gap-3'>
            <h1 className='font-semibold text-center text-2xl truncate-title'>
                {title}
            </h1>
            <p className='font-semibold text-gray-700 w-full overflow-hidden truncate-body'>
                {body}
            </p>
            <h1 className='font-semibold text-gray-900 text-center'>
                by {author}
            </h1>
            <div className="w-full flex justify-end">
                <button className='cursor-pointer mx-4'>
                    Read More...
                </button>
            </div>
        </div>
    );
};

export default BlogCard;
