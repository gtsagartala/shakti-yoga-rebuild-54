import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, ExternalLink, Share, Sparkles, Star, Zap } from 'lucide-react';
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
  capacity: string;
  joinUrl: string;
}
const EventsSection = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const loadEventData = () => {
    const stored = localStorage.getItem('eventData');
    if (stored) {
      setEvent(JSON.parse(stored));
    } else {
      // Default event with new course details
      const defaultEvent: Event = {
        id: '1',
        title: '5-Day Meditation, Pelvic floor Flexibility & 7 Chakra Kundalini Activation Course',
        description: `Course Overview:

Dive into a powerful spiritual journey with this intensive 5-day course focused on the 7 Chakras and Kundalini awakening. This course blends guided meditation, chakra balancing, pranayama, Kundalini kriyas, Pelvic floor flexibility Yoga and sound healing to activate and align your inner energy system.

Each day, we focus on multiple chakras in sequence, unlocking physical, emotional, and energetic healing.

⸻

🔮 What You Will Experience:
	•	Daily guided chakra meditations
	•	Kundalini energy awakening practices
	•	Breathwork (pranayama) & bandhas
	•	Sound vibration & mantra chanting
	•	Chakra healing visualizations
	•	For Pelvic Floor Flexibility Yoga
	•	Energy cleansing & grounding techniques

⸻

🔥 Daily Chakra Flow (Example Schedule):

Day 1: Root + Sacral Chakras
Focus: Grounding & emotional release

Day 2: Solar Plexus + Heart
Focus: Confidence & heart expansion

Day 3: Throat + Third Eye
Focus: Expression & intuition

Day 4: Crown Chakra + Full Chakra Cleanse
Focus: Spiritual connection & alignment

Day 5: Complete 7 Chakra Activation + Kundalini Flow
Focus: Full-body energy awakening & integration

⸻

📦 Course Includes:
	•	Live Zoom classes 
	•	Daily energy practice PDFs
	•	Private text support 
	•	Completion Certificate

⸻

👥 Who Can Join?
	•	Beginners & intermediate meditators
	•	Yoga practitioners & wellness seekers
	•	Anyone experiencing stress, blocks, or energy imbalances
	•	Healers, coaches, and spiritual guides

⸻

📝 Registration Now Open!

👉 Limited seats available for personal attention
👉 Click below to reserve your spot`,
        date: '2025-07-21',
        time: 'Morning: 5:00 AM – 6:00 AM\nEvening: 5:00 PM – 6:00 PM\n(Join as per your convenience)',
        location: 'Online via Zoom',
        price: '₹7500 INR / $120 USD',
        image: 'https://i.postimg.cc/VvCNSCSz/5-Day-Meditation.webp',
        capacity: '21 participants',
        joinUrl: 'https://wa.me/918777816410?text=Hi! I would like to join the 5-Day Meditation, Pelvic floor Flexibility & 7 Chakra Kundalini Activation Course. Please send me the details.'
      };
      setEvent(defaultEvent);
      localStorage.setItem('eventData', JSON.stringify(defaultEvent));
    }
  };
  useEffect(() => {
    // Clear old event data and set new default
    localStorage.removeItem('eventData');

    // Load event data with new defaults
    loadEventData();

    // Listen for storage changes (when admin updates the event)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'eventData') {
        loadEventData();
      }
    };

    // Listen for custom storage events dispatched by admin
    const handleCustomStorageEvent = () => {
      loadEventData();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleCustomStorageEvent);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorageEvent);
    };
  }, []);
  const handleJoinEvent = () => {
    if (event?.joinUrl) {
      window.open(event.joinUrl, '_blank');
    }
  };
  const handleShareEvent = async () => {
    if (!event) return;
    const shareData = {
      title: event.title,
      text: `Join us for ${event.title} - ${event.description}`,
      url: window.location.href
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      }
    } catch (error) {
      console.log('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      } catch (clipboardError) {
        console.log('Clipboard error:', clipboardError);
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };
  if (!event) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-primary" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">No Events Available</h2>
          <p className="text-muted-foreground">Check back soon for upcoming events!</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-card border px-4 py-2 rounded-full mb-6 shadow-sm">
              <Star className="text-primary mr-2" size={16} />
              <span className="text-primary font-medium text-sm">Featured Event</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Join Our Transformative
              <span className="block text-primary">
                Wellness Journey
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience profound healing and spiritual awakening through our comprehensive meditation and wellness program.
            </p>
          </div>
        </div>
      </div>

      {/* Main Event Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-lg">
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Event Image */}
              <div className="lg:col-span-2 relative group">
                <div className="aspect-square lg:aspect-auto lg:h-full min-h-[300px] relative overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Price Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
                      <span className="font-bold text-lg">{event.price}</span>
                    </div>
                  </div>

                  {/* Share Button */}
                  <Button onClick={handleShareEvent} size="icon" variant="secondary" className="absolute top-4 right-4 shadow-lg hover:scale-110 transition-transform">
                    <Share size={18} />
                  </Button>
                </div>
              </div>

              {/* Event Details */}
              <div className="lg:col-span-3 p-6 md:p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                      {event.title}
                    </h2>
                    <div className="text-muted-foreground leading-relaxed max-h-32 md:max-h-40 overflow-y-auto">
                      <p className="whitespace-pre-line text-sm md:text-base">{event.description}</p>
                    </div>
                  </div>

                  {/* Event Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm">Date</p>
                        <p className="text-muted-foreground text-xs md:text-sm truncate">
                          {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm">Time</p>
                        <p className="text-muted-foreground text-xs md:text-sm whitespace-pre-line">{event.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm">Location</p>
                        <p className="text-muted-foreground text-xs md:text-sm">{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm">Capacity</p>
                        <p className="text-muted-foreground text-xs md:text-sm">{event.capacity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Join Button */}
                  <div className="pt-4 space-y-3">
                    <Button onClick={handleJoinEvent} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold transition-all duration-300 hover:scale-[1.02]">
                      <span className="mr-2">Join Event</span>
                      <ExternalLink size={20} />
                    </Button>
                    
                    {/* Admin Edit Button */}
                    <Button onClick={() => window.open('/admin', '_blank')} variant="outline" className="w-full py-2 text-sm font-medium border-2 hover:bg-secondary/20 transition-all duration-300">
                      <span className="mr-2">Events Details</span>
                    </Button>
                    
                    <p className="text-center text-muted-foreground text-sm mt-2">
                      Limited seats available • Secure your spot now
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="text-primary" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Have Questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Get in touch with our team for personalized guidance and support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => window.open('https://wa.me/918777816410?text=Hi! I have questions about the upcoming event.', '_blank')} className="px-6 py-2">
                Get In Touch
              </Button>
              <Button onClick={handleJoinEvent} className="px-6 py-2">
                Register Now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
export default EventsSection;