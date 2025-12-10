import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import BlogCard from '../components/BlogCard.js';
import { useBlog } from '../context/BlogContext.js';
import { stripHtml } from '../utils/stripHtml.js';

interface UserProfileData {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_joined: string; 
  is_staff: boolean;
  is_admin: boolean;
  blog_count: number;
}

interface UserBlog {
  id: number;
  title: string;
  author: string; 
  body: string;
  image_url: string;
  audio_url?: string;
  created_at: string; 
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { username: routeUsername } = useParams<{ username?: string }>();
  const { setSelectedBlogRead } = useBlog() as { setSelectedBlogRead: (blog: UserBlog) => void };
  const { user, profile, isAuthenticated, authenticatedApiCall, loading } = useAuth() as {
    user: any; 
    profile: UserProfileData; 
    loading: boolean;
    isAuthenticated: () => boolean;
    authenticatedApiCall: (url: string) => Promise<any>;
  };
  const [userBlogs, setUserBlogs] = useState<UserBlog[]>([]);
  const [loading2, setLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (loading) return;
    if (!isAuthenticated()) {
      navigate('/signup');
      return;
    }

    // Fetch user profile data and blogs
    fetchUserData(routeUsername);
  }, [loading, isAuthenticated, authenticatedApiCall, routeUsername]); // Added authenticatedApiCall and routeUsername to dependency array

  const fetchUserData = async (requestedUsername?: string) => {
    try {
      setLoading(true);
      
      // Fetch both profile data and user blogs in parallel
      const [profileResponse, blogsResponse] = await Promise.all([
        authenticatedApiCall('/user/profile/'),
        authenticatedApiCall('/blogs/user')
      ]);
      const typedProfile = profileResponse as UserProfileData; // Type assertion
      setProfileData(typedProfile);
      if (typedProfile?.username && typedProfile.username !== requestedUsername) {
        navigate(`/profile/${typedProfile.username}`, { replace: true });
      }
      setUserBlogs(blogsResponse as UserBlog[] || []); // Type assertion
    } catch (error: any) { // Catching as 'any' for now
      console.error('Error fetching user data:', error);
      if (error.message.includes('401') || error.message.includes('token')) {
        navigate('/signup');
      }
      setUserBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blog: UserBlog) => { 
    setSelectedBlogRead(blog);
    navigate('/posts/read');
  };

  const handleCreateNewPost = () => {
    navigate('/create-post');
  };

  if (loading2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {/* Avatar */}
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {profileData?.username ? profileData.username.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileData?.username || 'Loading...'}
                </h1>
                <p className="text-gray-600">{profileData?.email || 'Loading...'}</p>
                {profileData?.first_name || profileData?.last_name ? (
                  <p className="text-gray-600">
                    {profileData.first_name} {profileData.last_name}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  <span>
                    {userBlogs.length} {userBlogs.length === 1 ? 'post' : 'posts'} published
                  </span>
                  {profileData?.date_joined && (
                    <span>
                      Joined {new Date(profileData.date_joined).toLocaleDateString()}
                    </span>
                  )}
                  {profileData?.is_staff && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Staff
                    </span>
                  )}
                  {profileData?.is_admin && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Create New Post Button */}
            <button
              onClick={handleCreateNewPost}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 ease-in-out transform hover:scale-105"
            >
              Create New Post
            </button>
          </div>
        </div>

        {/* User's Blog Posts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Blog Posts</h2>
          
          {userBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">Start writing your first blog post to share your thoughts with the world.</p>
              <button
                onClick={handleCreateNewPost}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
              >
                Write Your First Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBlogs.map((blog: UserBlog) => ( 
                <div key={blog.id} className="transform hover:scale-105 transition duration-200">
                  <BlogCard
                    title={blog.title}
                    author={blog.author}
                    body={stripHtml(blog.body)}
                    image={blog.image_url}
                    profile={true}
                    // createdAt={blog.created_at}
                    onClick={() => handleBlogClick(blog)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
