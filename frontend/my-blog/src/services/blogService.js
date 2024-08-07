import axios from 'axios';

const API_URL = 'http://localhost:8000/blogging'

export const getBlogs = async () => {
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
        const response = await axios.delete(`http://localhost:8000/blogging/blogs/${blogID}/`);
        console.log('Blog deleted: ', response.data)
    } catch(e){
        console.error('Error deleting blog: ', error)
    }
}
export const updateBlogPost = async (blogID, updatedData) => {
    try{
        const response = await axios.put(`http://localhost:8000/blogging/blogs/${blogID}/`, updatedData);
        console.log('Blog updated: ', response.data);
    } catch(e){
        console.error('Error updating blog: ', e);
    }
}