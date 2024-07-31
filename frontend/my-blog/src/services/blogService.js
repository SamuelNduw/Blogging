import axios from 'axios';

const API_URL = 'http://localhost:8000/blogging'

export const getBlogs = async () => {
    const response = await axios.get(`${API_URL}/blogs/`);
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