
import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21A2.5 2.5 0 0 1 8 20"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21A2.5 2.5 0 0 0 16 20"/>
        <path d="M18 4H6v10c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V4Z"/>
    </svg>
);
