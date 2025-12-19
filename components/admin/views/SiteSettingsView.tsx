import React, { useState } from 'react';
import { Cog6ToothIcon } from '../../icons/Cog6ToothIcon';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const SiteSettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    siteTitle: 'Atut Bandhan - Your Trusted Matrimony',
    platformLogo: null as File | null,
    favicon: null as File | null,
    ogImage: null as File | null, // New
    appMetaDetails: 'Find your perfect life partner with Atut Bandhan...', // New
    contactEmail: 'support@atutbandhan.com',
    contactMobile: '+91-9876543210',
    horoscopeMatchingEnabled: true,
    privatePhotosEnabled: true,
    blogModuleEnabled: true, // Example of granular module
    successStoryModuleEnabled: true, // Example
    paymentGatewayKey: 'pk_test_yourrazorpaykey', // Example
    paymentGatewaySecret: 'rzp_test_yoursecret', // Example
    maintenanceMode: false,
    referralBonus: '200',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setSettings(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setSettings(prev => ({...prev, [name]: null})); // Clear if no file selected
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Site settings saved (mock):', {
        ...settings, 
        platformLogo: settings.platformLogo?.name, // Log only name for brevity
        favicon: settings.favicon?.name,
        ogImage: settings.ogImage?.name,
    });
    alert('Mock: Site settings saved successfully!');
  };

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
            <Input type="file" id="platformLogo" name="platformLogo" label="Platform Logo (Max 2MB, .png, .svg)" onChange={handleFileChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" />
            {settings.platformLogo && <p className="text-xs text-green-400 mt-1">Selected: {settings.platformLogo.name}</p>}
            <Input type="file" id="favicon" name="favicon" label="Favicon (Max 500KB, .ico, .png)" onChange={handleFileChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" />
            {settings.favicon && <p className="text-xs text-green-400 mt-1">Selected: {settings.favicon.name}</p>}
            <Input type="file" id="ogImage" name="ogImage" label="Default OG Image (for social sharing)" onChange={handleFileChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" />
            {settings.ogImage && <p className="text-xs text-green-400 mt-1">Selected: {settings.ogImage.name}</p>}
            <div>
              <label htmlFor="appMetaDetails" className="block text-sm font-medium text-gray-400 mb-1 mt-3">App Meta Description (Default)</label>
              <textarea id="appMetaDetails" name="appMetaDetails" value={settings.appMetaDetails} onChange={handleInputChange} rows={2} className="block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2 text-white" placeholder="Default meta description for search engines..."></textarea>
            </div>
            <Input type="email" id="contactEmail" name="contactEmail" label="Contact/Support Email" value={settings.contactEmail} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" />
            <Input type="tel" id="contactMobile" name="contactMobile" label="Contact/Support Mobile" value={settings.contactMobile} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" />
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
                    // Add more modules as needed
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
             <Input type="text" id="paymentGatewayKey" name="paymentGatewayKey" label="Gateway Public Key" value={settings.paymentGatewayKey} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" placeholder="pk_xxxxxxx"/>
            <Input type="password" id="paymentGatewaySecret" name="paymentGatewaySecret" label="Gateway Secret Key" value={settings.paymentGatewaySecret} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" placeholder="rzp_xxxxxxx"/>
            <p className="text-xs text-gray-500 mt-2">Enter API keys for your chosen payment gateway (e.g., Razorpay, Stripe). Store secrets securely.</p>
        </fieldset>

        {/* Maintenance & Referral */}
        <fieldset className="border border-gray-600 p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-200 px-1 mb-2">Platform Management</legend>
            <div className="flex items-center">
                <input type="checkbox" id="maintenanceMode" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleInputChange} className="h-4 w-4 text-rose-500 bg-gray-600 border-gray-500 rounded focus:ring-rose-500" />
                <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-300">Enable Maintenance Mode</label>
            </div>
             <Input type="number" id="referralBonus" name="referralBonus" label="Referral Bonus Amount (₹)" value={settings.referralBonus} onChange={handleInputChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white mt-3" placeholder="e.g. 200" />
        </fieldset>
        
        <div className="pt-2 text-right">
          <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600">Save Site Settings</Button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettingsView;
