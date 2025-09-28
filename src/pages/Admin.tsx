
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { LogOut, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string; id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Add a small delay to prevent immediate redirects on refresh
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          
          // Check if user has admin or superadmin role
          if (user.role === 'admin' || user.role === 'superadmin') {
            setCurrentUser(user);
          } else {
            toast({
              variant: "destructive",
              title: "Access Denied",
              description: "You need admin or super admin privileges to access this page.",
            });
            navigate('/', { replace: true });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Login Required",
            description: "Please login with admin credentials to access this page.",
          });
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to prevent flash of redirect on refresh
    const timeoutId = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/', { replace: true });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yoga-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yoga-sage mx-auto mb-4"></div>
          <p className="text-yoga-forest">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show access denied if no user or wrong permissions
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yoga-cream">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-yoga-forest mb-4">Access Denied</h1>
          <p className="text-yoga-forest/70 mb-4">You need admin or super admin privileges to access this page.</p>
          <Button onClick={() => navigate('/', { replace: true })} className="bg-yoga-sage hover:bg-yoga-forest">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yoga-cream">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-yoga-sage/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10">
                <img 
                  src="/lovable-uploads/001a3e79-c253-4f0f-8842-ed9a57850b57.png" 
                  alt="Shakti Yoga Raai Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-yoga-forest">Shakti Yoga Raai Admin</h1>
                <p className="text-sm text-yoga-forest/70">Welcome, {currentUser.username} ({currentUser.role})</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleBackToHome}
                className="text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white"
              >
                <Home size={16} className="mr-2" />
                Back to Website
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Panel Content */}
      <main>
        <AdminPanel currentUser={currentUser} />
      </main>
    </div>
  );
};

export default Admin;
