
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Image, Upload, RefreshCw } from 'lucide-react';

const AdminFavicon = () => {
  const { toast } = useToast();
  const [faviconUrl, setFaviconUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  // Load favicon URL from localStorage on mount
  useEffect(() => {
    const storedFaviconUrl = localStorage.getItem('faviconUrl');
    if (storedFaviconUrl) {
      setFaviconUrl(storedFaviconUrl);
      setPreviewUrl(storedFaviconUrl);
    } else {
      // Default yoga-related favicon
      const defaultFavicon = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=32&h=32&q=80';
      setFaviconUrl(defaultFavicon);
      setPreviewUrl(defaultFavicon);
    }
  }, []);

  const updateFavicon = (url: string) => {
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(link => link.remove());

    // Add new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/jpeg';
    link.href = url;
    document.head.appendChild(link);

    // Add apple touch icon
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = url.replace('w=32&h=32', 'w=180&h=180');
    document.head.appendChild(appleLink);
  };

  const handleSaveFavicon = () => {
    if (!faviconUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid favicon URL."
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('faviconUrl', faviconUrl);
    
    // Update the actual favicon
    updateFavicon(faviconUrl);
    
    // Update preview
    setPreviewUrl(faviconUrl);
    
    toast({
      title: "Favicon Updated",
      description: "The website favicon has been updated successfully."
    });
  };

  const handlePreview = () => {
    if (faviconUrl.trim()) {
      setPreviewUrl(faviconUrl);
    }
  };

  const resetToDefault = () => {
    const defaultFavicon = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=32&h=32&q=80';
    setFaviconUrl(defaultFavicon);
    setPreviewUrl(defaultFavicon);
  };

  // Yoga-related favicon suggestions
  const yogaSuggestions = [
    {
      name: "Yoga Pose Silhouette",
      url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=32&h=32&q=80"
    },
    {
      name: "Lotus Flower",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=32&h=32&q=80"
    },
    {
      name: "Meditation Symbol",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=32&h=32&q=80"
    },
    {
      name: "Om Symbol",
      url: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=32&h=32&q=80"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Image size={20} className="text-yoga-sage" />
            <span>Website Favicon Management</span>
          </CardTitle>
          <CardDescription>
            Customize your website's favicon icon that appears in browser tabs and bookmarks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="faviconUrl">Favicon URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="faviconUrl"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="Enter favicon image URL (32x32px recommended)"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handlePreview}
                className="text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white"
              >
                <RefreshCw size={16} className="mr-1" />
                Preview
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <Label className="text-sm font-medium mb-2 block">Preview:</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={previewUrl} 
                  alt="Favicon preview" 
                  className="w-8 h-8 rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=32&h=32&q=80';
                  }}
                />
                <span className="text-sm text-yoga-forest">Browser tab preview</span>
              </div>
              <div className="flex items-center space-x-2">
                <img 
                  src={previewUrl.replace('w=32&h=32', 'w=64&h=64')} 
                  alt="Large favicon preview" 
                  className="w-16 h-16 rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=64&h=64&q=80';
                  }}
                />
                <span className="text-sm text-yoga-forest">Large version</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSaveFavicon}
              className="bg-yoga-sage hover:bg-yoga-forest"
            >
              <Save size={16} className="mr-2" />
              Save Favicon
            </Button>
            
            <Button
              variant="outline"
              onClick={resetToDefault}
              className="text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white"
            >
              Reset to Default
            </Button>
          </div>

          {/* Important Note */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> Lovable currently doesn't support .ico favicons. Please use PNG/JPG files instead. 
              For best results, use square images (32x32px or 64x64px).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Yoga-themed Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload size={20} className="text-yoga-sage" />
            <span>Yoga-themed Suggestions</span>
          </CardTitle>
          <CardDescription>
            Quick options for yoga-related favicons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {yogaSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setFaviconUrl(suggestion.url)}
              >
                <img
                  src={suggestion.url}
                  alt={suggestion.name}
                  className="w-12 h-12 rounded-lg mb-2"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=48&h=48&q=80';
                  }}
                />
                <span className="text-xs text-center text-yoga-forest">{suggestion.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFavicon;
