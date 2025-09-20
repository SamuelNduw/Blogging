import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlobsBackground from "../components/BlobsBackground.jsx";
import HeroSection from "../components/HeroSection.jsx";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only decide after auth state is resolved
    if (!loading && isAuthenticated()) {
      navigate("/posts");
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="w-full pt-32 md:pt-16 relative">
      <BlobsBackground />
      <HeroSection />
    </div>
  );
};

export default Home;
