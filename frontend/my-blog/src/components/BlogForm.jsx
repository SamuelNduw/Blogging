import React, { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage'
import { storage } from '../firebase/firebaseConfig';
import { createBlog, fetchImagePreview, imageGeneration, variationGeneration } from "../services/blogService";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Menu, MenuButton, MenuItem, MenuItems, Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';
import { ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/solid'
import ImageModal from "./ImageModal";
import BlobsBackground from "./BlobsBackground";
import { v4 as uuidv4 } from 'uuid'

const BlogForm = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    // const variations = ["When I touched down in Cape Town, I was quite surprised by the chilly weather. My journey began with a trip to the city center on my way to the hotel. Coming from a smaller town, I was impressed by the advanced road systems and the variety of road signs I had never encountered before. \n\nThe folks at the hotel were incredibly friendly, offering me handy tips about exploring the city. Undoubtedly, the best view in Cape Town was from Table Mountain. I couldn't help but wonder how they managed to construct a restaurant up there—definitely something I'll have to look up! \n\nAnd then there was Boulders Beach, which left me puzzled because who knew there were penguins in Africa?", "When I touched down in Cape Town, I was quite surprised by the chilly weather. My journey began with a trip to the city center on my way to the hotel. Coming from a smaller town, I was impressed by the advanced road systems and the variety of road signs I had never encountered before. \n\nThe folks at the hotel were incredibly friendly, offering me handy tips about exploring the city. Undoubtedly, the best view in Cape Town was from Table Mountain. I couldn't help but wonder how they managed to construct a restaurant up there—definitely something I'll have to look up! \n\nAnd then there was Boulders Beach, which left me puzzled because who knew there were penguins in Africa?", "When I touched down in Cape Town, I was quite surprised by the chilly weather. My journey began with a trip to the city center on my way to the hotel. Coming from a smaller town, I was impressed by the advanced road systems and the variety of road signs I had never encountered before. \n\nThe folks at the hotel were incredibly friendly, offering me handy tips about exploring the city. Undoubtedly, the best view in Cape Town was from Table Mountain. I couldn't help but wonder how they managed to construct a restaurant up there—definitely something I'll have to look up! \n\nAnd then there was Boulders Beach, which left me puzzled because who knew there were penguins in Africa?"]
    const [variations, setVariations] = useState([]);

    const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [selectedTone, setSelectedTone] = useState(null);
    const [selectedArtStyle, setSelectedArtStyle] = useState(null);
    const [selectedVariationNumber, setSelectedVariationNumber] = useState(null);
    const [selectedVariationContent, setSelectedVariationContent] = useState(null);

    const tones = ['Casual', 'Motivational', 'Professional', 'Poetic', 'Expressive']
    const artStyles = ['Ghibli', 'Low Poly', 'Flat Illustration', 'Watercolor', 'Minimalist', 'Collage', 'Pop Art']

    const handleToneSelect = (value) => {
        setSelectedTone(value);
        console.log('Selected:', value)
    }

    const handleArtStyleSelect = (value) => {
        setSelectedArtStyle(value);
        console.log('Selected:', value);
    }

    const handleVariationSelect = (number, content) => {
        setSelectedVariationContent(content);
        setSelectedVariationNumber(number);
        console.log('Variation Selected:', number, content);
    }

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [progress, setProgress] = useState(0);

    const [imgSrc, setImgSrc] = useState(null)
    const [imgSrc2, setImgSrc2] = useState(null)

    const [loading, setLoading] = useState(true)
    const [variationsLoading, setVariationsLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)

    useEffect(() => {
        async function fetchImage(){
            try {
                setLoading(true);
                const url = await fetchImagePreview();
                setImgSrc(url);
            } catch(err){
                console.error(err);
                setError('Failed to load image')
            } finally{
                setLoading(false)
            }
        }

        fetchImage()

        return () => {
            if (imgSrc) URL.revokeObjectURL(imgSrc);
        }
    }, []);

    useEffect(() => {
        return () => {
            if(previewUrl){
                URL.revokeObjectURL(previewUrl);
            }
        }
    }, [previewUrl]);


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if(!selectedFile) return;

        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
    }

    const navigate = useNavigate();

    const handleUpload = async () => {
        if(!file && !imgSrc2) return "";

        let uploadFile = file;

        const uniqueFilename = `${title}-${uuidv4()}`

        // If no file was selected, but imgSrc2 is available, convert it to a blob
        if(!file && imgSrc2){
            const response = await fetch(imgSrc2);
            const blob = await response.blob();
            const extension = blob.type.split("/")[1];
            uploadFile = new File([blob], `${uniqueFilename}.${extension}`, {type: blob.type});
        }

        const storageRef = ref(storage, `blogImages/${uploadFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, uploadFile);

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
        if(!title || !body){
            toast.error('Please fill out all fields.');
            return;
        }

        setIsSubmitting(true);
        
        try{
            var image_url;
            var newBlog;
            if(file || imgSrc2){
                image_url = await handleUpload();
                newBlog = {title, body, image_url}
            } else{
                newBlog = {title, body}
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

    const handleBlogVariations = () => {

        if(!title || !selectedTone || !body){
            toast.error('Please fill in the title, body and tone to be able to generate variations!');
            return;
        }

        const blogInfo = {title, tone: selectedTone, content: body};

        async function generateVariations(blogInfo){
            try{
                setVariationsLoading(true);
                const generatedVariations = await variationGeneration(blogInfo);
                setVariations(generatedVariations.versions.variations)
                console.log(generatedVariations);
            } catch(err){
                console.error("failed to generate blog content variations", err);
            } finally {
                setVariationsLoading(false);
            }
        }

        generateVariations(blogInfo);
    }

    const handleGenerateImage = () => {

        if(!title || !selectedTone || !selectedArtStyle){
            toast.error('Please fill out all fields');
            return;
        }

        const blogInfo = {title, tone: selectedTone, art_style: selectedArtStyle};
        
        async function generateImage(blogInfo){
            try{
                setImageLoading(true);
                const url = await imageGeneration(blogInfo);
                setImgSrc2(url)
            } catch(err){
                console.error("failed to load image", err);
            } finally {
                setImageLoading(false);
            }
        }

        generateImage(blogInfo);

        return () => {
            if (imgSrc2) URL.revokeObjectURL(imgSrc2)
        }
    }

  return (
    <div className=" w-full flex ">
    <Toaster />
    <BlobsBackground />
        <div className="container flex flex-col justify-center mx-auto pt-10 pb-24 gap-10">
            <form className='bg-white flex flex-col gap-5 w-full md:w-7/12 mx-auto py-5 rounded-md shadow-xl' 
            onSubmit={handleSubmit}>
                <h1 className="text-4xl text-center">Create a Post</h1>
                {/* Title */}
                <div className="flex flex-col gap-2 px-4 ">
                    <label className="px-3">
                        Title
                    </label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter the title for your post"
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:outline-indigo-500 focus:ring focus:ring-indigo-500"/>
                </div>
                {/* Body Section */}
                <div className="flex flex-col gap-2 px-4 ">
                    <div className="flex justify-between">
                        <div>
                            <label className="px-3">
                                Body
                            </label>
                        </div>
                        <div className="flex gap-5">
                            <Menu as='div' className="relative inline-block">
                                <MenuButton  className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                                    {selectedTone || "Tone/Style"}
                                    <ChevronDownIcon aria-hidden='true' className='-mr-1 size-5 text-gray-400' />
                                </MenuButton>
                                <MenuItems 
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                                    {tones.map((name, index) => (
                                        <MenuItem className="block px-4 py-2 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-100 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                                            <button
                                                type="button"
                                                key={index}
                                                className="hover:bg-gray-100 text-gray-700 block w-full px-4 py-2 text-sm text-left"
                                                onClick={() => handleToneSelect(name)}
                                            >
                                                {name}
                                            </button>
                                        </MenuItem>
                                    ))}
                                </MenuItems>
                            </Menu>
                            
                            <Menu as='div' className="relative inline-block">
                                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                                    {selectedArtStyle || "Image Art Stle"}
                                    <ChevronDownIcon aria-hidden='true' className='-mr-1 size-5 text-gray-400' />
                                </MenuButton>
                                <MenuItems 
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                                    {artStyles.map((name, index) => (
                                        <MenuItem className="">
                                            <button 
                                                type="button"
                                                key={index}
                                                onClick={() => handleArtStyleSelect(name)}
                                                className="hover:bg-gray-100 text-gray-700 block w-full px-4 py-2 text-sm text-left"
                                            >
                                                {name}
                                            </button>
                                        </MenuItem>
                                    ))}
                                </MenuItems>
                            </Menu>

                            <button type="button" disabled={variationsLoading} onClick={() => handleBlogVariations()} className={`rounded-md ring-1 ring-gray-300 px-2 bg-yellow-400 text-white font-medium flex gap-2 items-center ${variationsLoading ? "cursor-not-allowed bg-gray-400" : "bg-yellow-400"}`}>
                                <h1>Generate Variations</h1>
                                <SparklesIcon aria-hidden='true' className=' size-5 text-white' />
                            </button>

                        </div>
                    </div>

                    <textarea value={body} onChange={(e) => setBody(e.target.value)} required placeholder="Write the content of your post here..." rows="10"
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:outline-indigo-500 focus:ring focus:ring-indigo-500"/>
                </div>

                {variationsLoading ? (
                    <div className="flex gap-3 px-4 h-48 animate-pulse">
                        {[1, 2, 3].map((_, index) => (
                        <div
                            key={index}
                            className="w-full py-2 bg-gray-200 rounded-md border-2 border-gray-300 px-2"
                        >
                            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
                            <div className="space-y-2">
                            <div className="h-3 bg-gray-300 rounded w-full"></div>
                            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    variations.length > 0 && (
                        <div className='flex gap-3 px-4 h-48'>
                            {variations.map((item) => (
                                <div onClick={() => {handleVariationSelect(item.blog_version_no, item.blog_content); setIsBlogModalOpen(true)}} className="w-full hover:scale-105 duration-200 ease-in-out py-2 bg-purple-100/50 rounded-md hover:cursor-pointer border-2 border-gray-300 px-2">
                                    <h1 className="text-center py-2 font-medium">Variation {item.blog_version_no}</h1>
                                    <p className="text-gray-800 text-sm/6">{item.blog_content.length > 110 ? `${item.blog_content.slice(0, 140)}...` : item.blog_content}</p>
                                </div>
                            ))}
                        </div>
                    )
                )}


                {/* Image Section */}
                <div className="flex flex-col gap-2 px-4">
                    <label className="px-3">Image</label>
                    <div className="flex justify-between">
                        <div className="w-1/2 flex justify-center">
                            <input type="file" id="imageUpload" className="hidden" onChange={handleFileChange} />
                            <label for="imageUpload" className="cursor-pointer px-3 py-2 text-white bg-indigo-400 text-center rounded-md">
                                Choose a Photo
                            </label>
                        </div>

                        <div className="w-1/2">
                            <button type='button' disabled={imageLoading} onClick={() => {handleGenerateImage()}} className={`w-full cursor-pointer px-3 py-2 text-white hover:bg-orange-600 ring-1 ring-gray-300 text-center rounded-md flex justify-center gap-2 duration-200 ease-linear ${imageLoading ? "cursor-not-allowed bg-gray-400" : "bg-orange-500"}`}>
                                <h1 className="font-medium">Generate Image</h1>
                                <SparklesIcon aria-hidden='true' className=' size-5' />
                            </button>
                        </div>
                    </div>
                    {
                        file || imgSrc2 &&
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

                <div className="px-12 flex flex-col gap-2 items-center">
                    {/* <img src={imgSrc} onClick={() => {setIsOpen(true)}} alt="Preview" className="w-64 md:max-w-md outline-dashed hover:cursor-pointer"/> */}
                    {/* {previewUrl && (
                        <img src={previewUrl} onClick={() => setIsOpen(true)} alt="Preview" className="w-64 md:max-w-md outline-dashed"/>
                    )} */}
                    {imageLoading ? (
                        <div className="w-64 md:max-w-md h-40 bg-gray-200 animate-pulse rounded-md outline-dashed border-2 border-gray-300"/>
                    ) : (
                        imgSrc2 && (
                            <img src={imgSrc2} onClick={() => {setIsOpen(true)}} alt="Preview" className="w-64 md:max-w-md outline-dashed hover:cursor-pointer"/>
                        )
                    )}
                </div>

                <div className="flex justify-center w-full mt-12 px-4">
                    <button className="text-white font-medium bg-indigo-600 hover:bg-indigo-500 px-24 py-2 rounded-md w-full text-lg"
                        type='submit' disabled={isSubmitting}>
                        Submit
                    </button>
                </div>
            </form>

            {/* Blog Variations Modal */}
            <Dialog open={isBlogModalOpen} as="div" className="relative z-10 focus:outline-none" onClose={() => setIsBlogModalOpen(false)}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto backdrop-blur-sm">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                    transition
                    className="w-full max-w-md rounded-xl bg-white/70 p-6 shadow-xl backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                    >
                    <DialogTitle as="h3" className="text-base/7 font-medium">
                        Variation {selectedVariationNumber}
                    </DialogTitle>
                    <p className="mt-2 text-sm/6">
                        {selectedVariationContent}
                    </p>
                    <div className="mt-4 flex gap-5 justify-end">
                        <Button
                        className="inline-flex items-center gap-2 rounded-md bg-white ring-1 ring-gray-400 px-3 py-1.5 text-sm/6 font-semibold text-black shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                        onClick={() => setIsBlogModalOpen(false)}
                        >
                        Cancel
                        </Button>
                        <Button
                        className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                        onClick={() => {setBody(selectedVariationContent); setIsBlogModalOpen(false)}}
                        >
                        Confirm
                        </Button>
                    </div>
                    </DialogPanel>
                </div>
                </div>
            </Dialog>

            {/* Image Modal */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
    
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto max-w-4xl w-full rounded bg-white shadow-lg overflow-hidden">
                <div className="p-2 flex justify-between items-center">
                    <h1 className="pl-10 text-xl">AI Generated Image Preview</h1>
                    <button onClick={() => setIsOpen(false)} className="mt-2 text-sm text-red-600 ring-1 ring-red-600/50 px-4 py-2 rounded-md hover:ring-0 hover:bg-red-600 hover:text-white duration-200 ease-linear">
                    Close
                    </button>
                </div>
                <img src={imgSrc2} alt="Generated" className="w-full h-auto object-contain" />
                </DialogPanel>
            </div>
            </Dialog>

        </div>
    </div>
  )
};

export default BlogForm;
