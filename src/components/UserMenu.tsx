
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, User, Settings, Crown, Shield, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  user: { username: string; role: string; id?: string } | null;
  onLogout: () => void;
}

const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    onLogout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Crown size={16} className="text-yellow-600" />;
      case 'admin':
        return <Shield size={16} className="text-blue-600" />;
      case 'user':
        return <Users size={16} className="text-green-600" />;
      case 'guest':
        return <Users size={16} className="text-gray-600" />;
      default:
        return <User size={16} className="text-yoga-sage" />;
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      <div className="hidden md:flex items-center space-x-2 text-sm">
        {getRoleIcon(user.role)}
        <span className="text-yoga-forest font-medium">{user.username}</span>
        <span className="text-yoga-sage text-xs capitalize">({user.role})</span>
      </div>
      
      {(user.role === 'admin' || user.role === 'superadmin') && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleAdminPanel}
          className="text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white"
        >
          <Settings size={16} className="mr-2" />
          Admin Panel
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleLogout}
        className="text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white"
      >
        <LogIn size={16} className="mr-2 rotate-180" />
        Logout
      </Button>
    </div>
  );
};

export default UserMenu;
