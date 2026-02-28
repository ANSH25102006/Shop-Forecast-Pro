import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/splash/SplashScreen";

const Index = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
    
    // Check if user has already registered or skipped
    const sellerRegistered = localStorage.getItem("seller_registered");
    
    if (sellerRegistered) {
      navigate("/dashboard");
    } else {
      navigate("/registration");
    }
  };

  return (
    <AnimatePresence>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
    </AnimatePresence>
  );
};

export default Index;
