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

  const handleClick = () => {
    if (animationInstance.current) {
      animationInstance.current.goToAndPlay(0);
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      ref={animationContainer} 
      onClick={handleClick}
      className={className}
    />
  );
};

export default LottieAnimation;
