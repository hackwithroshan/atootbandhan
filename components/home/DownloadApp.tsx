import React from 'react';
// Placeholder for App Store / Play Store icons if you have them.
// import { AppleIcon } from '../icons/AppleIcon'; // Re-using, though specific store icons are better
// import { GooglePlayIcon } from '../icons/GooglePlayIcon'; // Needs to be created if doesn't exist

const DownloadApp: React.FC = () => {
  return (
    <section id="download-app" className="py-16 md:py-24 bg-rose-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left Side: Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Find Love, <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-400">On The Go!</span>
            </h2>
            <p className="text-lg text-rose-100 mb-8">
              Download the Atut Bandhan app to stay connected, receive instant match notifications, and manage your profile anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#" onClick={(e)=>e.preventDefault()}
                className="bg-black text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
              >
                {/* <AppleIcon className="w-6 h-6" /> */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18.804 15.018c-.005.008-.005.012 0 .023-.747 2.179-2.31 4.14-4.226 4.14-1.298 0-2.32-.748-3.529-.771-.084 0-.144-.004-.219-.004-1.282 0-2.58.833-3.606.833-1.895 0-3.669-1.89-4.227-4.469-.023-.102-.03-.21-.03-.314 0-3.328 2.502-5.021 4.603-5.021 1.346 0 2.457.771 3.498.771.125 0 .237-.008.347-.008 1.011 0 2.256-.862 3.738-.862 1.933.008 3.633 1.907 3.655 4.675zm-3.084-6.495c.952-.999.805-2.614-.306-3.488-.992-.767-2.438-.601-3.4.426-.879.92-.879 2.553.201 3.488 1.05.912 2.553.763 3.505-.426z" /></svg>
                <div>
                  <span className="text-xs">Download on the</span>
                  <span className="block text-lg font-semibold">App Store</span>
                </div>
              </a>
              <a
                href="#" onClick={(e)=>e.preventDefault()}
                className="bg-black text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
              >
                {/* Placeholder for Google Play Icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3 20.517V3.483A1.5 1.5 0 0 1 4.5 2h1.065a1.5 1.5 0 0 1 1.385.84L10.385 9H20.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H10.385l-3.435 6.177a1.5 1.5 0 0 1-1.385.84H4.5a1.5 1.5 0 0 1-1.5-1.5zM7.76 17l2.386-4.294.002-.002L7.76 8.41V17zm7.75-1.5h3.24a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75h-3.24l-2.084 3.75 2.084 3.75z" fill="#4CAF50"/><path d="M14.5 9H20.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H14.5l-2.5-4.5 2.5-4.5z" fill="#000000" opacity="0.2"/></svg>
                <div>
                  <span className="text-xs">GET IT ON</span>
                  <span className="block text-lg font-semibold">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Side: App Mockup Image (Placeholder) */}
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://via.placeholder.com/350x450/FFFFFF/CCCCCC?Text=App+Mockup" 
              alt="Atut Bandhan App Mockup" 
              className="rounded-lg shadow-2xl max-w-xs md:max-w-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;