
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, Users, Calendar, Star, Video, Wifi, Share2, Facebook, Instagram, Twitter, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnlineClass {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: string;
  duration: string;
  capacity: string;
  schedule: string;
  level: string;
  rating: number;
  features: string[];
  image: string;
  joinLink?: string;
  maxSeats?: number;
  availableSeats?: number;
}

const ClassesSection = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<OnlineClass[]>([]);

  const loadClassesData = () => {
    console.log('ClassesSection: Loading classes data...');
    const storedClasses = localStorage.getItem('onlineClasses');
    if (storedClasses) {
      try {
        const parsedClasses = JSON.parse(storedClasses);
        console.log('ClassesSection: Loaded classes from localStorage:', parsedClasses);
        setClasses(parsedClasses);
        return;
      } catch (error) {
        console.error('ClassesSection: Error parsing classes data:', error);
      }
    }
    
    // Only set default classes if no stored classes exist
    console.log('ClassesSection: No valid classes found, using defaults');
    const defaultClasses: OnlineClass[] = [
      {
        id: '1',
        title: '3-Month Personal Yoga',
        instructor: 'Raai Kotha',
        description: 'Embark on a 3 Month transformational path tailored just for you. One-on-one guidance. Deep spiritual discipline. Visible physical and inner growth. Whether you\'re beginning or deepening your journey — this sacred space is designed to support your unique rhythm.',
        price: '•For Indian Residents: ₹43,200 •For International Participants: $535',
        duration: '60 minutes',
        capacity: '15 students',
        schedule: 'Mon, Wed, Fri - 7:00 AM IST',
        level: 'All Levels',
        rating: 4.9,
        features: ['Live Interactive Session', 'Recorded for 7 days', 'Personal Feedback', 'Props Guidance'],
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        joinLink: 'https://meet.google.com/abc-def-ghi',
        maxSeats: 15,
        availableSeats: 12
      },
      {
        id: '2',
        title: 'Vinyasa Flow Evening',
        instructor: 'Sannidhya Krishna Das',
        description: 'Dynamic flowing sequences that build strength, flexibility, and mindfulness. Connect breath with movement in this energizing practice.',
        price: '₹1,500',
        duration: '75 minutes',
        capacity: '12 students',
        schedule: 'Tue, Thu, Sat - 6:30 PM IST',
        level: 'Intermediate',
        rating: 5.0,
        features: ['High-Energy Flow', 'Strength Building', 'Live Music', 'Community Chat'],
        image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        joinLink: 'https://meet.google.com/xyz-abc-def',
        maxSeats: 12,
        availableSeats: 8
      },
      {
        id: '3',
        title: 'Meditation & Pranayama',
        instructor: 'Shivam Misra',
        description: 'Deep meditation practice combined with ancient breathing techniques. Find inner peace and develop mindfulness in this transformative session.',
        price: '₹800',
        duration: '45 minutes',
        capacity: '20 students',
        schedule: 'Daily - 8:00 PM IST',
        level: 'All Levels',
        rating: 4.8,
        features: ['Guided Meditation', 'Breathing Techniques', 'Stress Relief', 'Sleep Better'],
        image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        joinLink: 'https://meet.google.com/meditation-123',
        maxSeats: 20,
        availableSeats: 15
      },
      {
        id: '4',
        title: 'Kundalini Awakening',
        instructor: 'Raai Kotha',
        description: 'Advanced practice focusing on energy awakening through specific poses, mantras, and breathing. Experience the transformative power of Kundalini.',
        price: '₹2,000',
        duration: '90 minutes',
        capacity: '8 students',
        schedule: 'Sunday - 9:00 AM IST',
        level: 'Advanced',
        rating: 5.0,
        features: ['Energy Work', 'Mantra Chanting', 'Chakra Balancing', 'Spiritual Guidance'],
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        joinLink: 'https://meet.google.com/kundalini-session',
        maxSeats: 8,
        availableSeats: 3
      }
    ];
    
    setClasses(defaultClasses);
    localStorage.setItem('onlineClasses', JSON.stringify(defaultClasses));
  };

  const handleWhatsAppJoin = (classTitle: string, price: string) => {
    const phoneNumber = "+918777816410";
    const message = `Hi! I would like to join the "${classTitle}" online class (${price}). Please provide me with joining details and payment information.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSocialShare = (platform: string, yogaClass: OnlineClass) => {
    const shareUrl = window.location.origin + '/classes';
    const shareText = `Check out this yoga class: ${yogaClass.title} with ${yogaClass.instructor}. ${yogaClass.description} Price: ${yogaClass.price}`;
    
    let socialUrl = '';
    
    switch (platform) {
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'instagram':
        // Instagram doesn't have direct URL sharing, so we'll copy to clipboard
        copyToClipboard(shareText + '\n' + shareUrl);
        toast({
          title: "Copied for Instagram",
          description: "Text copied to clipboard. You can paste it in your Instagram story or post.",
        });
        return;
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        copyToClipboard(shareText + '\n' + shareUrl);
        return;
    }
    
    if (socialUrl) {
      window.open(socialUrl, '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Class details have been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
      });
    });
  };

  useEffect(() => {
    // Load classes data initially
    loadClassesData();

    // Listen for storage changes (when admin updates classes)
    const handleStorageChange = (e: StorageEvent) => {
      console.log('ClassesSection: Storage change detected for key:', e.key);
      if (e.key === 'onlineClasses') {
        loadClassesData();
      }
    };

    // Listen for custom storage events dispatched by admin
    const handleCustomStorageEvent = (e: Event | CustomEvent) => {
      console.log('ClassesSection: Custom classesUpdated event received', e);
      loadClassesData();
    };

    // Listen for window focus to reload data when coming back from admin
    const handleWindowFocus = () => {
      console.log('ClassesSection: Window focus detected, reloading classes');
      setTimeout(loadClassesData, 100); // Small delay to ensure storage is updated
    };

    // Set up event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('classesUpdated', handleCustomStorageEvent);
    window.addEventListener('focus', handleWindowFocus);

    // Also listen for visibility change (when switching tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('ClassesSection: Page became visible, reloading classes');
        setTimeout(loadClassesData, 100);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('classesUpdated', handleCustomStorageEvent);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <section className="py-16 bg-yoga-cream">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-yoga-forest mb-4">
            Online Yoga Classes
          </h1>
          <p className="text-lg text-yoga-forest/80 max-w-3xl mx-auto">
            Join our live online yoga sessions from the comfort of your home. Expert instruction, 
            personal attention, and a supportive community await you.
          </p>
          {classes.length > 0 && (
            <p className="text-sm text-yoga-sage mt-2">
              {classes.length} classes available
            </p>
          )}
        </div>

        {/* Features Banner */}
        <div className="bg-white rounded-xl p-6 mb-12 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Video className="w-8 h-8 text-yoga-sage mb-2" />
              <h3 className="font-semibold text-yoga-forest">Live HD Classes</h3>
              <p className="text-sm text-yoga-forest/70">Crystal clear video quality</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-yoga-sage mb-2" />
              <h3 className="font-semibold text-yoga-forest">Small Groups</h3>
              <p className="text-sm text-yoga-forest/70">Personal attention guaranteed</p>
            </div>
            <div className="flex flex-col items-center">
              <Wifi className="w-8 h-8 text-yoga-sage mb-2" />
              <h3 className="font-semibold text-yoga-forest">Easy Access</h3>
              <p className="text-sm text-yoga-forest/70">Join from any device</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 text-yoga-sage mb-2" />
              <h3 className="font-semibold text-yoga-forest">Expert Teachers</h3>
              <p className="text-sm text-yoga-forest/70">Certified professionals</p>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-yoga-forest/70 text-lg">No classes available at the moment.</p>
            <p className="text-yoga-forest/50 text-sm mt-2">Check back soon for new classes!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {classes.map((yogaClass) => (
              <Card key={yogaClass.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={yogaClass.image} 
                    alt={yogaClass.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-yoga-sage text-white">
                    {yogaClass.level}
                  </Badge>
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {yogaClass.price}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-4 left-4 bg-white/90 hover:bg-white text-yoga-forest border-0"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleSocialShare('facebook', yogaClass)}
                        >
                          <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                          Facebook
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleSocialShare('instagram', yogaClass)}
                        >
                          <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                          Instagram
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleSocialShare('twitter', yogaClass)}
                        >
                          <Twitter className="w-4 h-4 mr-2 text-sky-500" />
                          Twitter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleSocialShare('copy', yogaClass)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-yoga-forest mb-2">
                        {yogaClass.title}
                      </CardTitle>
                      <p className="text-yoga-sage font-medium">with {yogaClass.instructor}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{yogaClass.rating}</span>
                      </div>
                      <Badge 
                        className={`${
                          (yogaClass.availableSeats || 0) <= 3 
                            ? 'bg-red-50 border-red-200 text-red-700' 
                            : 'bg-green-50 border-green-200 text-green-700'
                        }`}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {yogaClass.availableSeats || 0} seats left
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-yoga-forest/80 text-sm leading-relaxed">
                    {yogaClass.description}
                  </p>

                  {/* Class Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-yoga-sage" />
                      <span>{yogaClass.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-yoga-sage" />
                      <span>{yogaClass.capacity}</span>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      <Calendar className="w-4 h-4 text-yoga-sage" />
                      <span>{yogaClass.schedule}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-yoga-forest text-sm mb-2">What's Included:</h4>
                    <div className="flex flex-wrap gap-2">
                      {yogaClass.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      onClick={() => handleWhatsAppJoin(yogaClass.title, yogaClass.price)}
                      className="flex-1 bg-yoga-sage hover:bg-yoga-forest"
                      disabled={(yogaClass.availableSeats || 0) === 0}
                    >
                      {(yogaClass.availableSeats || 0) === 0 ? 'Fully Booked' : 'Join Class'}
                    </Button>
                    {yogaClass.joinLink && (yogaClass.availableSeats || 0) > 0 && (
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(yogaClass.joinLink, '_blank')}
                        className="border-yoga-sage text-yoga-sage hover:bg-yoga-sage hover:text-white"
                      >
                        Quick Join
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-yoga-forest mb-4">
            Ready to Start Your Online Yoga Journey?
          </h2>
          <p className="text-yoga-forest/80 mb-6 max-w-2xl mx-auto">
            Join thousands of students who have transformed their lives through our online yoga classes. 
            Experience the convenience of practicing from home with expert guidance.
          </p>
          <Button 
            onClick={() => handleWhatsAppJoin("Online Yoga Classes", "Starting from ₹800")}
            size="lg" 
            className="bg-yoga-sage hover:bg-yoga-forest px-8"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;
