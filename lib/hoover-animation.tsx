"use client"
import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LottieAnimationProps {
  animationData: any;
  className?: string;
  onClick?: () => void;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationData, className, onClick }) => {
  const animationContainer = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<any>(null);

  useEffect(() => {
    animationInstance.current = lottie.loadAnimation({
      container: animationContainer.current!,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: animationData,
    });

    return () => animationInstance.current?.destroy();
  }, [animationData]);

  const handleMouseEnter = () => {
    animationInstance.current?.play();
  };

  const handleMouseLeave = () => {
    animationInstance.current?.stop();
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      ref={animationContainer} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      className={className}
      onClick={handleClick}
    />
  );
};

export default LottieAnimation;
