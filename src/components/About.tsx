
import React, { useState, useEffect } from 'react';
import { Heart, Leaf, Sun, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const [sectionImage, setSectionImage] = useState('https://i.postimg.cc/ZnnS7KY3/Whats-App-Image-2025-06-06-at-11-19-59-PM.jpg');

  useEffect(() => {
    const storedContent = localStorage.getItem('aboutSectionContent');
    if (storedContent) {
      const content = JSON.parse(storedContent);
      setSectionImage(content.sectionImage);
    }
  }, []);

  const features = [
    {
      icon: Heart,
      title: 'Mindful Practice',
      description: 'Connect with your inner self through mindful yoga practices rooted in ancient traditions.'
    },
    {
      icon: Leaf,
      title: 'Natural Healing',
      description: 'Experience holistic healing that nurtures your body and mind naturally.'
    },
    {
      icon: Sun,
      title: 'Energy Balance',
      description: 'Restore your energy flow and find perfect balance in all aspects of life.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join a supportive community of like-minded individuals on their wellness journey.'
    }
  ];

  const handleReadMore = () => {
    navigate('/about');
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-yoga-cream to-yoga-sand">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-yoga-forest mb-6">About Shakti Yoga Raai</h2>
          <p className="text-xl text-yoga-forest/80 max-w-3xl mx-auto leading-relaxed">
            For over 15 years, we've been guiding students on transformative journeys through authentic yoga practices, 
            meditation, and holistic wellness approaches rooted in ancient wisdom.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-yoga-forest">
                Our Philosophy
              </h3>
              <p className="text-lg text-yoga-forest/80 leading-relaxed">
                At Shakti Yoga Raai, we believe that yoga is not just a practice—it's a way of life. 
                Our approach combines traditional Hatha, Vinyasa, and Ashtanga yoga with modern wellness techniques 
                to create a holistic experience that transforms lives.
              </p>
              <p className="text-lg text-yoga-forest/80 leading-relaxed">
                Every class is designed to honor the sacred tradition of yoga while making it accessible 
                to practitioners of all levels. We create a safe, nurturing environment where you can 
                explore your potential and discover your inner strength.
              </p>
              
              {/* Read More Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleReadMore}
                  className="bg-yoga-sage hover:bg-yoga-forest text-white px-8 py-3 rounded-full"
                >
                  Read More
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="p-6 bg-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-yoga-sage/20 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="text-yoga-sage" size={24} />
                  </div>
                  <h4 className="text-xl font-semibold text-yoga-forest mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-yoga-forest/70">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative">
              {/* Main Image */}
              <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={sectionImage} 
                  alt="Yoga practice and meditation" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://i.postimg.cc/ZnnS7KY3/Whats-App-Image-2025-06-06-at-11-19-59-PM.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-yoga-forest/20 to-transparent"></div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-yoga-terracotta/20 rounded-full"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-yoga-sage/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
