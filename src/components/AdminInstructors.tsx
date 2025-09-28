import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';
import { type InstructorBase } from '@/hooks/useInstructorsData';

interface Instructor extends InstructorBase {}

const AdminInstructors = () => {
  const { toast } = useToast();
  
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Load instructors from localStorage on component mount and whenever localStorage changes
  useEffect(() => {
    const loadInstructors = () => {
      const storedInstructors = localStorage.getItem('instructorsData');
      if (storedInstructors) {
        try {
          const parsed = JSON.parse(storedInstructors);
          console.log('Loaded instructors from localStorage:', parsed);
          setInstructors(parsed);
        } catch (error) {
          console.error('Error parsing instructors data:', error);
          // If there's an error, load default instructors
          const defaultInstructors = [
            {
              id: '1',
              name: 'Raai Kotha',
              title: 'Lead Instructor & Founder',
              specialization: 'Hatha & Ashtanga Yoga',
              experience: '15 years',
              certifications: ['RYT 500', 'Yoga Alliance Certified', 'Meditation Teacher'],
              rating: 4.9,
              students: '500+',
              description: 'Raai Kotha founded Shakti Yoga Raai with a vision to bring authentic yoga practices to modern practitioners. Her gentle yet powerful teaching style has transformed hundreds of lives.',
              image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              email: 'sushmita@shaktiyogaraai.com',
              phone: '+91 87778 16410'
            },
            {
              id: '2',
              name: 'SANNIDHYA KRISHNA DAS',
              title: 'Senior Vinyasa Instructor',
              specialization: 'Vinyasa Flow & Power Yoga',
              experience: '10 years',
              certifications: ['RYT 300', 'Advanced Vinyasa', 'Anatomy Specialist'],
              rating: 4.8,
              students: '350+',
              description: 'Sannidhya brings dynamic energy to his classes, combining traditional sequences with innovative flows. His expertise in anatomy ensures safe and effective practice.',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              email: 'sannidhya@shaktiyogaraai.com'
            },
            {
              id: '3',
              name: 'SHIVAM MISRA',
              title: 'Therapeutic Yoga Specialist',
              specialization: 'Restorative & Prenatal Yoga',
              experience: '12 years',
              certifications: ['RYT 500', 'Prenatal Certified', 'Yoga Therapy'],
              rating: 5.0,
              students: '400+',
              description: 'With a background in physiotherapy, Shivam specializes in therapeutic applications of yoga, helping students heal and restore their bodies naturally.',
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              email: 'shivam@shaktiyogaraai.com'
            }
          ];
          setInstructors(defaultInstructors);
          localStorage.setItem('instructorsData', JSON.stringify(defaultInstructors));
        }
      } else {
        // If no stored data, load default instructors with all 3 instructors
        const defaultInstructors = [
          {
            id: '1',
            name: 'Raai Kotha',
            title: 'Lead Instructor & Founder',
            specialization: 'Hatha & Ashtanga Yoga',
            experience: '15 years',
            certifications: ['RYT 500', 'Yoga Alliance Certified', 'Meditation Teacher'],
            rating: 4.9,
            students: '500+',
            description: 'Raai Kotha founded Shakti Yoga Raai with a vision to bring authentic yoga practices to modern practitioners. Her gentle yet powerful teaching style has transformed hundreds of lives.',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            email: 'sushmita@shaktiyogaraai.com',
            phone: '+91 87778 16410'
          },
          {
            id: '2',
            name: 'SANNIDHYA KRISHNA DAS',
            title: 'Senior Vinyasa Instructor',
            specialization: 'Vinyasa Flow & Power Yoga',
            experience: '10 years',
            certifications: ['RYT 300', 'Advanced Vinyasa', 'Anatomy Specialist'],
            rating: 4.8,
            students: '350+',
            description: 'Sannidhya brings dynamic energy to his classes, combining traditional sequences with innovative flows. His expertise in anatomy ensures safe and effective practice.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            email: 'sannidhya@shaktiyogaraai.com'
          },
          {
            id: '3',
            name: 'SHIVAM MISRA',
            title: 'Therapeutic Yoga Specialist',
            specialization: 'Restorative & Prenatal Yoga',
            experience: '12 years',
            certifications: ['RYT 500', 'Prenatal Certified', 'Yoga Therapy'],
            rating: 5.0,
            students: '400+',
            description: 'With a background in physiotherapy, Shivam specializes in therapeutic applications of yoga, helping students heal and restore their bodies naturally.',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            email: 'shivam@shaktiyogaraai.com'
          }
        ];
        setInstructors(defaultInstructors);
        localStorage.setItem('instructorsData', JSON.stringify(defaultInstructors));
      }
    };

    loadInstructors();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'instructorsData') {
        loadInstructors();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSave = () => {
    localStorage.setItem('instructorsData', JSON.stringify(instructors));
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('instructorsDataUpdated'));
    toast({
      title: "Instructors Updated",
      description: "The instructors data has been updated successfully.",
    });
  };

  const handleCreateNew = () => {
    const newInstructor: Instructor = {
      id: Date.now().toString(),
      name: '',
      title: '',
      specialization: '',
      experience: '',
      certifications: [],
      rating: 5.0,
      students: '0',
      description: '',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      email: '',
      phone: ''
    };
    setEditingInstructor(newInstructor);
    setIsCreating(true);
  };

  const handleEdit = (instructor: Instructor) => {
    setEditingInstructor({ ...instructor });
    setIsCreating(false);
  };

  const handleSaveInstructor = () => {
    if (!editingInstructor) return;

    if (isCreating) {
      const updatedInstructors = [...instructors, editingInstructor];
      setInstructors(updatedInstructors);
      localStorage.setItem('instructorsData', JSON.stringify(updatedInstructors));
    } else {
      const updatedInstructors = instructors.map(inst => 
        inst.id === editingInstructor.id ? editingInstructor : inst
      );
      setInstructors(updatedInstructors);
      localStorage.setItem('instructorsData', JSON.stringify(updatedInstructors));
    }
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('instructorsDataUpdated'));
    
    setEditingInstructor(null);
    setIsCreating(false);
    
    toast({
      title: "Instructor Saved",
      description: `Instructor ${isCreating ? 'created' : 'updated'} successfully.`,
    });
  };

  const handleDelete = (id: string) => {
    const updatedInstructors = instructors.filter(inst => inst.id !== id);
    setInstructors(updatedInstructors);
    localStorage.setItem('instructorsData', JSON.stringify(updatedInstructors));
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('instructorsDataUpdated'));
    
    toast({
      title: "Instructor Deleted",
      description: "Instructor has been deleted successfully.",
    });
  };

  const updateInstructorField = (field: keyof Instructor, value: any) => {
    if (!editingInstructor) return;
    setEditingInstructor(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addCertification = () => {
    if (!editingInstructor) return;
    setEditingInstructor(prev => prev ? {
      ...prev,
      certifications: [...prev.certifications, 'New Certification']
    } : null);
  };

  const updateCertification = (index: number, value: string) => {
    if (!editingInstructor) return;
    setEditingInstructor(prev => prev ? {
      ...prev,
      certifications: prev.certifications.map((cert, i) => i === index ? value : cert)
    } : null);
  };

  const removeCertification = (index: number) => {
    if (!editingInstructor) return;
    setEditingInstructor(prev => prev ? {
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    } : null);
  };

  if (editingInstructor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-yoga-forest">
            {isCreating ? 'Create New Instructor' : 'Edit Instructor'}
          </h2>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setEditingInstructor(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveInstructor} className="bg-yoga-sage hover:bg-yoga-forest">
              <Save size={16} className="mr-2" />
              Save Instructor
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingInstructor.name}
                  onChange={(e) => updateInstructorField('name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingInstructor.title}
                  onChange={(e) => updateInstructorField('title', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={editingInstructor.specialization}
                  onChange={(e) => updateInstructorField('specialization', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={editingInstructor.experience}
                  onChange={(e) => updateInstructorField('experience', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={editingInstructor.rating}
                  onChange={(e) => updateInstructorField('rating', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="students">Students Count</Label>
                <Input
                  id="students"
                  value={editingInstructor.students}
                  onChange={(e) => updateInstructorField('students', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingInstructor.email || ''}
                  onChange={(e) => updateInstructorField('email', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editingInstructor.phone || ''}
                  onChange={(e) => updateInstructorField('phone', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={editingInstructor.image}
                  onChange={(e) => updateInstructorField('image', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingInstructor.description}
                  onChange={(e) => updateInstructorField('description', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <Label>Certifications</Label>
              <Button type="button" onClick={addCertification} size="sm">
                <Plus size={16} className="mr-1" />
                Add Certification
              </Button>
            </div>
            <div className="space-y-2">
              {editingInstructor.certifications.map((cert, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={cert}
                    onChange={(e) => updateCertification(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCertification(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-yoga-forest">
          Manage Instructors ({instructors.length} total)
        </h2>
        <Button onClick={handleCreateNew} className="bg-yoga-sage hover:bg-yoga-forest">
          <Plus size={16} className="mr-2" />
          Add New Instructor
        </Button>
      </div>

      <div className="grid gap-6">
        {instructors.map((instructor) => (
          <Card key={instructor.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex space-x-4">
                <img 
                  src={instructor.image} 
                  alt={instructor.name}
                  className="w-16 h-16 object-cover rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold text-yoga-forest">{instructor.name}</h3>
                  <p className="text-yoga-terracotta font-medium">{instructor.title}</p>
                  <p className="text-yoga-forest/70 text-sm">{instructor.specialization}</p>
                  <p className="text-yoga-forest/70 text-sm">{instructor.experience} • {instructor.students} students • {instructor.rating}⭐</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(instructor)}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(instructor.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </div>
            </div>
            
            <p className="text-yoga-forest/80 mt-4 leading-relaxed">{instructor.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {instructor.certifications.map((cert, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-yoga-sage/20 text-yoga-forest text-xs rounded border border-yoga-sage/30"
                >
                  {cert}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminInstructors;
