
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedClasses = () => {
  const featuredClasses = [{
    id: 1,
    name: "3-Month Personal Yoga",
    description: "Embark on a 3 Month transformational path tailored just for you. One-on-one guidance. Deep spiritual discipline. Visible physical and inner growth. Whether you're beginning or deepening your journey — this sacred space is designed to support your unique rhythm.",
    duration: "60 min",
    level: "All Levels",
    students: "15+",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    price: "₹43,200"
  }, {
    id: 2,
    name: "12 Days Class",
    description: "Intensive 12-day program designed to accelerate your yoga practice and deepen your understanding of ancient techniques through daily sessions and personalized guidance.",
    duration: "90 min",
    level: "Intermediate",
    students: "12+",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    price: "₹8,500"
  }];

  const handleWhatsAppContact = (className: string) => {
    const phoneNumber = "+918777816410";
    const message = `Hi! I'm interested in joining the ${className} class. Could you please provide more details about the schedule and enrollment?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-20 bg-yoga-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-yoga-forest mb-4">Featured Classes</h2>
          <p className="text-xl text-yoga-forest/80 max-w-3xl mx-auto">
            Discover our most popular yoga classes designed to nurture your mind, body, and spirit
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {featuredClasses.map((yogaClass) => (
            <Card key={yogaClass.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={yogaClass.image} 
                  alt={yogaClass.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-yoga-sage text-white px-3 py-1 rounded-full text-sm font-medium">
                  {yogaClass.price}
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-yoga-forest mb-3">{yogaClass.name}</h3>
                <p className="text-yoga-forest/70 mb-4 line-clamp-3">{yogaClass.description}</p>
                
                <div className="flex items-center justify-between text-sm text-yoga-forest/60 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{yogaClass.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{yogaClass.students}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp size={16} />
                    <span>{yogaClass.level}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleWhatsAppContact(yogaClass.name)}
                  className="w-full bg-yoga-sage hover:bg-yoga-forest text-white flex items-center justify-center space-x-2"
                >
                  <span>Join Class</span>
                  <ArrowRight size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedClasses;
