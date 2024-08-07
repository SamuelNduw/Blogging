import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BlogPosts from './components/BlogPosts.jsx';
import BlogForm from './components/BlogForm.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import App from './App.jsx'
import './index.css'

const router = createBrowserRouter([
{
  path: '/',
  element: <App />,
  errorElement: <NotFoundPage />,
  children: [
    { index: true, element: <BlogPosts /> },
    { path: 'create-post', element: <BlogForm />}
  ]
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
