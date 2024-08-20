import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';

const ImgUpload = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if(!file) return;

        const storageRef = ref(storage, `blogImages/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred /snapshot.totalBytes) * 100;
                setProgress(progress);
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.log("There was an error! Upload Failed!");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at: ', downloadURL);
                })
            }
        )
    }


  return (
      <>
        <div className='w-full h-screen flex flex-col items-center py-10 gap-5'>
            <input type="file" onChange={handleFileChange} />
            <div className='w-full flex justify-center'>
                <button onClick={handleUpload} className='font-bold text-xl px-4 py-2 rounded-md bg-indigo-500'>
                    Upload
                </button>
            </div>
            <p>Upload Progress: {progress}%</p>
        </div>
      </>
  );
};

export default ImgUpload;
