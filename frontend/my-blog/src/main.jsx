import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';
import BlogPosts from './components/BlogPosts.jsx';
import BlogForm from './components/BlogForm.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ImgUpload from './components/ImgUpload.jsx';
import SignUp from './pages/SignUp.jsx';
import Testing from './pages/Testing.jsx';
import SignIn from './pages/SignIn.jsx';
import ProtectedRoute from './context/ProtectedRoute.jsx';
import { AuthProvider } from "./context/AuthContext";
import { BlogProvider } from './context/BlogContext.jsx';

import App from './App.jsx'
import './index.css'
import BlogReaderPage from './pages/BlogReaderPage.jsx';
import About from './pages/About.jsx';
import UserProfile from './pages/UserProfile.jsx';
// import TextToSpeech from './pages/TextToSpeech.jsx';

const router = createBrowserRouter([
{
  path: '/',
  element: <App />,
  errorElement: <NotFoundPage />,
  children: [
    { index: true, element: <Home /> },
    { path: 'create-post', element: <BlogForm />},
    { path: 'image-upload', element: <ImgUpload />},
    { path: 'posts', element: <BlogPosts />},
    { path: 'posts/read', element: <BlogReaderPage />},
    { path: 'about', element: <About />},
    { path: 'profile', element: <UserProfile />},
    { path: 'signup', element: <SignUp />},
    { path: 'signin', element: <SignIn />},
    // { path: 'text-to-speech', element: <TextToSpeech/>},
    // { path: 'testing', element: <Testing/>},
    { 
      path: 'dashboard',
      element: <ProtectedRoute />,
      children: [
        { path: 'testing', element: <Testing />}
      ],
    }
  ]
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BlogProvider>
        <RouterProvider router={router} />
      </BlogProvider>
    </AuthProvider>
  </React.StrictMode>,
)
