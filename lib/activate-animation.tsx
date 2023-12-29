"use client"
import React, { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LottieAnimationProps {
  animationData: any;
  className?: string;
  onClick?: () => void;
  activate?: boolean;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationData, className, onClick,activate }) => {
  const [isEyeVisible, setIsEyeVisible] = useState(activate);
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
    setIsEyeVisible(!isEyeVisible);
    if (onClick) {
        onClick();
      }
  };

  useEffect(() => {
    if (animationInstance.current) {
      const direction = isEyeVisible ? -1 : 1;
      animationInstance.current.setDirection(direction);
      animationInstance.current.play();
    }
  }, [isEyeVisible]);

  return (
    <div 
      ref={animationContainer} 
      onClick={handleClick}
      className={className}
    />
  );
};

export default LottieAnimation;
