import React, { useState } from 'react';
import Button from '../../ui/Button';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { ChatBubbleOvalLeftEllipsisIcon } from '../../icons/ChatBubbleOvalLeftEllipsisIcon';

const IcebreakerWidget: React.FC = () => {
  const icebreakers = [
    "Hi [Name], I noticed we both share an interest in [Hobby]. That's fascinating!",
    "Your profile really stood out! I'd love to learn more about your passion for [Interest].",
    "Hello [Name]! We seem to have a similar taste in [Music/Movies]. What's your favorite?",
    "I was intrigued by your [Profession/Education]. What do you enjoy most about it?",
  ];
  const [currentIcebreaker, setCurrentIcebreaker] = useState(icebreakers[0]);

  const getNewSuggestion = () => {
    const randomIndex = Math.floor(Math.random() * icebreakers.length);
    setCurrentIcebreaker(icebreakers[randomIndex]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
        <SparklesIcon className="w-6 h-6 text-purple-500 mr-2" />
        AI Icebreaker Suggestions
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Stuck on what to say? Let AI help you start a meaningful conversation!
      </p>
      
      <div className="bg-rose-50 p-4 rounded-md mb-4 border border-rose-200">
        <div className="flex items-start">
          <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 text-rose-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700 italic">
            "{currentIcebreaker.replace('[Name]', 'their name').replace('[Hobby]', 'common hobby').replace('[Interest]', 'their interest').replace('[Music/Movies]', 'music/movies').replace('[Profession/Education]', 'their profession/education')}"
          </p>
        </div>
      </div>
      
      <Button 
        variant="secondary" 
        onClick={getNewSuggestion} 
        className="w-full !text-rose-600 hover:!bg-rose-100"
      >
        <SparklesIcon className="w-5 h-5 mr-2" />
        Get Another Suggestion
      </Button>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Tailor these suggestions to make them your own!
      </p>
    </div>
  );
};

export default IcebreakerWidget;