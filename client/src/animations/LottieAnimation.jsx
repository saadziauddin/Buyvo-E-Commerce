import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

const LottieAnimation = ({ animationData, loop = true, autoplay = true }) => {
  const animationContainer = useRef(null);

  useEffect(() => {
    const animationInstance = lottie.loadAnimation({
      container: animationContainer.current, // The container where the animation will render
      renderer: "svg", // Use SVG rendering for the animation
      loop, // Set loop behavior
      autoplay, // Enable autoplay
      animationData, // Pass the downloaded JSON file here
    });

    // Cleanup the animation instance when the component unmounts
    return () => {
      animationInstance.destroy();
    };
  }, [animationData, loop, autoplay]);

  return <div ref={animationContainer} style={{ width: "100%", height: "100%" }} />;
};

export default LottieAnimation;
