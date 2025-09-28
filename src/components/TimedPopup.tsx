
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { popupService } from '@/services/database';

interface PopupData {
  enabled: boolean;
  title: string;
  message: string;
  button_text: string;
  button_url: string;
  image: string;
  delay: number;
}

const TimedPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [popupData, setPopupData] = useState<PopupData>({
    enabled: true,
    title: "INTERNATIONAL YOGA DAY",
    message: "NATIONAL YOGASANA CHAMPIONSHIP, INDIAN YOGA FEDERATION - 4TH RANK\n\nMind-Body Harmony\n\n• Yoga builds strength and calms the mind, reducing stress.\n\n• Flexibility & Strength\n- Enhances mobility, posture, and prevents injuries.\n\n• Breathe Better, Live Better\n- Boosts lung capacity and heart health through pranayama.\n\n• Detox & Immunity\n- Aids digestion, flushes toxins, and strengthens immunity.\n\n• Sharper Focus & Better Sleep\n- Improves concentration, sleep, and daily energy.",
    button_text: "Join us",
    button_url: "https://wa.me/919840382848?text=Hi! I would like to join NATIONAL YOGASANA CHAMPIONSHIP",
    image: "https://i.postimg.cc/vBRYzYK8/popup1.webp",
    delay: 5000
  });

  useEffect(() => {
    // Load popup data from database
    const loadPopupData = async () => {
      try {
        const data = await popupService.get();
        setPopupData({
          enabled: data.enabled,
          title: data.title,
          message: data.message,
          button_text: data.button_text,
          button_url: data.button_url,
          image: data.image || '',
          delay: data.delay
        });
      } catch (error) {
        console.error('TimedPopup: Error loading popup data:', error);
        // Keep default values if error occurs
      }
    };

    loadPopupData();
  }, []);

  useEffect(() => {
    if (!popupData.enabled) return;

    // For testing, clear the session storage flag
    // sessionStorage.removeItem('popupShown');

    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('popupShown');
    if (popupShown) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem('popupShown', 'true');
    }, popupData.delay);

    return () => clearTimeout(timer);
  }, [popupData.enabled, popupData.delay]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleButtonClick = () => {
    if (popupData.button_url.startsWith('http')) {
      window.open(popupData.button_url, '_blank');
    } else {
      window.location.href = popupData.button_url;
    }
    setIsVisible(false);
  };

  if (!isVisible || !popupData.enabled) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" onClick={handleClose} />
      
      {/* Popup */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
          >
            <X size={16} className="text-gray-600" />
          </button>

          {/* Image Section */}
          {popupData.image && (
            <div className="relative h-64 overflow-hidden">
              <img 
                src={popupData.image} 
                alt="Popup" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-yoga-forest leading-tight">
              {popupData.title}
            </h3>
            
            <div className="text-gray-600 leading-relaxed text-sm max-h-60 overflow-y-auto">
              {popupData.message.split('\n').map((line, index) => (
                <div key={index} className={line.trim() === '' ? 'mb-2' : 'mb-1'}>
                  {line.trim() === '' ? <br /> : line}
                </div>
              ))}
            </div>

            <Button 
              onClick={handleButtonClick}
              className="w-full bg-yoga-sage hover:bg-yoga-forest text-white py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
            >
              {popupData.button_text}
            </Button>

            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 pt-2">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Trusted by 1000+</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>15+ Years Experience</span>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default TimedPopup;
