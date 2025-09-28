import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OnlineClass {
  id: string;
  title: string;
  instructor: string;
  classStarting?: string;
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

const AdminClasses = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<OnlineClass[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<OnlineClass | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [formData, setFormData] = useState<Partial<OnlineClass>>({
    title: '',
    instructor: '',
    classStarting: '',
    description: '',
    price: '',
    duration: '',
    capacity: '',
    schedule: '',
    level: 'All Levels',
    rating: 5.0,
    features: [],
    image: '',
    joinLink: '',
    maxSeats: 15,
    availableSeats: 15
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    console.log('AdminClasses: Loading classes...');
    const stored = localStorage.getItem('onlineClasses');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('AdminClasses: Loaded classes:', parsed);
        
        // Update the existing classes to match the user's specifications
        const updatedClasses = parsed.map((classItem: OnlineClass) => {
          if (classItem.id === '1') {
            return {
              ...classItem,
              title: '3-Month Personal Yoga',
              description: '( Weekly 2–Day Class ) Totally 24 Class, This is more than a class — it\'s a commitment to your highest self. Embark on a 3 Month transformational path tailored just for you. One-on-one guidance. Deep spiritual discipline. Visible physical and inner growth. Whether you\'re beginning or deepening your journey — this sacred space is designed to support your unique rhythm.',
              price: '•For Indian Residents: ₹43,200, •For International Participants: $535',
              features: [
                '🔹 Personal attention',
                '🔹 Customized Sadhana',
                '🔹 Lifestyle alignment & inner clarity',
                '🔹 Flexible timing that fits your schedule',
                '🔹 Spiritual mentorship throughout'
              ]
            };
          } else if (classItem.id === '2') {
            return {
              ...classItem,
              title: '12 Days Class',
              description: 'Where Your Soul Expands And Your Body Gains A Rhythm\n\n60 minutes every day - 12 day in total.\n(60 minutes for yoga Session)',
              price: '₹7,500 / $120',
              features: [
                'Kundalini Shakthi Yoga',
                'Mana Mudra',
                'Hasta Mudra',
                'Bandha',
                'Chakra Healing',
                'Hatha Yoga Asanas',
                'Ashtanga Surya Namaskar A & B',
                'Fat reduce',
                'Shakthi Yoga Flows',
                'Jal Neti',
                'Pranayama'
              ]
            };
          }
          return classItem;
        }).filter(classItem => classItem.id !== '3' && classItem.id !== '4');
        
        // Save the updated classes back to localStorage
        if (JSON.stringify(updatedClasses) !== JSON.stringify(parsed)) {
          localStorage.setItem('onlineClasses', JSON.stringify(updatedClasses));
          console.log('AdminClasses: Updated existing class data');
        }
        
        setClasses(updatedClasses);
      } catch (error) {
        console.error('AdminClasses: Error parsing classes:', error);
        
        // Set default classes if parsing fails
        const defaultClasses: OnlineClass[] = [
          {
            id: '1',
            title: '3-Month Personal Yoga',
            instructor: 'Raai Kotha',
            description: '( Weekly 2–Day Class ) Totally 24 Class, This is more than a class — it\'s a commitment to your highest self. Embark on a 3 Month transformational path tailored just for you. One-on-one guidance. Deep spiritual discipline. Visible physical and inner growth. Whether you\'re beginning or deepening your journey — this sacred space is designed to support your unique rhythm.',
            price: '•For Indian Residents: ₹43,200, •For International Participants: $535',
            duration: '60 minutes',
            capacity: '15 students',
            schedule: 'Mon, Wed, Fri - 7:00 AM IST',
            level: 'All Levels',
            rating: 4.9,
            features: [
              '🔹 Personal attention',
              '🔹 Customized Sadhana',
              '🔹 Lifestyle alignment & inner clarity',
              '🔹 Flexible timing that fits your schedule',
              '🔹 Spiritual mentorship throughout'
            ],
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            joinLink: 'https://meet.google.com/abc-def-ghi',
            maxSeats: 15,
            availableSeats: 12
          },
          {
            id: '2',
            title: '12 Days Class',
            instructor: 'Sannidhya Krishna Das',
            description: 'Where Your Soul Expands And Your Body Gains A Rhythm\n\n60 minutes every day - 12 day in total.\n(60 minutes for yoga Session)',
            price: '₹7,500 / $120',
            duration: '60 minutes',
            capacity: '12 students',
            schedule: 'Daily for 12 days',
            level: 'Intermediate',
            rating: 5.0,
            features: [
              'Kundalini Shakthi Yoga',
              'Mana Mudra',
              'Hasta Mudra',
              'Bandha',
              'Chakra Healing',
              'Hatha Yoga Asanas',
              'Ashtanga Surya Namaskar A & B',
              'Fat reduce',
              'Shakthi Yoga Flows',
              'Jal Neti',
              'Pranayama'
            ],
            image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            joinLink: 'https://meet.google.com/xyz-abc-def',
            maxSeats: 12,
            availableSeats: 8
          }
        ];
        setClasses(defaultClasses);
        localStorage.setItem('onlineClasses', JSON.stringify(defaultClasses));
      }
    } else {
      console.log('AdminClasses: No classes found in storage, creating default');
      const defaultClasses: OnlineClass[] = [
        {
          id: '1',
          title: '3-Month Personal Yoga',
          instructor: 'Raai Kotha',
          description: '( Weekly 2–Day Class ) Totally 24 Class, This is more than a class — it\'s a commitment to your highest self. Embark on a 3 Month transformational path tailored just for you. One-on-one guidance. Deep spiritual discipline. Visible physical and inner growth. Whether you\'re beginning or deepening your journey — this sacred space is designed to support your unique rhythm.',
          price: '•For Indian Residents: ₹43,200, •For International Participants: $535',
          duration: '60 minutes',
          capacity: '15 students',
          schedule: 'Mon, Wed, Fri - 7:00 AM IST',
          level: 'All Levels',
          rating: 4.9,
          features: [
            '🔹 Personal attention',
            '🔹 Customized Sadhana',
            '🔹 Lifestyle alignment & inner clarity',
            '🔹 Flexible timing that fits your schedule',
            '🔹 Spiritual mentorship throughout'
          ],
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          joinLink: 'https://meet.google.com/abc-def-ghi',
          maxSeats: 15,
          availableSeats: 12
        },
        {
          id: '2',
          title: '12 Days Class',
          instructor: 'Sannidhya Krishna Das',
          description: 'Where Your Soul Expands And Your Body Gains A Rhythm\n\n60 minutes every day - 12 day in total.\n(60 minutes for yoga Session)',
          price: '₹7,500 / $120',
          duration: '60 minutes',
          capacity: '12 students',
          schedule: 'Daily for 12 days',
          level: 'Intermediate',
          rating: 5.0,
          features: [
            'Kundalini Shakthi Yoga',
            'Mana Mudra',
            'Hasta Mudra',
            'Bandha',
            'Chakra Healing',
            'Hatha Yoga Asanas',
            'Ashtanga Surya Namaskar A & B',
            'Fat reduce',
            'Shakthi Yoga Flows',
            'Jal Neti',
            'Pranayama'
          ],
          image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          joinLink: 'https://meet.google.com/xyz-abc-def',
          maxSeats: 12,
          availableSeats: 8
        }
      ];
      setClasses(defaultClasses);
      localStorage.setItem('onlineClasses', JSON.stringify(defaultClasses));
    }
  };

  const saveClasses = (updatedClasses: OnlineClass[]) => {
    console.log('AdminClasses: Saving classes:', updatedClasses);
    localStorage.setItem('onlineClasses', JSON.stringify(updatedClasses));
    setClasses(updatedClasses);
    
    // Dispatch multiple events to ensure all components update
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('classesUpdated', { detail: updatedClasses }));
    
    // Force a storage event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'onlineClasses',
      newValue: JSON.stringify(updatedClasses),
      oldValue: null,
      url: window.location.href
    }));
    
    console.log('AdminClasses: Events dispatched for classes update');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.instructor || !formData.price) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields."
      });
      return;
    }

    // Ensure available seats doesn't exceed max seats
    const maxSeats = formData.maxSeats || 15;
    const availableSeats = Math.min(formData.availableSeats || maxSeats, maxSeats);

    const classData: OnlineClass = {
      id: editingClass?.id || Date.now().toString(),
      title: formData.title || '',
      instructor: formData.instructor || '',
      classStarting: formData.classStarting || '',
      description: formData.description || '',
      price: formData.price || '',
      duration: formData.duration || '',
      capacity: formData.capacity || '',
      schedule: formData.schedule || '',
      level: formData.level || 'All Levels',
      rating: formData.rating || 5.0,
      features: formData.features || [],
      image: formData.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      joinLink: formData.joinLink || '',
      maxSeats: maxSeats,
      availableSeats: availableSeats
    };

    let updatedClasses: OnlineClass[];
    if (editingClass) {
      updatedClasses = classes.map(c => c.id === editingClass.id ? classData : c);
      toast({
        title: "Class Updated",
        description: "The class has been updated successfully."
      });
    } else {
      updatedClasses = [...classes, classData];
      toast({
        title: "Class Created",
        description: "New class has been created successfully."
      });
    }

    saveClasses(updatedClasses);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (classItem: OnlineClass) => {
    setEditingClass(classItem);
    setFormData({
      ...classItem,
      features: [...classItem.features],
      maxSeats: classItem.maxSeats || 15,
      availableSeats: classItem.availableSeats || classItem.maxSeats || 15
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedClasses = classes.filter(c => c.id !== id);
    saveClasses(updatedClasses);
    toast({
      title: "Class Deleted",
      description: "The class has been deleted successfully."
    });
  };

  const resetForm = () => {
    setEditingClass(null);
    setFormData({
      title: '',
      instructor: '',
      classStarting: '',
      description: '',
      price: '',
      duration: '',
      capacity: '',
      schedule: '',
      level: 'All Levels',
      rating: 5.0,
      features: [],
      image: '',
      joinLink: '',
      maxSeats: 15,
      availableSeats: 15
    });
    setNewFeature('');
  };

  const addFeature = () => {
    if (newFeature.trim() && formData.features) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    if (formData.features) {
      setFormData({
        ...formData,
        features: formData.features.filter((_, i) => i !== index)
      });
    }
  };

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Title</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Starting</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classItem) => (
            <TableRow key={classItem.id}>
              <TableCell className="font-medium">{classItem.title}</TableCell>
              <TableCell>{classItem.instructor}</TableCell>
              <TableCell className="text-sm">{classItem.classStarting || 'Not set'}</TableCell>
              <TableCell>{classItem.price}</TableCell>
              <TableCell>{classItem.duration}</TableCell>
              <TableCell>{classItem.level}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-yoga-sage" />
                  <span className={`text-sm ${(classItem.availableSeats || 0) <= 3 ? 'text-red-600 font-medium' : 'text-yoga-forest'}`}>
                    {classItem.availableSeats || 0}/{classItem.maxSeats || 15}
                  </span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">{classItem.schedule}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => handleEdit(classItem)}
                    variant="outline"
                    size="sm"
                    className="text-yoga-sage border-yoga-sage hover:bg-yoga-sage hover:text-white"
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(classItem.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <Card key={classItem.id} className="overflow-hidden">
          <div className="relative">
            <img 
              src={classItem.image} 
              alt={classItem.title}
              className="w-full h-32 object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
              {classItem.price}
            </div>
            <div className="absolute top-2 right-2 bg-yoga-sage/90 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{classItem.availableSeats || 0}/{classItem.maxSeats || 15}</span>
            </div>
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-yoga-forest">{classItem.title}</CardTitle>
            <p className="text-sm text-yoga-sage">with {classItem.instructor}</p>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm text-yoga-forest/80 line-clamp-2">{classItem.description}</p>
            
            <div className="text-xs space-y-1 text-yoga-forest/70">
              <div>Duration: {classItem.duration}</div>
              <div>Capacity: {classItem.capacity}</div>
              <div>Level: {classItem.level}</div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span className={`${(classItem.availableSeats || 0) <= 3 ? 'text-red-600 font-medium' : ''}`}>
                  Available: {classItem.availableSeats || 0} seats
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => handleEdit(classItem)}
                variant="outline"
                size="sm"
                className="text-yoga-sage border-yoga-sage hover:bg-yoga-sage hover:text-white"
              >
                <Edit size={14} className="mr-1" />
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(classItem.id)}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 size={14} className="mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-yoga-forest">Manage Classes</h2>
          <p className="text-yoga-forest/70">Create, edit, and manage online yoga classes ({classes.length} classes)</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-yoga-sage text-white' : ''}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-yoga-sage text-white' : ''}
            >
              Grid
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-yoga-sage hover:bg-yoga-forest">
                <Plus size={16} className="mr-2" />
                Add New Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingClass ? 'Edit Class' : 'Create New Class'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Class Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Morning Hatha Yoga"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructor">Instructor *</Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                      placeholder="e.g., Raai Kotha"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="classStarting">Class Starting</Label>
                  <Input
                    id="classStarting"
                    value={formData.classStarting}
                    onChange={(e) => setFormData({...formData, classStarting: e.target.value})}
                    placeholder="e.g., January 15, 2024 or Next Monday"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the class..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="e.g., ₹1,200"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="e.g., 60 minutes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                      placeholder="e.g., 15 students"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="schedule">Schedule</Label>
                    <Input
                      id="schedule"
                      value={formData.schedule}
                      onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                      placeholder="e.g., Mon, Wed, Fri - 7:00 AM IST"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Levels">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || 5.0})}
                      placeholder="5.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxSeats">Maximum Seats</Label>
                    <Input
                      id="maxSeats"
                      type="number"
                      min="1"
                      value={formData.maxSeats}
                      onChange={(e) => {
                        const maxSeats = parseInt(e.target.value) || 15;
                        setFormData({
                          ...formData, 
                          maxSeats,
                          availableSeats: Math.min(formData.availableSeats || maxSeats, maxSeats)
                        });
                      }}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="availableSeats">Available Seats</Label>
                    <Input
                      id="availableSeats"
                      type="number"
                      min="0"
                      max={formData.maxSeats || 15}
                      value={formData.availableSeats}
                      onChange={(e) => setFormData({...formData, availableSeats: parseInt(e.target.value) || 0})}
                      placeholder="15"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="joinLink">Join Link</Label>
                    <Input
                      id="joinLink"
                      value={formData.joinLink}
                      onChange={(e) => setFormData({...formData, joinLink: e.target.value})}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                </div>

                <div>
                  <Label>Features</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features?.map((feature, index) => (
                      <div key={index} className="bg-yoga-sage/10 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-yoga-sage hover:bg-yoga-forest">
                    <Save size={16} className="mr-2" />
                    {editingClass ? 'Update' : 'Create'} Class
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Classes Display */}
      {classes.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-yoga-forest/70">No classes created yet. Click "Add New Class" to get started.</p>
        </Card>
      ) : (
        viewMode === 'list' ? renderListView() : renderGridView()
      )}
    </div>
  );
};

export default AdminClasses;
