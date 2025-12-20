import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { Cog6ToothIcon } from '../../icons/Cog6ToothIcon';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { SiteSettings } from '../../../types';
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

const SiteSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient('/api/admin/site-settings');
      setSettings(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setSettings(prev => prev ? ({ ...prev, [name]: type === 'checkbox' ? checked : value }) : null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await apiClient('/api/admin/site-settings', {
        method: 'PUT',
        body: settings,
      });
      showToast('Site settings saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };
  
  if (isLoading || !settings) {
    return (
        <div className="flex items-center space-x-3">
            <Cog6ToothIcon className="w-8 h-8 text-rose-400 animate-spin" />
            <h1 className="text-3xl font-bold">Loading Site Settings...</h1>
        </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <Cog6ToothIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Site Settings</h1>
      </div>
      <p className="text-gray-300">
        Manage global settings: site title, logo, contact info, enable/disable modules, maintenance mode, payment gateway config, and upload meta details.
      </p>

      <form onSubmit={handleSubmit} className="bg-gray-700 p-6 rounded-lg shadow-xl space-y-6">
        {/* General Settings */}
        <fieldset className="border border-gray-600 p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-200 px-1 mb-2">General & Branding</legend>
            <Input type="text" id="siteTitle" name="siteTitle" label="Site Title" value={settings.siteTitle} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
            <Input type="text" id="platformLogoUrl" name="platformLogoUrl" label="Platform Logo URL" value={settings.platformLogoUrl || ''} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" placeholder="https://.../logo.png" />
            <Input type="text" id="faviconUrl" name="faviconUrl" label="Favicon URL" value={settings.faviconUrl || ''} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" placeholder="https://.../favicon.ico" />
            <Input type="text" id="ogImageUrl" name="ogImageUrl" label="Default OG Image URL (for social sharing)" value={settings.ogImageUrl || ''} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" placeholder="https://.../social-image.jpg"/>
            <Input type="email" id="contactEmail" name="contactEmail" label="Contact/Support Email" value={settings.contactEmail} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" />
            <Input type="tel" id="contactMobile" name="contactMobile" label="Contact/Support Mobile" value={settings.contactMobile || ''} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" />
        </fieldset>
        
        <fieldset className="border border-gray-600 p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-200 px-1 mb-2">Homepage & Default SEO</legend>
            <Input id="homepageBannerText" name="homepageBannerText" label="Homepage Banner Text" value={settings.homepageBannerText} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
            <Input id="homepageCtaText" name="homepageCtaText" label="Homepage CTA Button Text" value={settings.homepageCtaText} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" />
            <Input id="defaultMetaTitle" name="defaultMetaTitle" label="Default Meta Title" value={settings.defaultMetaTitle} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" />
            <div>
              <label htmlFor="defaultMetaDescription" className="block text-sm font-medium text-gray-400 mb-1 mt-3">App Meta Description (Default)</label>
              <textarea id="defaultMetaDescription" name="defaultMetaDescription" value={settings.defaultMetaDescription} onChange={handleInputChange} rows={2} className="block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2 text-white" placeholder="Default meta description for search engines..."></textarea>
            </div>
        </fieldset>

        {/* Feature Toggles */}
         <fieldset className="border border-gray-600 p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-200 px-1 mb-2">Enable/Disable Modules</legend>
            <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                {[
                    {name: 'horoscopeMatchingEnabled', label: 'Horoscope Matching Feature'},
                    {name: 'privatePhotosEnabled', label: 'Private Photo Galleries Feature'},
                    {name: 'blogModuleEnabled', label: 'Blog Module'},
                    {name: 'successStoryModuleEnabled', label: 'Success Story Module'},
                ].map(feature => (
                    <div key={feature.name} className="flex items-center">
                        <input type="checkbox" id={feature.name} name={feature.name} checked={(settings as any)[feature.name]} onChange={handleInputChange} className="h-4 w-4 text-rose-500 bg-gray-600 border-gray-500 rounded focus:ring-rose-500" />
                        <label htmlFor={feature.name} className="ml-2 text-sm text-gray-300">{feature.label}</label>
                    </div>
                ))}
            </div>
        </fieldset>

        {/* Payment Gateway Configuration */}
        <fieldset className="border border-gray-600 p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-200 px-1 mb-2">Payment Gateway Configuration (Mock)</legend>
             <Input type="text" id="paymentGatewayKey" name="paymentGatewayKey" label="Gateway Public Key" value={settings.paymentGatewayKey || ''} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" placeholder="pk_xxxxxxx"/>
            <Input type="password" id="paymentGatewaySecret" name="paymentGatewaySecret" label="Gateway Secret Key" value={settings.paymentGatewaySecret || ''} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" placeholder="rzp_xxxxxxx"/>
            <p className="text-xs text-gray-500 mt-2">Enter API keys for your chosen payment gateway (e.g., Razorpay, Stripe). Store secrets securely.</p>
        </fieldset>

        {/* Maintenance & Referral */}
        <fieldset className="border border-gray-600 p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-200 px-1 mb-2">Platform Management</legend>
            <div className="flex items-center">
                <input type="checkbox" id="maintenanceMode" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleInputChange} className="h-4 w-4 text-rose-500 bg-gray-600 border-gray-500 rounded focus:ring-rose-500" />
                <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-300">Enable Maintenance Mode</label>
            </div>
             <Input type="number" id="referralBonus" name="referralBonus" label="Referral Bonus Amount (₹)" value={String(settings.referralBonus)} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" placeholder="e.g. 200" />
        </fieldset>
        
        <div className="pt-2 text-right">
          <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600">Save Site Settings</Button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettingsView;