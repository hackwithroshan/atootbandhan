import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 9.75H11.25A3.375 3.375 0 007.5 13.5v4.5m3.75-6.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3.75 0h.008v.008h-.008V9.75zm3.75 0h.008v.008h-.008V9.75zm0 0a2.25 2.25 0 00-2.25 2.25v1.5H9V12A2.25 2.25 0 006.75 9.75H4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);