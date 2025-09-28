import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, User, Mail, Phone, Clock, MessageSquare, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { bookingService } from '@/services/database';

interface BookingData {
  id: string;
  name: string;
  email: string;
  phone: string;
  classType: string;
  preferredDate: string;
  preferredTime: string;
  experience: string;
  specialRequests: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const AdminBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getAll();
      console.log('AdminBookings: Loaded bookings from database:', data);
      // Ensure status is properly typed
      const typedBookings = data.map(booking => ({
        ...booking,
        status: (booking.status || 'pending') as 'pending' | 'confirmed' | 'cancelled'
      }));
      setBookings(typedBookings);
    } catch (error) {
      console.error('AdminBookings: Error loading bookings:', error);
      toast({
        variant: "destructive",
        title: "Load Error",
        description: "Failed to load bookings from database.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await bookingService.updateStatus(id, status);
      await loadBookings(); // Refresh the list
      
      toast({
        title: "Booking Updated",
        description: `Booking status changed to ${status}.`,
      });
    } catch (error) {
      console.error('AdminBookings: Error updating booking status:', error);
      toast({
        variant: "destructive",
        title: "Update Error",
        description: "Failed to update booking status.",
      });
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await bookingService.delete(id);
      await loadBookings(); // Refresh the list
      
      toast({
        title: "Booking Deleted",
        description: "The booking has been deleted successfully.",
      });
    } catch (error) {
      console.error('AdminBookings: Error deleting booking:', error);
      toast({
        variant: "destructive",
        title: "Delete Error",
        description: "Failed to delete booking.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelled': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-yellow-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-yoga-forest">Manage Bookings</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yoga-sage mx-auto mb-4"></div>
          <p className="text-yoga-forest">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-yoga-forest">Manage Bookings</h2>
        <div className="text-sm text-yoga-forest/70">
          Total: {bookings.length} bookings
        </div>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(booking.status)}
                <div>
                  <h3 className="text-lg font-semibold text-yoga-forest">{booking.name}</h3>
                  <p className="text-sm text-yoga-forest/70">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Mail size={16} className="text-yoga-sage" />
                <span>{booking.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone size={16} className="text-yoga-sage" />
                <span>{booking.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar size={16} className="text-yoga-sage" />
                <span>{new Date(booking.preferredDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock size={16} className="text-yoga-sage" />
                <span>{booking.preferredTime || 'Not specified'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <User size={16} className="text-yoga-sage" />
                <span>{booking.classType}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MessageSquare size={16} className="text-yoga-sage" />
                <span>{booking.experience || 'Not specified'}</span>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-yoga-forest/80">
                  <strong>Special Requests:</strong> {booking.specialRequests}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white">
                    <Eye size={14} className="mr-1" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div><strong>Name:</strong> {booking.name}</div>
                    <div><strong>Email:</strong> {booking.email}</div>
                    <div><strong>Phone:</strong> {booking.phone}</div>
                    <div><strong>Class Type:</strong> {booking.classType}</div>
                    <div><strong>Preferred Date:</strong> {new Date(booking.preferredDate).toLocaleDateString()}</div>
                    <div><strong>Preferred Time:</strong> {booking.preferredTime || 'Not specified'}</div>
                    <div><strong>Experience:</strong> {booking.experience || 'Not specified'}</div>
                    <div><strong>Special Requests:</strong> {booking.specialRequests || 'None'}</div>
                    <div><strong>Status:</strong> {booking.status}</div>
                    <div><strong>Created:</strong> {new Date(booking.createdAt).toLocaleDateString()}</div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex space-x-2">
                {booking.status !== 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Confirm
                  </Button>
                )}
                {booking.status !== 'cancelled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteBooking(booking.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {bookings.length === 0 && (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold text-yoga-forest mb-2">No Bookings Yet</h3>
            <p className="text-yoga-forest/70">When users book classes, they will appear here.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
