import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Edit, FileText, Image, MessageSquare, Users, Calendar, BarChart3, Home, Settings, Eye, UserCog, Plus, Trash2, X, RefreshCw, Trash, Search, Video } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminArticles from './AdminArticles';
import AdminGallery from './AdminGallery';
import AdminPopups from './AdminPopups';
import AdminAbout from './AdminAbout';
import AdminContact from './AdminContact';
import AdminInstructors from './AdminInstructors';
import AdminBookings from './AdminBookings';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminSEO from './AdminSEO';
import AdminClasses from './AdminClasses';
import AdminEvents from './AdminEvents';

interface AdminPanelProps {
  currentUser: {
    role: string;
    id: string;
    username: string;
  };
}

const AdminPanel = ({ currentUser }: AdminPanelProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Hero section state
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80');

  // Listen for custom events to switch tabs
  useEffect(() => {
    const handleSwitchToInstructorsTab = () => {
      setActiveTab('instructors');
    };
    
    window.addEventListener('switchToInstructorsTab', handleSwitchToInstructorsTab);
    
    return () => {
      window.removeEventListener('switchToInstructorsTab', handleSwitchToInstructorsTab);
    };
  }, []);

  const handleSaveHero = () => {
    localStorage.setItem('heroImage', heroImage);
    toast({
      title: "Hero Image Updated",
      description: "The hero section image has been updated successfully."
    });
  };

  const handleClearCache = () => {
    // Clear all website cache
    const cacheKeys = ['fullPrograms', 'programs', 'programsSection', 'heroImage', 'aboutContent', 'aboutSectionContent', 'instructors', 'galleryImages', 'popupSettings', 'contactContent', 'articles', 'bookings', 'onlineClasses'];
    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear session storage as well
    sessionStorage.clear();

    // Trigger storage event to update components
    window.dispatchEvent(new Event('storage'));
    toast({
      title: "Cache Cleared",
      description: "All website cache has been cleared successfully."
    });
  };

  const handleRefreshWebsite = () => {
    // Force reload the entire page
    window.location.reload();
  };

  const sidebarItems = [{
    title: "Dashboard",
    icon: BarChart3,
    id: "dashboard"
  }, {
    title: "Content Management",
    items: [{
      title: "Hero Section",
      icon: Home,
      id: "hero"
    }, {
      title: "About",
      icon: FileText,
      id: "about"
    }, {
      title: "Contact",
      icon: MessageSquare,
      id: "contact"
    }]
  }, {
    title: "Media & Content",
    items: [{
      title: "Articles",
      icon: FileText,
      id: "articles"
    }, {
      title: "Gallery",
      icon: Image,
      id: "gallery"
    }, {
      title: "Popups",
      icon: MessageSquare,
      id: "popups"
    }]
  }, {
    title: "Classes & Events",
    items: [{
      title: "Online Classes",
      icon: Video,
      id: "classes"
    }, {
      title: "Events",
      icon: Calendar,
      id: "events"
    }]
  }, {
    title: "SEO & Settings",
    items: [{
      title: "SEO Management",
      icon: Search,
      id: "seo"
    }]
  }, {
    title: "People & Management",
    items: [{
      title: "Instructors",
      icon: Users,
      id: "instructors"
    }, {
      title: "Bookings",
      icon: Calendar,
      id: "bookings"
    }, ...(currentUser.role === 'admin' || currentUser.role === 'superadmin' ? [{
      title: "User Management",
      icon: UserCog,
      id: "users"
    }] : [])]
  }];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className="space-y-6">
            <AdminDashboard />
            
            {/* Cache Management Section */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings size={20} className="text-yoga-sage" />
                <h2 className="text-xl font-semibold text-yoga-forest">Website Management</h2>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button onClick={handleClearCache} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <Trash size={16} className="mr-2" />
                  Clear Website Cache
                </Button>
                
                <Button onClick={handleRefreshWebsite} className="bg-yoga-sage hover:bg-yoga-forest">
                  <RefreshCw size={16} className="mr-2" />
                  Refresh Website
                </Button>
              </div>
              
              <p className="text-sm text-yoga-forest/70 mt-4">
                Clear cache and refresh if changes aren't appearing correctly.
              </p>
            </Card>
          </div>;
      case 'hero':
        return <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Edit size={20} className="text-yoga-sage" />
              <h2 className="text-xl font-semibold text-yoga-forest">Hero Section Image</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="heroImage">Image URL</Label>
                <Input id="heroImage" value={heroImage} onChange={e => setHeroImage(e.target.value)} placeholder="Enter image URL" className="mt-1" />
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img src={heroImage} alt="Hero preview" className="w-full h-48 object-cover rounded-lg" onError={e => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
              }} />
              </div>
              
              <Button onClick={handleSaveHero} className="bg-yoga-sage hover:bg-yoga-forest">
                <Save size={16} className="mr-2" />
                Save Hero Image
              </Button>
            </div>
          </Card>;
      case 'instructors':
        return <AdminInstructors />;
      case 'bookings':
        return <AdminBookings />;
      case 'articles':
        return <AdminArticles />;
      case 'gallery':
        return <AdminGallery />;
      case 'popups':
        return <AdminPopups />;
      case 'about':
        return <AdminAbout />;
      case 'contact':
        return <AdminContact />;
      case 'users':
        return <AdminUsers currentUser={currentUser} />;
      case 'seo':
        return <AdminSEO />;
      case 'classes':
        return <AdminClasses />;
      case 'events':
        return <AdminEvents />;
      default:
        return <AdminDashboard />;
    }
  };

  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-4">
              <h1 className="text-2xl font-bold text-yoga-forest">Admin Panel</h1>
              <p className="text-sm text-yoga-forest/70">Manage your website</p>
              <p className="text-xs text-yoga-sage mt-1">Logged in as: {currentUser.username} ({currentUser.role})</p>
            </div>
            
            {sidebarItems.map((section, index) => <SidebarGroup key={index}>
                {section.title && !section.items && <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => setActiveTab(section.id)} isActive={activeTab === section.id}>
                        <section.icon />
                        <span>{section.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>}
                
                {section.items && <>
                    <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {section.items.map(item => <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton onClick={() => setActiveTab(item.id)} isActive={activeTab === item.id}>
                              <item.icon />
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </>}
              </SidebarGroup>)}
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>;
};

export default AdminPanel;
