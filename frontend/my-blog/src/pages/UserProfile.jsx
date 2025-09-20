import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import { useBlog } from '../context/BlogContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { setSelectedBlogRead } = useBlog();
  const { user, profile, isAuthenticated, authenticatedApiCall } = useAuth();
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/signup2');
      return;
    }

    // Fetch user profile data and blogs
    fetchUserData();
  }, [navigate, isAuthenticated]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch both profile data and user blogs in parallel
      const [profileResponse, blogsResponse] = await Promise.all([
        authenticatedApiCall('/user/profile/'),
        authenticatedApiCall('/blogs/user')
      ]);
      
      setProfileData(profileResponse);
      setUserBlogs(blogsResponse || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.message.includes('401') || error.message.includes('token')) {
        navigate('/signup2');
      }
      setUserBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blog) => {
    setSelectedBlogRead(blog);
    navigate('/posts/read');
  };

  const handleCreateNewPost = () => {
    navigate('/create-post');
  };

  if (loading) {
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
              {userBlogs.map((blog) => (
                <div key={blog.id} className="transform hover:scale-105 transition duration-200">
                  <BlogCard
                    title={blog.title}
                    author={blog.author}
                    body={blog.body}
                    image={blog.image_url}
                    createdAt={blog.created_at}
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