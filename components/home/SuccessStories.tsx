import React, { useState, useEffect } from 'react';
import { HeartIcon } from '../icons/HeartIcon';
import apiClient from '../../utils/apiClient';
import { useToast } from '../../hooks/useToast';

interface Story {
  id: string;
  coupleName: string;
  storySnippet: string;
  imageUrl: string;
  weddingDate?: string;
}

const StoryCard: React.FC<Story> = ({ coupleName, storySnippet, imageUrl, weddingDate }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
    <img src={imageUrl} alt={`Success story of ${coupleName}`} className="w-full h-56 object-cover" />
    <div className="p-6 flex flex-col flex-grow">
      <HeartIcon className="w-8 h-8 text-rose-400 mb-3" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{coupleName}</h3>
      {weddingDate && <p className="text-xs text-rose-500 font-medium mb-2 uppercase tracking-wider">{weddingDate}</p>}
      <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow">{storySnippet}</p>
      <a href="#" onClick={(e)=> e.preventDefault()} className="text-sm font-medium text-rose-600 hover:text-rose-500 self-start">
        Read Full Story &rarr;
      </a>
    </div>
  </div>
);

const SuccessStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await apiClient('/api/content/success-stories');
        const formattedData = data.map((story: any) => ({...story, id: story._id || story.id, storySnippet: story.storyText || story.storySnippet }));
        setStories(formattedData);
      } catch (err: any) {
        showToast(err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, [showToast]);

  return (
    <section id="success-stories" className="py-16 md:py-24 bg-rose-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-700 tracking-tight">
            Happy Couples, <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">Atut Stories</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Thousands have found their true love on Atut Bandhan. Read their beautiful journeys.
          </p>
        </div>
        
        {isLoading && <p className="text-center">Loading stories...</p>}
        {!isLoading && stories.length === 0 && <p className="text-center text-gray-500">Could not load success stories.</p>}

        {!isLoading && stories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SuccessStories;
