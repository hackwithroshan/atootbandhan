import React, {useState, useEffect, useCallback, FormEvent, ChangeEvent} from 'react';
import { DocumentTextIcon } from '../../icons/DocumentTextIcon';
import Button from '../../ui/Button';
import { CheckCircleIcon } from '../../icons/CheckCircleIcon';
import { PencilSquareIcon } from '../../icons/PencilSquareIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { useToast } from '../../../hooks/useToast';
import apiClient from '../../../utils/apiClient';
import { BlogPost, StaticPage } from '../../../types';

interface SiteSettings {
  homepageBannerText: string;
  homepageCtaText: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
}

interface SuccessStory {
  id: string;
  coupleName: string;
  submittedBy?: { fullName: string };
  createdAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  photoUrl: string;
  storyText: string;
  weddingDate?: string;
}

type ContentItem = (BlogPost & { type: 'Blog Post' }) | (StaticPage & { type: 'Static Page' });


const ContentManagementView: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    homepageBannerText: '', homepageCtaText: '', defaultMetaTitle: '', defaultMetaDescription: ''
  });
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState({ settings: true, content: true, stories: true });
  const { showToast } = useToast();
  
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Partial<ContentItem> | null>(null);
  
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Partial<SuccessStory> | null>(null);


  const fetchData = useCallback(async () => {
    try {
        setIsLoading({ settings: true, content: true, stories: true });
        const [settingsData, blogData, pageData, storyData] = await Promise.all([
            apiClient('/api/admin/site-settings'),
            apiClient('/api/admin/blog-posts'),
            apiClient('/api/admin/static-pages'),
            apiClient('/api/admin/success-stories')
        ]);
        setSiteSettings(settingsData);
        
        const blogs: ContentItem[] = blogData.map((p: BlogPost) => ({ ...p, type: 'Blog Post' }));
        const pages: ContentItem[] = pageData.map((p: StaticPage) => ({ ...p, type: 'Static Page' }));
        setContentItems([...blogs, ...pages]);
        
        setSuccessStories(storyData.map((s: any) => ({...s, photoUrl: s.imageUrl})));

    } catch (err: any) {
        showToast(err.message, 'error');
    } finally {
        setIsLoading({ settings: false, content: false, stories: false });
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSettingsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSiteSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveSettings = async () => {
    try {
      await apiClient('/api/admin/site-settings', { method: 'PUT', body: siteSettings });
      showToast('Homepage & SEO settings updated!', 'success');
    } catch(err: any) {
      showToast(err.message, 'error');
    }
  };

  const openContentModal = (item: Partial<ContentItem> | null = null) => {
    setEditingContent(item ? { ...item } : { type: 'Blog Post', title: '', content: '' }); // Default to creating a blog post
    setIsContentModalOpen(true);
  };
  
  const handleContentFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setEditingContent(prev => prev ? ({ ...prev, [name]: value }) : null);
  };
  
  const handleSaveContent = async () => {
      if (!editingContent) return;
      
      const isBlog = editingContent.type === 'Blog Post';
      const endpoint = isBlog ? '/api/admin/blog-posts' : '/api/admin/static-pages';
      const url = editingContent.id ? `${endpoint}/${editingContent.id}` : endpoint;
      const method = editingContent.id ? 'PUT' : 'POST';

      try {
          await apiClient(url, { method, body: editingContent });
          showToast(`Content ${editingContent.id ? 'updated' : 'created'} successfully!`, 'success');
          fetchData();
          setIsContentModalOpen(false);
          setEditingContent(null);
      } catch(err: any) {
          showToast(err.message, 'error');
      }
  };
  
  const openStoryModal = (story: SuccessStory) => {
    setEditingStory({ ...story });
    setIsStoryModalOpen(true);
  };
  
  const handleStoryFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setEditingStory(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleSaveStory = async () => {
    if (!editingStory || !editingStory.id) return;

    try {
        await apiClient(`/api/admin/success-stories/${editingStory.id}`, {
            method: 'PUT',
            body: {
                ...editingStory,
                imageUrl: editingStory.photoUrl // map back to backend field name
            }
        });
        showToast('Success story updated!', 'success');
        setIsStoryModalOpen(false);
        setEditingStory(null);
        fetchData(); // Refresh data
    } catch (err: any) {
        showToast(err.message, 'error');
    }
  };


  const handleStoryAction = async (story: SuccessStory, action: 'Approve' | 'Reject' | 'Delete' | 'Edit') => {
      if (action === 'Edit') {
        openStoryModal(story);
        return;
      }
      if (action === 'Delete') {
          if (!window.confirm(`Are you sure you want to permanently delete the story for ${story.coupleName}?`)) return;
          try {
              await apiClient(`/api/admin/success-stories/${story.id}`, { method: 'DELETE' });
              showToast('Story deleted.', 'info');
              fetchData();
          } catch(err: any) { showToast(err.message, 'error'); }
      } else if (action === 'Approve' || action === 'Reject') {
          const status = action === 'Approve' ? 'Approved' : 'Rejected';
          try {
              await apiClient(`/api/admin/success-stories/${story.id}`, { method: 'PUT', body: { status } });
              showToast(`Story status set to ${status}.`, 'success');
              fetchData();
          } catch(err: any) { showToast(err.message, 'error'); }
      }
  };


  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <DocumentTextIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Content Management</h1>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Homepage & Default SEO</h2>
        <div className="space-y-3">
            <Input id="homepageBannerText" name="homepageBannerText" label="Homepage Banner Text" value={siteSettings.homepageBannerText} onChange={handleSettingsChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
            <Input id="homepageCtaText" name="homepageCtaText" label="Homepage CTA Button Text" value={siteSettings.homepageCtaText} onChange={handleSettingsChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
            <Input id="defaultMetaTitle" name="defaultMetaTitle" label="Default Meta Title" value={siteSettings.defaultMetaTitle} onChange={handleSettingsChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
            <div>
                <label htmlFor="defaultMetaDescription" className="block text-sm font-medium text-gray-400 mb-1">Default Meta Description</label>
                <textarea id="defaultMetaDescription" name="defaultMetaDescription" rows={2} value={siteSettings.defaultMetaDescription} onChange={handleSettingsChange} className="block w-full bg-gray-600 border-gray-500 rounded-md p-2 text-white"></textarea>
            </div>
            <Button onClick={handleSaveSettings} variant="primary" className="!bg-blue-600 hover:!bg-blue-700">Update Settings</Button>
        </div>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Manage Content Pages & Blog</h2>
            <Button onClick={() => openContentModal()} variant="primary" className="!bg-green-600 hover:!bg-green-700">Add New</Button>
        </div>
        
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-750">
                <tr>
                {['Title', 'Type', 'Last Updated', 'Actions'].map(header => (
                    <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {header}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
                {isLoading.content ? <tr><td colSpan={4} className="text-center p-4">Loading content...</td></tr> : contentItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-650">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{item.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{item.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{new Date(item.updatedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <Button onClick={() => openContentModal(item)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-blue-600 hover:!bg-blue-700 !text-white">Edit</Button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Success Story Moderation</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-750">
                <tr>{['Couple', 'Submitted By', 'Date', 'Status', 'Actions'].map(h => (<th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">{h}</th>))}</tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
                {isLoading.stories ? <tr><td colSpan={5} className="text-center p-4">Loading stories...</td></tr> : successStories.map(story => (
                <tr key={story.id} className="hover:bg-gray-650">
                    <td className="px-4 py-3 text-sm text-white">{story.coupleName}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{story.submittedBy?.fullName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{new Date(story.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className={`px-2 inline-flex text-xs rounded-full ${story.status === 'Approved' ? 'bg-green-700 text-green-100' : (story.status === 'Pending' ? 'bg-yellow-700 text-yellow-100' : 'bg-red-700 text-red-100')}`}>{story.status}</span></td>
                    <td className="px-4 py-3 space-x-1">
                        {story.status === 'Pending' && <Button onClick={() => handleStoryAction(story, 'Approve')} size="sm" className="!text-xs !py-1 !px-2 !bg-green-600"><CheckCircleIcon className="w-4 h-4"/> Approve</Button>}
                        <Button onClick={() => handleStoryAction(story, 'Edit')} size="sm" className="!text-xs !py-1 !px-2 !bg-blue-600"><PencilSquareIcon className="w-4 h-4"/> Edit</Button>
                        <Button onClick={() => handleStoryAction(story, story.status === 'Pending' ? 'Reject' : 'Delete')} size="sm" variant="danger" className="!text-xs !py-1 !px-2 !bg-red-600"><TrashIcon className="w-4 h-4"/> {story.status === 'Pending' ? 'Reject' : 'Delete'}</Button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

       {isContentModalOpen && editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-5 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                 <h3 className="text-xl font-semibold mb-3">{editingContent.id ? 'Edit' : 'Create'} {editingContent.type}</h3>
                 <div className="overflow-y-auto pr-2 space-y-3 flex-grow custom-scrollbar">
                    {/* FIX: Added missing 'id' prop to Input component. */}
                    <Input id="content-title" label="Title" name="title" value={editingContent.title || ''} onChange={handleContentFormChange} className="[&_input]:bg-gray-700 [&_label]:text-gray-300" />
                    {editingContent.type === 'Blog Post' && (
                      <>
                        {/* FIX: Added missing 'id' prop to Input component. */}
                        <Input id="content-category" label="Category" name="category" value={(editingContent as BlogPost).category || ''} onChange={handleContentFormChange} className="[&_input]:bg-gray-700 [&_label]:text-gray-300" />
                        {/* FIX: Added missing 'id' prop to Input component. */}
                        <Input id="content-imageUrl" label="Image URL" name="imageUrl" value={(editingContent as BlogPost).imageUrl || ''} onChange={handleContentFormChange} className="[&_input]:bg-gray-700 [&_label]:text-gray-300" />
                        {/* FIX: Added missing 'id' prop to Input component. */}
                        <Input id="content-seoTags" label="SEO Tags (comma-separated)" name="seoTags" value={((editingContent as BlogPost).seoTags || []).join(', ')} onChange={(e) => handleContentFormChange({ target: { name: 'seoTags', value: e.target.value.split(',').map(s => s.trim()) } } as any)} className="[&_input]:bg-gray-700 [&_label]:text-gray-300" />
                        <label className="text-sm text-gray-300">Excerpt</label>
                        <textarea name="excerpt" value={(editingContent as BlogPost).excerpt || ''} onChange={handleContentFormChange} rows={3} className="w-full bg-gray-700 p-2 rounded border-gray-600"></textarea>
                      </>
                    )}
                    <label className="text-sm text-gray-300">Content (HTML/Markdown supported)</label>
                    <textarea name="content" value={editingContent.content || ''} onChange={handleContentFormChange} rows={10} className="w-full bg-gray-700 p-2 rounded border-gray-600 custom-scrollbar"></textarea>
                 </div>
                 <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-600">
                    <Button variant="secondary" onClick={() => setIsContentModalOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveContent} className="!bg-rose-500">Save Content</Button>
                 </div>
            </div>
        </div>
      )}

      {isStoryModalOpen && editingStory && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-5 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                 <h3 className="text-xl font-semibold mb-3">Edit Success Story</h3>
                 <div className="overflow-y-auto pr-2 space-y-3 flex-grow custom-scrollbar">
                    {/* FIX: Added missing 'id' prop to Input component. */}
                    <Input id="story-coupleName" label="Couple's Name" name="coupleName" value={editingStory.coupleName || ''} onChange={handleStoryFormChange} className="[&_input]:bg-gray-700 [&_label]:text-gray-300" />
                    {/* FIX: Added missing 'id' prop to Input component. */}
                    <Input id="story-photoUrl" label="Image URL" name="photoUrl" value={editingStory.photoUrl || ''} onChange={handleStoryFormChange} className="[&_input]:bg-gray-700 [&_label]:text-gray-300" />
                    {/* FIX: Added missing 'id' prop to Input component. */}
                    <Input id="story-weddingDate" label="Wedding Date" name="weddingDate" value={editingStory.weddingDate || ''} onChange={handleStoryFormChange} className="[&_input]:bg-gray-700 [&_label]:text-gray-300" />
                    {/* FIX: Added missing 'id' prop to Select component. */}
                    <Select
                        id="story-status"
                        label="Status"
                        name="status"
                        options={[{value: 'Pending', label: 'Pending'}, {value: 'Approved', label: 'Approved'}, {value: 'Rejected', label: 'Rejected'}]}
                        value={editingStory.status || 'Pending'}
                        onChange={handleStoryFormChange}
                        className="[&_select]:bg-gray-700 [&_label]:text-gray-300 [&_select]:text-white [&_select]:border-gray-500"
                    />
                    <label className="text-sm text-gray-300">Story Text</label>
                    <textarea name="storyText" value={editingStory.storyText || ''} onChange={handleStoryFormChange} rows={8} className="w-full bg-gray-700 p-2 rounded border-gray-600 custom-scrollbar"></textarea>
                 </div>
                 <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-600">
                    <Button variant="secondary" onClick={() => setIsStoryModalOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveStory} className="!bg-rose-500">Save Story</Button>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagementView;