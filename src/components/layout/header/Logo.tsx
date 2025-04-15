
import React from 'react';
import { Link } from 'react-router-dom';
import { PiSquare } from 'lucide-react';

interface LogoProps {
  title?: string;
}

const Logo = ({ title = "Avante Maps" }: LogoProps) => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="bg-gradient-to-r from-avante-blue to-avante-purple p-2 rounded-md">
        <PiSquare className="h-5 w-5 text-white" />
      </div>
      <div className="hidden md:flex flex-col">
        <span className="font-bold text-lg bg-gradient-to-r from-avante-blue to-avante-purple bg-clip-text text-transparent">
          {title}
        </span>
        <span className="text-xs text-muted-foreground">Pi Payment Finder</span>
      </div>
      <span className="md:hidden font-bold text-lg">
        {title}
      </span>
    </Link>
  );
};

export default Logo;
