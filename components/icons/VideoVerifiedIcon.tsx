import React from 'react';
import { CheckBadgeIcon } from './CheckBadgeIcon';

export const VideoVerifiedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <CheckBadgeIcon className="text-purple-600" {...props} />
);
