import React from 'react';

const PedaleiLogo = ({ width = 200, height = 60, simplified = false }) => {
  if (simplified) {
    return (
      <svg width={width} height={height} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <circle cx="16" cy="16" r="16" fill="#3498db"/>
        
        {/* Simplified bicycle icon */}
        <g stroke="white" strokeWidth="1.5" fill="none">
          {/* Wheels */}
          <circle cx="10" cy="20" r="4"/>
          <circle cx="22" cy="20" r="4"/>
          {/* Frame */}
          <path d="M10 20 L16 12 L22 20 M16 12 L18 14"/>
          {/* Seat */}
          <line x1="14.5" y1="12" x2="17.5" y2="12" strokeWidth="2" strokeLinecap="round"/>
        </g>
        
        {/* Location pin */}
        <path d="M16 6 C14 6 12 8 12 10 C12 12 16 16 16 16 S20 12 20 10 C20 8 18 6 16 6 Z" fill="#e74c3c"/>
        <circle cx="16" cy="10" r="1.5" fill="white"/>
      </svg>
    );
  }

  return (
    <svg width={width} height={height} viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle for the bike icon */}
      <circle cx="25" cy="30" r="20" fill="#3498db" opacity="0.1"/>
      
      {/* Bicycle icon */}
      <g stroke="#3498db" strokeWidth="2" fill="none">
        {/* Left wheel */}
        <circle cx="15" cy="35" r="8"/>
        {/* Right wheel */}
        <circle cx="35" cy="35" r="8"/>
        {/* Frame */}
        <path d="M15 35 L25 20 L35 35 M25 20 L30 25 M25 25 L35 35"/>
        {/* Seat */}
        <line x1="22" y1="20" x2="28" y2="20" strokeWidth="3" strokeLinecap="round"/>
        {/* Pedal */}
        <circle cx="25" cy="30" r="2" fill="#3498db"/>
      </g>
      
      {/* Location pin integrated with bike */}
      <path d="M25 12 C21 12 18 15 18 18.5 C18 22 25 28 25 28 S32 22 32 18.5 C32 15 29 12 25 12 Z" fill="#e74c3c"/>
      <circle cx="25" cy="18.5" r="2" fill="white"/>
      
      {/* Text */}
      <text x="55" y="25" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#2c3e50">Pedalei</text>
      <text x="55" y="42" fontFamily="Arial, sans-serif" fontSize="12" fill="#7f8c8d">Navigate • Cycle • Explore</text>
    </svg>
  );
};

export default PedaleiLogo;