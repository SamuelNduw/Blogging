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
import SignUp2 from './pages/SignUp2.jsx';
import ProtectedRoute from './context/ProtectedRoute.jsx';
import { AuthProvider } from "./context/AuthContext";

import App from './App.jsx'
import './index.css'

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
    { path: 'signup', element: <SignUp />},
    { path: 'signup2', element: <SignUp2 />},
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
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
