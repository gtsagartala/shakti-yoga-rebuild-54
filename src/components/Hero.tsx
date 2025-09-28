
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Star, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Hero = () => {
  const [heroImage, setHeroImage] = useState('https://i.postimg.cc/ZnnS7KY3/Whats-App-Image-2025-06-06-at-11-19-59-PM.jpg');

  useEffect(() => {
    // Load hero image from localStorage on component mount
    // Check both heroImage and aboutContent (from admin panel)
    const storedHeroImage = localStorage.getItem('heroImage');
    const storedAboutContent = localStorage.getItem('aboutContent');
    
    if (storedAboutContent) {
      try {
        const aboutContent = JSON.parse(storedAboutContent);
        if (aboutContent.heroImage) {
          setHeroImage(aboutContent.heroImage);
        }
      } catch (error) {
        console.log('Error parsing aboutContent:', error);
      }
    } else if (storedHeroImage) {
      setHeroImage(storedHeroImage);
    }

    // Listen for storage changes to update hero image in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'heroImage' && e.newValue) {
        setHeroImage(e.newValue);
      } else if (e.key === 'aboutContent' && e.newValue) {
        try {
          const aboutContent = JSON.parse(e.newValue);
          if (aboutContent.heroImage) {
            setHeroImage(aboutContent.heroImage);
          }
        } catch (error) {
          console.log('Error parsing aboutContent from storage event:', error);
        }
      }
    };

    // Listen for custom events from admin panel
    const handleAdminImageUpdate = (event: CustomEvent) => {
      if (event.detail.heroImage) {
        setHeroImage(event.detail.heroImage);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('adminImageUpdate', handleAdminImageUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminImageUpdate', handleAdminImageUpdate as EventListener);
    };
  }, []);

  const handleWhatsAppContact = (message: string) => {
    const phoneNumber = "+918777816410";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yoga-cream via-yoga-sand to-yoga-sage/30"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-yoga-forest animate-float"></div>
        <div className="absolute bottom-40 right-32 w-24 h-24 rounded-full bg-yoga-terracotta animate-float" style={{
          animationDelay: '1s'
        }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-yoga-sage animate-float" style={{
          animationDelay: '2s'
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center space-x-2 text-yoga-terracotta">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-medium">Trusted by 1000+ Students</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-yoga-forest leading-tight">
              Find Your
              <span className="block text-yoga-terracotta">Inner Peace 🕉</span>
            </h1>

            <p className="text-xl text-yoga-forest/80 leading-relaxed max-w-2xl">
              Embark on a transformative journey with Shakti Yoga Raai. Experience authentic yoga practices, 
              meditation, and holistic wellness that nurtures your mind, body, and soul.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => handleWhatsAppContact("Hi! I'm interested in starting my yoga journey with Shakti Yoga Raai. Could you please provide more information about your classes and programs?")} 
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-full"
              >
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                className="border-yoga-forest text-yoga-forest hover:bg-yoga-forest hover:text-white px-8 py-4 text-lg rounded-full flex items-center space-x-2"
              >
                <Play size={20} />
                <span>Watch Introduction</span>
              </Button>
            </div>

            {/* Social Media Buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <span className="text-yoga-forest/70 font-medium">Follow us:</span>
              <div className="flex items-center space-x-3">
                <a href="https://www.facebook.com/raaikotha/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-yoga-sage/20 hover:bg-yoga-sage text-yoga-forest hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Facebook size={18} />
                </a>
                <a href="https://www.instagram.com/raaikotha/?hl=en" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-yoga-terracotta/20 hover:bg-yoga-terracotta text-yoga-forest hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Instagram size={18} />
                </a>
                <a href="https://twitter.com/raaikotha" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-yoga-forest/20 hover:bg-yoga-forest text-yoga-forest hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Twitter size={18} />
                </a>
                <a href="https://www.youtube.com/c/RaaiKotha" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-yoga-sage/20 hover:bg-yoga-sage text-yoga-forest hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-yoga-sage/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-yoga-terracotta">15+</div>
                <div className="text-sm text-yoga-forest/70">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yoga-terracotta">1000+</div>
                <div className="text-sm text-yoga-forest/70">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yoga-terracotta">50+</div>
                <div className="text-sm text-yoga-forest/70">Class Types</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in" style={{
            animationDelay: '0.3s'
          }}>
            <div className="relative">
              {/* Main Image with Yoga Background */}
              <div className="w-full h-[600px] rounded-3xl shadow-2xl overflow-hidden">
                <img 
                  src={heroImage} 
                  alt="Yoga meditation practice" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://i.postimg.cc/ZnnS7KY3/Whats-App-Image-2025-06-06-at-11-19-59-PM.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-yoga-forest/30 to-transparent"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center shadow-lg animate-float rounded-full bg-zinc-700">
                <span className="text-white text-2xl">☯</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yoga-cream border-4 border-yoga-sage rounded-full flex items-center justify-center shadow-lg animate-float" style={{
                animationDelay: '1.5s'
              }}>
                <span className="text-yoga-forest text-xl">🕉</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Book Session Button */}
      <div className="fixed right-6 bottom-6 z-40">
        <Button 
          onClick={() => handleWhatsAppContact("Hi! I would like to book a yoga session. Could you please help me with the available time slots and pricing?")} 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
        >
          <span className="font-medium">Book Session</span>
        </Button>
      </div>
    </section>
  );
};

const handleWhatsAppContact = (message: string) => {
  const phoneNumber = "+918777816410";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

export default Hero;
