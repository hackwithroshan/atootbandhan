import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { ChatBubbleOvalLeftEllipsisIcon } from '../../icons/ChatBubbleOvalLeftEllipsisIcon';

const defaultSuggestions = [
    "Hi [Name], I noticed we both share an interest in [Hobby]. That's fascinating!",
    "Your profile really stood out! I'd love to learn more about your passion for [Interest].",
    "Hello [Name]! We seem to have a similar taste in [Music/Movies]. What's your favorite?",
    "I was intrigued by your [Profession/Education]. What do you enjoy most about it?",
    "Your travel photos are amazing! What's been your most memorable trip so far?",
    "It's great to see someone who's also passionate about [Shared Value, e.g., family]. I'd love to hear your thoughts on it."
];

const IcebreakerWidget: React.FC = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSuggestions(defaultSuggestions);
    setCurrentIndex(0);
    setIsLoading(false);
  }, []);

  const getNewSuggestion = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
  };

  const currentIcebreaker = suggestions[currentIndex] || "Loading suggestion...";

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
        <SparklesIcon className="w-6 h-6 text-purple-500 mr-2" />
        Icebreaker Suggestions
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Stuck on what to say? Here are a few ideas to help you start a meaningful conversation!
      </p>
      
      <div className="bg-rose-50 p-4 rounded-md mb-4 border border-rose-200 min-h-[90px] flex items-center">
        {isLoading ? (
          <p className="text-sm text-gray-500 italic w-full text-center">Loading ideas...</p>
        ) : (
          <div className="flex items-start">
            <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 text-rose-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 italic">
              "{currentIcebreaker.replace(/\[([^\]]+)\]/g, (match, p1) => `their ${p1.toLowerCase()}`)}"
            </p>
          </div>
        )}
      </div>
      
      <Button 
        variant="secondary" 
        onClick={getNewSuggestion} 
        className="w-full !text-rose-600 hover:!bg-rose-100"
        disabled={isLoading}
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