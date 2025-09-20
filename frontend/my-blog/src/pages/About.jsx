import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const About = () => {

    const { isAuthenticated, loading } = useAuth();
    const loggedIn = !loading && isAuthenticated();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern platform for sharing thoughts, ideas, and stories with the world.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                  We believe in the power of storytelling and the importance of giving everyone 
                  a voice. Our platform provides writers with the tools they need to craft 
                  compelling content and connect with readers around the globe.
                </p>
                <p className="text-gray-600">
                  Whether you're a seasoned blogger or just starting your writing journey, 
                  our platform offers an intuitive, user-friendly experience that lets you 
                  focus on what matters most: your content.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-lg font-semibold">Write. Share. Connect.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Features</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-500 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsive Design</h3>
                  <p className="text-gray-600">
                    Write and read seamlessly across all devices with our mobile-first approach.
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-500 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Authentication</h3>
                  <p className="text-gray-600">
                    Your content and data are protected with industry-standard security measures.
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-500 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Profiles</h3>
                  <p className="text-gray-600">
                    Create your personalized profile and manage all your posts in one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Writing?</h2>
              <p className="text-gray-600 mb-6">
                Join our community of writers and start sharing your stories today.
              </p>
              <div className="space-x-4">
                {!loggedIn && (
                    <Link
                    to="/signup2"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                    Get Started
                    </Link>
                )}
                <a
                  href="/posts"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  Explore Posts
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;