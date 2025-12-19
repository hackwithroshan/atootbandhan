
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { GlobeAltIcon } from '../icons/GlobeAltIcon';

interface HeaderProps {
  onLoginSignupClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginSignupClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#hero' }, // Assuming HeroSection has id="hero" or similar
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Browse Matches', href: '#featured-profiles' }, // Example: links to featured profiles
    { name: 'Upgrade', href: '#upgrade-plans' },
    { name: 'Blog', href: '#blog-preview' },
  ];

  const logoPath = 'https://res.cloudinary.com/dvrqft9ov/image/upload/v1761803466/atoot-bandhan-logo_g7kwqb.webp';

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-white/95 shadow-lg backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#hero" onClick={(e) => handleNavLinkClick(e, '#hero')} className="block">
              <img 
                src={logoPath} 
                alt="Atut Bandhan Logo" 
                className="h-10 md:h-12 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavLinkClick(e, item.href)}
                className={`text-sm font-medium transition-colors ${
                  isScrolled || isMobileMenuOpen ? 'text-gray-700 hover:text-rose-600' : 'text-gray-700 hover:text-rose-500'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm font-medium">
              <GlobeAltIcon className={`w-5 h-5 mr-1 ${isScrolled || isMobileMenuOpen ? 'text-gray-600' : 'text-gray-700'}`} />
              <span className={`${isScrolled || isMobileMenuOpen ? 'text-gray-600' : 'text-gray-700'}`}>EN</span>
              <span className={`mx-1 ${isScrolled || isMobileMenuOpen ? 'text-gray-400' : 'text-gray-500'}`}>|</span>
              <span className={`${isScrolled || isMobileMenuOpen ? 'text-gray-500 hover:text-rose-600' : 'text-gray-600 hover:text-rose-500'} cursor-pointer`}>हिंदी</span>
            </div>
            <Button 
              variant="primary" 
              size="md"
              onClick={onLoginSignupClick}
              className="!bg-rose-500 hover:!bg-rose-600 !text-white"
            >
              Login / Signup
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             <Button 
              variant="secondary" 
              size="sm"
              className={`${isScrolled || isMobileMenuOpen ? '!bg-gray-200 !text-gray-700' : '!bg-white/80 !text-rose-600'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white/95 shadow-lg py-4">
          <nav className="flex flex-col items-center space-y-4">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} onClick={(e) => handleNavLinkClick(e, item.href)} className="text-gray-700 hover:text-rose-600 font-medium">
                {item.name}
              </a>
            ))}
            <div className="flex items-center text-sm font-medium mt-4">
              <GlobeAltIcon className="w-5 h-5 mr-1 text-gray-600" />
              <span className="text-gray-600">EN</span>
              <span className="mx-1 text-gray-400">|</span>
              <span className="text-gray-500 hover:text-rose-600 cursor-pointer">हिंदी</span>
            </div>
            <Button 
              variant="primary" 
              size="md"
              onClick={() => { onLoginSignupClick(); setIsMobileMenuOpen(false); }}
              className="!bg-rose-500 hover:!bg-rose-600 !text-white w-3/4 mt-2"
            >
              Login / Signup
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;