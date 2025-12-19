import React from 'react';

export const BeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 2.25c.091-.448.513-.75 1-.75s.909.302 1 .75c.091.448.513.75 1 .75s.909-.302 1-.75M19.5 5.25c0-1.141-.95-2.066-2.093-1.938A9.009 9.009 0 0013.5 3.75V15L6 21V5.25c0-1.141.95-2.066 2.093-1.938A9.009 9.009 0 0110.5 3.75v1.5c0 .552.448 1 1 1h1c.552 0 1-.448 1-1v-1.5c0-.986.685-1.812 1.594-1.979C16.991 3.098 18 3.963 18 5.013V15M6.75 12.75h4.5m-4.5 3h4.5m-3-6h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008z" />
  </svg>
);