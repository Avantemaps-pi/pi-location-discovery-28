
import React from 'react';
import { Link } from 'react-router-dom';

interface AvanteMapLogoProps {
  size?: 'small' | 'medium' | 'large';
}

const AvanteMapLogo: React.FC<AvanteMapLogoProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-10 w-10'
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src="/lovable-uploads/Avante Maps icon.svg" 
        alt="Avante Maps Logo" 
        className={`${sizeClasses[size]}`}
      />
      <span className="font-semibold text-lg">Avante Maps</span>
    </Link>
  );
};

export default AvanteMapLogo;
