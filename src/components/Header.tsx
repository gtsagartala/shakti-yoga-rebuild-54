
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LoginDialog from './LoginDialog';
import UserMenu from './UserMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    role: string;
  } | null>(null);

  // Check for stored user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleWhatsAppContact = (message: string) => {
    const phoneNumber = "+918777816410";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLoginSuccess = (user: {
    username: string;
    role: string;
  }) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about-us' },
    { name: 'Classes', href: '/classes' },
    { name: 'Store', href: '/store' },
    { name: 'Articles', href: '/articles' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Instructors', href: '/instructors' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-yoga-cream/95 backdrop-blur-sm shadow-sm">
      {/* Top Bar */}
      <div className="border-b border-yoga-sage/20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm text-yoga-forest">
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone size={14} />
                <span className="text-xs lg:text-sm">+91 87778 16410</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} />
                <span className="text-xs lg:text-sm">info@shaktiyogaraai.com</span>
              </div>
            </div>
            <div className="hidden md:block text-yoga-terracotta font-medium text-xs lg:text-sm">
              Transform Your Mind, Body & Soul
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            <div className="w-8 h-8 lg:w-12 lg:h-12">
              <img src="/lovable-uploads/001a3e79-c253-4f0f-8842-ed9a57850b57.png" alt="Shakti Yoga Raai Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <Link to="/" className="text-lg lg:text-2xl font-bold text-yoga-forest hover:text-yoga-terracotta transition-colors">
                <span className="hidden sm:inline">Shakti Yoga Raai</span>
                <span className="sm:hidden">Shakti</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map(item => (
              <Link 
                key={item.name} 
                to={item.href} 
                className="text-yoga-forest hover:text-yoga-terracotta transition-colors duration-300 font-medium text-sm xl:text-base"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button, Login/User Menu & Mobile Menu */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Login/User Menu */}
            {currentUser ? <UserMenu user={currentUser} onLogout={handleLogout} /> : <LoginDialog onLoginSuccess={handleLoginSuccess} />}
            
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-yoga-forest hover:text-yoga-terracotta transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-yoga-sage/20">
            <div className="flex flex-col space-y-4">
              {navItems.map(item => (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className="text-yoga-forest hover:text-yoga-terracotta transition-colors duration-300 font-medium py-2" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button 
                onClick={() => {
                  handleWhatsAppContact("Hi! I would like to book a class at Shakti Yoga Raai. Could you please provide information about available classes and schedules?");
                  setIsMenuOpen(false);
                }} 
                className="mt-4 bg-yoga-sage hover:bg-yoga-forest text-white w-full"
              >
                Book a Class
              </Button>
              
              {/* Mobile Login/User Menu */}
              {currentUser ? (
                <div className="pt-4 border-t border-yoga-sage/20">
                  <UserMenu user={currentUser} onLogout={handleLogout} />
                </div>
              ) : (
                <div className="pt-4 border-t border-yoga-sage/20">
                  <LoginDialog onLoginSuccess={handleLoginSuccess} />
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
