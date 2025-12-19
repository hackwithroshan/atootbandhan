import React from 'react';
import { UserPlusIcon } from '../icons/UserPlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { HeartIcon } from '../icons/HeartIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';

interface StepItemProps {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; // More specific type
  title: string;
  description: string;
  stepNumber: string;
}

const StepItem: React.FC<StepItemProps> = ({ icon, title, description, stepNumber }) => (
  <div className="relative p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="absolute -top-5 -left-3 w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
      {stepNumber}
    </div>
    <div className="text-rose-500 mb-4 mt-5 text-center">
      {React.cloneElement(icon, { className: "w-12 h-12 mx-auto" })}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{title}</h3>
    <p className="text-sm text-gray-600 text-center leading-relaxed">{description}</p>
  </div>
);

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <UserPlusIcon />,
      title: 'Create Your Profile',
      description: 'Sign up for free and build your detailed profile. Add photos and preferences to get noticed.',
      stepNumber: '1'
    },
    {
      icon: <SearchIcon />,
      title: 'Search & Discover',
      description: 'Use our advanced search filters to find profiles that match your criteria or browse suggestions.',
      stepNumber: '2'
    },
    {
      icon: <HeartIcon />,
      title: 'Express Interest',
      description: 'Show your interest in profiles you like. If the interest is mutual, you can take the next step.',
      stepNumber: '3'
    },
    {
      icon: <ChatBubbleLeftRightIcon />,
      title: 'Connect & Communicate',
      description: 'Once interest is accepted, start conversations through our secure messaging platform.',
      stepNumber: '4'
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-br from-pink-50 to-red-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-700 tracking-tight">
            How <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">Atut Bandhan</span> Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Finding your life partner is simple and straightforward with our easy-to-follow process.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {steps.map((step) => (
            <StepItem
              key={step.title}
              icon={step.icon}
              title={step.title}
              description={step.description}
              stepNumber={step.stepNumber}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;