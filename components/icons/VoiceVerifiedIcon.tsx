import React from 'react';
import { CheckBadgeIcon } from './CheckBadgeIcon';

export const VoiceVerifiedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <CheckBadgeIcon className="text-blue-500" {...props} />
);
