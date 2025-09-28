
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Edit, Trash2, Key, Users, Shield, Crown } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'guest' | 'user' | 'admin' | 'superadmin';
}

interface AdminUsersProps {
  currentUser: { role: string; id: string };
}

const AdminUsers = ({ currentUser }: AdminUsersProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();

  // Default users
  const defaultUsers = [
    { id: '1', username: 'admin', password: 'admin123', role: 'admin' as const, email: 'admin@example.com' },
    { id: '2', username: 'yoga_admin', password: 'shakti2024', role: 'admin' as const, email: 'yoga_admin@example.com' },
    { id: '3', username: 'superadmin', password: 'super123', role: 'superadmin' as const, email: 'superadmin@example.com' },
    { id: '4', username: 'instructor', password: 'teacher123', role: 'user' as const, email: 'instructor@example.com' },
    { id: '5', username: 'student', password: 'student123', role: 'user' as const, email: 'student@example.com' },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allUsers = [...defaultUsers, ...storedUsers];
    setUsers(allUsers);
  };

  const canManageUser = (targetUser: User) => {
    // Super admin can manage everyone except other super admins
    if (currentUser.role === 'superadmin') {
      return targetUser.role !== 'superadmin' || targetUser.id === currentUser.id;
    }
    // Admin can manage users and guests, but not admins or super admins
    if (currentUser.role === 'admin') {
      return targetUser.role === 'user' || targetUser.role === 'guest';
    }
    return false;
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
        return <Users size={16} className="text-gray-600" />;
    }
  };

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    if (users.some(user => user.username === newUser.username)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Username already exists",
      });
      return;
    }

    const userToCreate: User = {
      ...newUser,
      id: Date.now().toString(),
    };

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = [...storedUsers, userToCreate];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast({
      title: "User Created",
      description: `User ${userToCreate.username} has been created successfully`,
    });

    setNewUser({ username: '', email: '', password: '', role: 'user' });
    setIsCreateDialogOpen(false);
    loadUsers();
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedStoredUsers = storedUsers.map((user: User) => 
      user.id === selectedUser.id ? selectedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedStoredUsers));

    toast({
      title: "User Updated",
      description: `User ${selectedUser.username} has been updated successfully`,
    });

    setIsEditDialogOpen(false);
    setSelectedUser(null);
    loadUsers();
  };

  const handleChangePassword = () => {
    if (!selectedUser || !newPassword) return;

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters long",
      });
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedStoredUsers = storedUsers.map((user: User) => 
      user.id === selectedUser.id ? { ...user, password: newPassword } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedStoredUsers));

    toast({
      title: "Password Changed",
      description: `Password for ${selectedUser.username} has been updated`,
    });

    setNewPassword('');
    setIsPasswordDialogOpen(false);
    setSelectedUser(null);
    loadUsers();
  };

  const handleDeleteUser = (user: User) => {
    if (!canManageUser(user)) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to delete this user",
      });
      return;
    }

    // Prevent deleting default users (they're built-in)
    if (defaultUsers.some(defaultUser => defaultUser.id === user.id)) {
      toast({
        variant: "destructive",
        title: "Cannot Delete",
        description: "Cannot delete built-in system users",
      });
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = storedUsers.filter((u: User) => u.id !== user.id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast({
      title: "User Deleted",
      description: `User ${user.username} has been deleted`,
    });

    loadUsers();
  };

  const availableRoles = currentUser.role === 'superadmin' 
    ? ['guest', 'user', 'admin', 'superadmin']
    : ['guest', 'user'];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-yoga-sage" />
            <h2 className="text-xl font-semibold text-yoga-forest">User Management</h2>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yoga-sage hover:bg-yoga-forest">
                <UserPlus size={16} className="mr-2" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system with specified role and permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-username">Username</Label>
                  <Input
                    id="new-username"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label htmlFor="new-email">Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <Label htmlFor="new-role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as User['role'] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map(role => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(role)}
                            <span className="capitalize">{role}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateUser} className="w-full bg-yoga-sage hover:bg-yoga-forest">
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {canManageUser(user) && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsPasswordDialogOpen(true);
                            }}
                          >
                            <Key size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={selectedUser.username}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, username: e.target.value } : null)}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value) => setSelectedUser(prev => prev ? { ...prev, role: value as User['role'] } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map(role => (
                      <SelectItem key={role} value={role}>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(role)}
                          <span className="capitalize">{role}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateUser} className="w-full bg-yoga-sage hover:bg-yoga-forest">
                Update User
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUser?.username}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-user-password">New Password</Label>
              <Input
                id="new-user-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <Button onClick={handleChangePassword} className="w-full bg-yoga-sage hover:bg-yoga-forest">
              <Key size={16} className="mr-2" />
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
