import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react"
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import BlobsBackground from "../components/BlobsBackground.jsx";
import { useAuth } from "../context/AuthContext.js";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, loading } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // If user is already authenticated, bounce to profile
  useEffect(() => {
    if (!loading && isAuthenticated()) {
      navigate("/profile"); // change if your route is different
    }
  }, [loading, isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await signIn(username, password);
      if (error) {
        toast.error(error.message || "Invalid credentials.");
        return;
      }
      toast.success("Successfully logged in.");
      navigate("/profile"); // change if your route is different
    } catch (err: any) { // Catching as 'any' for now, can be more specific if needed
      console.error("Login failed:", err);
      toast.error("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Optional: Prevent flashing the form while auth state is resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <Toaster position="top-center" />
        <BlobsBackground />

        {/* Main Card */}
        <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to your account to continue writing</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-200 bg-white/80"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} // Added ChangeEvent type
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-200 bg-white/80"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} // Added ChangeEvent type
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 transform hover:scale-[1.02]"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in to your account"}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200">
                  Create one here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
