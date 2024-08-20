import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';
import BlogPosts from './components/BlogPosts.jsx';
import BlogForm from './components/BlogForm.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ImgUpload from './components/ImgUpload.jsx';

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
    { path: 'posts', element: <BlogPosts />}
  ]
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
