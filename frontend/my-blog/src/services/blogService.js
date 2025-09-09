import axios from 'axios';
import Cookies from 'js-cookie'

// const API_URL =  `http://${import.meta.env.VITE_LOCAL_NETWORK}:8000/blogging`
const API_URL =  `http://localhost:8000/blogging`

export const getBlogs = async () => {
    const response = await axios.get(`${API_URL}/blogs/get`);
    console.log('API')
    return response.data;
}

export const getBlog = async (id) => {
    const response = await axios.get(`${API_URL}/blogs/${id}`)
    return response.data;
}

export const getLatestBlogs = async () => {
    const response = await axios.get(`${API_URL}/blogs/get-latest`);
    return response;
}

export const createBlog = async (blog) => {
    const response = await axios.post(
        `${API_URL}/blogs/create`, 
        blog,
        {headers: {
            'Authorization': `Bearer ${Cookies.get('accessToken')}`
        }}
    );
    return response.data;
}

export const deleteBlogPost = async (blogID) =>{
    try{
        const response = await axios.delete(`${API_URL}/blogs/${blogID}/`);
        console.log('Blog deleted: ', response.data)
    } catch(e){
        console.error('Error deleting blog: ', error)
    }
}
export const updateBlogPost = async (blogID, updatedData) => {
    try{
        const response = await axios.put(`${API_URL}/blogs/${blogID}/`, updatedData);
        console.log('Blog updated: ', response.data);
    } catch(e){
        console.error('Error updating blog: ', e);
    }
}
export const registerUser = async (credentials) => {
    try{
        const response = await axios.post(`${API_URL}/register`, credentials);
        console.log(response.data)
        console.log(response.status)
        return response;
    } catch(e){
        console.error('Error registering user: ', e);
    }
}

export const getTokens = async (credentials) => {
    try{
        const response = await axios.post(`${API_URL}/api/token/`, credentials);
        return response;
    } catch(e){
        console.error('Error occured while getting tokens: ', e);
    }
}

export const tokenRefresh = async (credentials) => {
    try{
        const response = await axios.post(`${API_URL}/api/token/refresh`, credentials);
        return response.data;
    } catch(e){
        console.error('Error occurred while refreshing token: ', e);
    }
}

export const variationGeneration = async (blogInfo) => {
    try{
        const response = await axios.post(`http://${import.meta.env.VITE_LOCAL_NETWORK}:8000/ai/generate_blog_variations`, blogInfo);
        return response.data;
    } catch(e){
        console.error('Error occurred while generating blog variations: ', e);
    }
}

export const fetchImagePreview = async () => {
    try{
        const response = await axios.get(`${API_URL}/image`, {
            responseType: 'blob',
        });
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        return url;
    } catch(e){
        console.error('Error occurred while fetching image: ', e);
    }
}
export const imageGeneration = async (blogInfo) => {
    try{
        const response = await axios.post(`http://${import.meta.env.VITE_LOCAL_NETWORK}:8000/ai/generate_image`, 
            blogInfo,
            {
            responseType: 'blob',
            }
        );
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        return url;
    } catch(e){
        console.error('Error occurred while fetching image: ', e);
    }
}