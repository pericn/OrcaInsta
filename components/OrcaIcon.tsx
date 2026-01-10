import React from 'react';

export const OrcaIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M20 55C20 55 25 35 50 35C75 35 90 50 90 65C90 80 70 85 60 85C50 85 45 80 45 80C45 80 40 85 30 85C20 85 10 75 10 65C10 55 20 55 20 55Z" 
      fill="#1E293B" 
    />
    <path 
      d="M35 65C35 65 38 60 45 60C52 60 55 65 55 65" 
      fill="white" 
    />
    <circle cx="25" cy="60" r="3" fill="white" />
    <path 
      d="M50 35C50 35 55 15 45 10C55 15 65 30 65 40" 
      fill="#1E293B" 
    />
    <path 
      d="M90 65C90 65 95 60 98 55C95 60 92 65 90 65Z" 
      fill="#1E293B" 
    />
  </svg>
);
