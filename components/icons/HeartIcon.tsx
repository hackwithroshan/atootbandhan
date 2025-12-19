import React from 'react';

export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5S12 5.765 12 8.25c0 2.485-2.015 4.5-4.5 4.5S3 10.735 3 8.25c0-2.485 2.015-4.5 4.5-4.5S12 5.765 12 8.25zM12 21.75l-1.96-1.821C5.076 15.54 3 12.686 3 9.75A4.5 4.5 0 017.5 5.25c1.707 0 3.293.813 4.5 2.085A4.482 4.482 0 0116.5 5.25a4.5 4.5 0 0121 9.75c0 2.936-2.076 5.79-7.04 10.179L12 21.75z" />
  </svg>
);