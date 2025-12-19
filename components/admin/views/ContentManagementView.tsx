import React, {useState} from 'react';
import { DocumentTextIcon } from '../../icons/DocumentTextIcon';
import Button from '../../ui/Button';
import { CheckCircleIcon } from '../../icons/CheckCircleIcon';
import { PencilSquareIcon } from '../../icons/PencilSquareIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import Input from '../../ui/Input'; // Assuming Input component

const ContentManagementView: React.FC = () => {
  const contentPages = [
    { id: 'faq', title: 'FAQs Page', type: 'Static Page', lastUpdated: '2024-07-25', seoTags: 'FAQ, help, support' },
    { id: 'terms', title: 'Terms & Conditions', type: 'Static Page', lastUpdated: '2024-07-20', seoTags: 'terms, legal, conditions' },
    { id: 'privacy', title: 'Privacy Policy', type: 'Static Page', lastUpdated: '2024-07-20', seoTags: 'privacy, data, security' },
    { id: 'blog_001', title: 'Blog: 5 Tips for a Great First Date', type: 'Blog Post', category: 'Dating Tips', lastUpdated: '2024-07-28', seoTags: 'dating, first date, tips' },
    { id: 'blog_002', title: 'Blog: Understanding Compatibility', type: 'Blog Post', category: 'Relationships', lastUpdated: '2024-07-15', seoTags: 'compatibility, relationships, marriage' },
  ];

  const mockSuccessStories = [
    { id: 'story_001', coupleName: 'Rohan & Priya', submittedBy: 'usr_101', dateSubmitted: '2024-07-26', status: 'Pending', photoUrl: 'https://via.placeholder.com/80/90EE90/333333?Text=Couple', storyText: 'We met on Atut Bandhan and clicked instantly...' },
    { id: 'story_002', coupleName: 'Amit & Sneha', submittedBy: 'usr_105', dateSubmitted: '2024-07-20', status: 'Approved', photoUrl: 'https://via.placeholder.com/80/ADD8E6/333333?Text=Couple2', storyText: 'Thank you Atut Bandhan for helping us find each other!' },
  ];
  
  const [homepageBannerText, setHomepageBannerText] = useState('Find Your Perfect Match Today!');
  const [homepageCtaText, setHomepageCtaText] = useState('Join Free');
  const [metaTitle, setMetaTitle] = useState('Atut Bandhan - Matrimonial Site');
  const [metaDescription, setMetaDescription] = useState('Find your life partner on Atut Bandhan.');


  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <DocumentTextIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Content Management</h1>
      </div>
      <p className="text-gray-300">
        Manage FAQs, Terms & Privacy pages, blog posts (Title, Category, SEO Tags), matchmaking tips, testimonials (with images/videos), success stories, and homepage content.
      </p>

      {/* Homepage Banner & CTA Editor */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Homepage Banner & CTA Editor</h2>
        <div className="space-y-3">
            <Input id="homepageBannerText" name="homepageBannerText" label="Homepage Banner Text" value={homepageBannerText} onChange={e => setHomepageBannerText(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
            <Input id="homepageCtaText" name="homepageCtaText" label="Homepage CTA Button Text" value={homepageCtaText} onChange={e => setHomepageCtaText(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
            <Button onClick={() => alert("Homepage content updated (mock).")} variant="primary" className="!bg-blue-600 hover:!bg-blue-700">Update Homepage Content</Button>
        </div>
      </div>

      {/* Static Pages & Blog Management */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Manage Content Pages & Blog</h2>
            <Button onClick={() => alert("Add New Page/Post form would appear.")} variant="primary" className="!bg-green-600 hover:!bg-green-700">Add New Page/Post</Button>
        </div>
        
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-750">
                <tr>
                {['Page/Post Title', 'Type', 'Category', 'Last Updated', 'SEO Tags', 'Actions'].map(header => (
                    <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {header}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
                {contentPages.map(page => (
                <tr key={page.id} className="hover:bg-gray-650 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{page.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{page.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{page.type === 'Blog Post' ? (page as any).category : 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{page.lastUpdated}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 max-w-xs truncate" title={page.seoTags}>{page.seoTags}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <Button onClick={() => alert(`Editing content for ${page.title}`)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-blue-600 hover:!bg-blue-700 !text-white">Edit Content</Button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <p className="text-xs text-gray-500 mt-4">A rich text editor (WYSIWYG) for content, and fields for Category & SEO Tags for blogs will be integrated.</p>
      </div>

      {/* Meta Tag & SEO Field Editor per Page (Conceptual) */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Global / Default SEO Settings</h2>
        <div className="space-y-3">
            <Input id="metaTitle" name="metaTitle" label="Default Meta Title" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
            <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-400 mb-1">Default Meta Description</label>
                <textarea id="metaDescription" name="metaDescription" rows={2} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} className="block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2 text-white"></textarea>
            </div>
            <Button onClick={() => alert("Default SEO settings saved (mock). Per-page SEO editor would be part of page/blog edit screen.")} variant="primary" className="!bg-orange-600 hover:!bg-orange-700">Save Default SEO</Button>
        </div>
         <p className="text-xs text-gray-500 mt-2">This is for default SEO. Individual pages/blogs will have their own SEO fields.</p>
      </div>


      {/* Success Story & Testimonial Moderation */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Success Story / Testimonial Moderation</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-750">
                <tr>
                {['Couple Name', 'Submitted By', 'Date', 'Status', 'Photo', 'Story (Excerpt)', 'Actions'].map(header => (
                    <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {header}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
                {mockSuccessStories.map(story => (
                <tr key={story.id} className="hover:bg-gray-650 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{story.coupleName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{story.submittedBy}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{story.dateSubmitted}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            story.status === 'Approved' ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'
                        }`}>
                            {story.status}
                        </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <img src={story.photoUrl} alt={story.coupleName} className="w-10 h-10 rounded-md object-cover" />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate" title={story.storyText}>{story.storyText}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-1">
                        {story.status === 'Pending' && 
                            <Button onClick={() => alert(`Approving story for ${story.coupleName}`)} size="sm" variant="primary" className="!text-xs !py-1 !px-2 !bg-green-600 hover:!bg-green-700">
                                <CheckCircleIcon className="w-4 h-4 mr-1"/> Approve
                            </Button>
                        }
                        <Button onClick={() => alert(`Editing story for ${story.coupleName}`)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-blue-600 hover:!bg-blue-700 !text-white">
                            <PencilSquareIcon className="w-4 h-4 mr-1"/> Edit
                        </Button>
                        <Button onClick={() => alert(`${story.status === 'Pending' ? 'Rejecting' : 'Deleting'} story for ${story.coupleName}`)} size="sm" variant="danger" className="!text-xs !py-1 !px-2 !bg-red-600 hover:!bg-red-700">
                            <TrashIcon className="w-4 h-4 mr-1"/> {story.status === 'Pending' ? 'Reject' : 'Delete'}
                        </Button>
                    </td>
                </tr>
                ))}
                {mockSuccessStories.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-4 text-gray-400">No stories/testimonials pending moderation.</td></tr>
                )}
            </tbody>
            </table>
        </div>
        <p className="text-xs text-gray-500 mt-4">Users can submit stories with photos/videos. Admins approve, edit, and post them on homepage/blog.</p>
      </div>
    </div>
  );
};

export default ContentManagementView;
