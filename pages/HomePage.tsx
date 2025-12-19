import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/home/HeroSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import FeaturedProfiles from '../components/home/FeaturedProfiles';
import HowItWorks from '../components/home/HowItWorks';
import UpgradePlansTeaser from '../components/home/UpgradePlansTeaser';
import SuccessStories from '../components/home/SuccessStories';
import BlogPreview from '../components/home/BlogPreview';
import DownloadApp from '../components/home/DownloadApp';
import FinalCTA from '../components/home/FinalCTA';

interface HomePageProps {
  onLoginSignupClick: () => void;
  onAdminLoginClick: () => void; // New prop for admin login
}

const HomePage: React.FC<HomePageProps> = ({ onLoginSignupClick, onAdminLoginClick }) => {
  return (
    <div className="w-full">
      <Header onLoginSignupClick={onLoginSignupClick} />
      <main>
        <HeroSection onJoinNowClick={onLoginSignupClick} onBrowseMatchesClick={onLoginSignupClick} />
        <WhyChooseUs />
        <FeaturedProfiles onViewProfileClick={onLoginSignupClick} />
        <HowItWorks />
        <UpgradePlansTeaser onViewPlansClick={onLoginSignupClick} />
        <SuccessStories />
        <BlogPreview />
        <DownloadApp />
        <FinalCTA onRegisterClick={onLoginSignupClick} />
      </main>
    </div>
  );
};

export default HomePage;