import axios from 'axios';

// const API_URL =  `http://${import.meta.env.VITE_LOCAL_NETWORK}:8000/blogging`
const API_URL =  `http://localhost:8000/blogging`

interface Blog {
    title: string; 
    body: string; 
    image_url?: string
}
interface BlogVariationsInfo {
    title: string, 
    tone: string, 
    content: string
}

interface BlogImageInfo {
    title: string, 
    tone: string, 
    art_style: string
}

const apiClient = axios.create({
    baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers = config.headers || {};
        if (!config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});

export const getBlogs = async () => {
    const response = await apiClient.get(`/blogs/get`);
    console.log('API')
    return response.data;
}

export const getBlog = async (id: number) => {
    const response = await apiClient.get(`/blogs/${id}`)
    return response.data;
}

export const getLatestBlogs = async () => {
    const response = await apiClient.get(`/blogs/get-latest`);
    return response;
}

export const createBlog = async (blog: Blog) => {
    const response = await apiClient.post(`/blogs/create`, blog);
    return response.data;
}

export const uploadBlogImage = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
        `/blogs/upload-image/`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }
    )

    return response.data.url;
}

export const deleteBlogPost = async (blogID: number) =>{
    try{
        const response = await apiClient.delete(`/blogs/${blogID}/`);
        console.log('Blog deleted: ', response.data)
    } catch(e){
        console.error('Error deleting blog: ', e)
    }
}
export const updateBlogPost = async (blogID: number, updatedData: any) => {
    try{
        const response = await apiClient.put(`/blogs/${blogID}/`, updatedData);
        console.log('Blog updated: ', response.data);
    } catch(e){
        console.error('Error updating blog: ', e);
    }
}
export const registerUser = async (credentials: any) => {
    try{
        const response = await apiClient.post(`/register`, credentials);
        console.log(response.data)
        console.log(response.status)
        return response;
    } catch(e){
        console.error('Error registering user: ', e);
    }
}

export const getTokens = async (credentials: any) => {
    try{
        const response = await apiClient.post(`/api/token/`, credentials);
        return response;
    } catch(e){
        console.error('Error occured while getting tokens: ', e);
    }
}

export const tokenRefresh = async (credentials: string) => {
    try{
        const response = await apiClient.post(`/api/token/refresh`, credentials);
        return response.data;
    } catch(e){
        console.error('Error occurred while refreshing token: ', e);
    }
}

export const variationGeneration = async (blogInfo: BlogVariationsInfo) => {
    try{
        const response = await apiClient.post(`/ai/generate_blog_variations`, blogInfo);
        return response.data;
    } catch(e){
        console.error('Error occurred while generating blog variations: ', e);
    }
}

export const fetchImagePreview = async () => {
    try{
        const response = await apiClient.get(`/image`, {
            responseType: 'blob',
        });
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        return url;
    } catch(e){
        console.error('Error occurred while fetching image: ', e);
    }
}
export const imageGeneration = async (blogInfo: BlogImageInfo) => {
    try{
        const response = await apiClient.post(`/ai/generate_image`, 
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

export const getUserBlogs = async () => {
    try {
        const response = await apiClient.get(`/blogs/user`);
        return response.data;
    } catch(e) {
        console.error('Error fetching user blogs: ', e);
        return [];
    }
}
