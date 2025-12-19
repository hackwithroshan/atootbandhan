import React from 'react';
import Button from '../ui/Button';

interface FinalCTAProps {
  onRegisterClick: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onRegisterClick }) => {
  return (
    <section id="final-cta" className="py-20 md:py-32 bg-gradient-to-br from-rose-500 via-pink-500 to-red-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Ready to Find Your Atut Bandhan?
        </h2>
        <p className="text-lg md:text-xl text-rose-100 max-w-xl mx-auto mb-10">
          Your journey towards a happy and fulfilling married life begins here. Join our community of genuine singles today.
        </p>
        <Button
          variant="secondary"
          size="lg"
          onClick={onRegisterClick}
          className="!text-xl !font-bold !px-12 !py-5 !bg-white !text-rose-600 hover:!bg-rose-50 transform hover:scale-105 shadow-2xl"
        >
          Register Now for Free
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;