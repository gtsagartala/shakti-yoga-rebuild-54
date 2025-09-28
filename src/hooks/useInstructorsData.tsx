import { useState, useEffect } from 'react';

export interface InstructorBase {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experience: string;
  certifications: string[];
  rating: number;
  students: string;
  description: string;
  image: string;
  email?: string;
  phone?: string;
}

const defaultInstructors: InstructorBase[] = [
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

export const useInstructorsData = () => {
  const [instructors, setInstructors] = useState<InstructorBase[]>(defaultInstructors);

  useEffect(() => {
    const loadInstructors = () => {
      const storedInstructors = localStorage.getItem('instructorsData');
      if (storedInstructors) {
        try {
          const parsed = JSON.parse(storedInstructors);
          console.log('useInstructorsData: Loading instructors from localStorage:', parsed);
          setInstructors(parsed);
        } catch (error) {
          console.error('Error parsing instructors data:', error);
          setInstructors(defaultInstructors);
        }
      } else {
        // Initialize with default instructors if no data exists
        setInstructors(defaultInstructors);
        localStorage.setItem('instructorsData', JSON.stringify(defaultInstructors));
      }
    };

    loadInstructors();

    // Listen for custom events when instructors data is updated
    const handleInstructorsUpdate = () => {
      console.log('useInstructorsData: Received instructorsDataUpdated event');
      loadInstructors();
    };

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'instructorsData') {
        console.log('useInstructorsData: Storage change detected');
        loadInstructors();
      }
    };

    window.addEventListener('instructorsDataUpdated', handleInstructorsUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('instructorsDataUpdated', handleInstructorsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return instructors;
};
