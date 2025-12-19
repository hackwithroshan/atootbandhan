import React from 'react';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { LockClosedIcon } from '../icons/LockClosedIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col items-center text-center">
    <div className="mb-4 text-rose-500">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheckIcon className="w-12 h-12" />,
      title: 'Verified Profiles Only',
      description: 'Every profile is carefully reviewed to ensure authenticity and create a trustworthy community.',
    },
    {
      icon: <LockClosedIcon className="w-12 h-12" />,
      title: '100% Privacy Protected',
      description: 'Your personal information is secure. You control what you share and with whom.',
    },
    {
      icon: <SparklesIcon className="w-12 h-12" />,
      title: 'AI-Powered Matchmaking',
      description: 'Our smart algorithms help find compatible matches based on your preferences.',
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-12 h-12" />,
      title: 'Connect with Confidence',
      description: 'Unlock direct contact and chat features once mutual interest is established.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-rose-50 via-pink-50 to-red-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-700 tracking-tight">
            Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">Atut Bandhan</span>?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We are dedicated to helping you find your perfect life partner in a safe, secure, and supportive environment.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureItem
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;