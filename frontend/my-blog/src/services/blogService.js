import axios from 'axios';

// const API_URL =  `http://${import.meta.env.VITE_LOCAL_NETWORK}:8000/blogging`
const API_URL =  `http://localhost:8000/blogging`

export const getBlogs = async () => {
    // const response = await axios.get(`${API_URL}/blogs/`);
    const response = await axios.get(`${API_URL}/blogs/`);
    console.log('API')
    return response.data;
}

export const getBlog = async (id) => {
    const response = await axios.get(`${API_URL}/blogs/${id}`)
    return response.data;
}

export const createBlog = async (blog) => {
    const response = await axios.post(`${API_URL}/blogs/`, blog);
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
        return response.data;
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