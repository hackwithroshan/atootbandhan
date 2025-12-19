import React, { useState, useEffect } from 'react';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import apiClient from '../../utils/apiClient';
import { useToast } from '../../hooks/useToast';

interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
}

const BlogCard: React.FC<BlogPostPreview> = ({ title, excerpt, imageUrl, category, date }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
    <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <p className="text-xs text-rose-500 font-semibold uppercase mb-1">{category}</p>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-rose-600 transition-colors">{title}</h3>
      <p className="text-sm text-gray-600 mb-3 h-16 overflow-hidden">{excerpt}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</span>
        <a href="#" onClick={(e)=>e.preventDefault()} className="text-sm font-medium text-rose-600 hover:text-rose-500">
          Read More &rarr;
        </a>
      </div>
    </div>
  </div>
);

const BlogPreview: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiClient('/api/content/blog-posts/preview');
        const formattedData = data.map((post: any) => ({ ...post, id: post._id || post.id, date: post.createdAt || post.date }));
        setPosts(formattedData);
      } catch (err: any) {
        showToast(err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [showToast]);

  return (
    <section id="blog-preview" className="py-16 md:py-24 bg-gradient-to-br from-pink-50 to-red-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <DocumentTextIcon className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-700 tracking-tight">
            From Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">Blog</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Insights, advice, and stories to help you on your journey to find lasting love.
          </p>
        </div>

        {isLoading && <p className="text-center">Loading posts...</p>}
        {!isLoading && posts.length === 0 && <p className="text-center text-gray-500">Could not load recent blog posts.</p>}
        
        {!isLoading && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
                <BlogCard key={post.id} {...post} />
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default BlogPreview;
