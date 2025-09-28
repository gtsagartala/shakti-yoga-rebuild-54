import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { contactService } from '@/services/database';

const AdminContact = () => {
  const { toast } = useToast();
  
  const [content, setContent] = useState({
    heroTitle: "Get In Touch",
    heroSubtitle: "Ready to begin your yoga journey? We're here to support you every step of the way.",
    address: {
      street: "123 Wellness Street",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001",
      country: "India"
    },
    phone: {
      primary: "+91 87778 16410",
      secondary: "+91 87778 16410",
      whatsapp: "WhatsApp Available"
    },
    email: {
      info: "info@shaktiyogaraai.com",
      classes: "classes@shaktiyogaraai.com",
      support: "support@shaktiyogaraai.com"
    },
    hours: {
      weekdays: "Monday - Friday: 6:00 AM - 9:00 PM",
      saturday: "Saturday: 7:00 AM - 8:00 PM",
      sunday: "Sunday: 8:00 AM - 6:00 PM"
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await contactService.get();
      setContent(data);
    } catch (error) {
      console.error('AdminContact: Error loading contact content:', error);
      toast({
        variant: "destructive",
        title: "Load Error",
        description: "Failed to load contact content from database.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await contactService.save(content);
      toast({
        title: "Contact Page Updated",
        description: "The contact page content has been updated successfully.",
      });
    } catch (error) {
      console.error('AdminContact: Error saving contact content:', error);
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Failed to save contact content. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yoga-sage mx-auto mb-4"></div>
          <p className="text-yoga-forest">Loading contact content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-yoga-forest mb-4">Hero Section</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              value={content.heroTitle}
              onChange={(e) => setContent(prev => ({ ...prev, heroTitle: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={content.heroSubtitle}
              onChange={(e) => setContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
              rows={2}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-yoga-forest mb-4">Address Information</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={content.address.street}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                address: { ...prev.address, street: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={content.address.city}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                address: { ...prev.address, city: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={content.address.state}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                address: { ...prev.address, state: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              value={content.address.zip}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                address: { ...prev.address, zip: e.target.value }
              }))}
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={content.address.country}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                address: { ...prev.address, country: e.target.value }
              }))}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-yoga-forest mb-4">Contact Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-yoga-forest">Phone Numbers</h3>
            <div>
              <Label htmlFor="primaryPhone">Primary Phone</Label>
              <Input
                id="primaryPhone"
                value={content.phone.primary}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  phone: { ...prev.phone, primary: e.target.value }
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="secondaryPhone">Secondary Phone</Label>
              <Input
                id="secondaryPhone"
                value={content.phone.secondary}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  phone: { ...prev.phone, secondary: e.target.value }
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="whatsapp">WhatsApp Info</Label>
              <Input
                id="whatsapp"
                value={content.phone.whatsapp}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  phone: { ...prev.phone, whatsapp: e.target.value }
                }))}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-yoga-forest">Email Addresses</h3>
            <div>
              <Label htmlFor="infoEmail">Info Email</Label>
              <Input
                id="infoEmail"
                value={content.email.info}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  email: { ...prev.email, info: e.target.value }
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="classesEmail">Classes Email</Label>
              <Input
                id="classesEmail"
                value={content.email.classes}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  email: { ...prev.email, classes: e.target.value }
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                value={content.email.support}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  email: { ...prev.email, support: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-yoga-forest mb-4">Studio Hours</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="weekdays">Weekdays Hours</Label>
            <Input
              id="weekdays"
              value={content.hours.weekdays}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                hours: { ...prev.hours, weekdays: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="saturday">Saturday Hours</Label>
            <Input
              id="saturday"
              value={content.hours.saturday}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                hours: { ...prev.hours, saturday: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="sunday">Sunday Hours</Label>
            <Input
              id="sunday"
              value={content.hours.sunday}
              onChange={(e) => setContent(prev => ({ 
                ...prev, 
                hours: { ...prev.hours, sunday: e.target.value }
              }))}
            />
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} className="bg-yoga-sage hover:bg-yoga-forest">
        <Save size={16} className="mr-2" />
        Save Contact Page Content
      </Button>
    </div>
  );
};

export default AdminContact;
