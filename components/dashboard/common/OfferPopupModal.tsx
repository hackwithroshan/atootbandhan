import React from 'react';
import Button from '../../ui/Button';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { Offer } from '../../../types';

interface OfferPopupModalProps {
  offer: Offer;
  onClose: () => void;
}

const OfferPopupModal: React.FC<OfferPopupModalProps> = ({ offer, onClose }) => {
  const handleButtonClick = () => {
    if (offer.link.startsWith('http')) {
      window.open(offer.link, '_blank');
    } else {
      // This is a simplified navigation for mock purposes.
      // In a real SPA, you'd use history.push or router.navigate.
      window.location.hash = offer.link.startsWith('/') ? offer.link.substring(1) : offer.link;
      console.log(`Navigating to internal link: ${offer.link}`);
    }
    onClose(); // Close modal after button click
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="offerPopupTitle"
      onClick={onClose} 
    >
      <div 
        className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 p-6 rounded-xl shadow-2xl w-full max-w-md md:max-w-lg relative transform transition-all duration-300 ease-out scale-95 group-hover:scale-100"
        onClick={(e) => e.stopPropagation()} 
      >
        <Button 
          onClick={onClose} 
          variant="secondary" 
          size="sm"
          className="absolute top-3 right-3 !p-2 !rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 z-10"
          aria-label="Close offer"
        >
          <XMarkIcon className="w-5 h-5" />
        </Button>

        {offer.image && (
          <div className="mb-4 rounded-lg overflow-hidden shadow-md">
            <img src={offer.image} alt={offer.title} className="w-full h-auto max-h-52 md:max-h-60 object-contain" />
          </div>
        )}

        <div className="text-center">
          <h2 id="offerPopupTitle" className="text-2xl md:text-3xl font-bold text-rose-700 mb-2">
            {offer.title}
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-5 leading-relaxed">
            {offer.description}
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleButtonClick}
            className="!bg-gradient-to-r !from-rose-500 !to-pink-600 hover:!from-rose-600 hover:!to-pink-700 !shadow-lg !px-8 !py-3"
          >
            {offer.buttonText}
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            Offer valid from {new Date(offer.startDate + 'T00:00:00').toLocaleDateString()} to {new Date(offer.endDate + 'T00:00:00').toLocaleDateString()}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferPopupModal;