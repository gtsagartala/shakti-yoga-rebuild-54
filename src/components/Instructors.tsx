import React from 'react';
import { Award, Star, Users, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useInstructorsData } from '@/hooks/useInstructorsData';
const Instructors = () => {
  const navigate = useNavigate();
  const instructorsData = useInstructorsData();

  // Convert stored instructors to display format and add "All Instructors" card
  const instructors = [...instructorsData.slice(0, 3).map(instructor => ({
    name: instructor.name,
    title: instructor.title,
    specialization: instructor.specialization,
    experience: instructor.experience,
    certifications: instructor.certifications,
    rating: instructor.rating,
    students: instructor.students,
    description: instructor.description,
    image: '👩‍🏫' // Default emoji for home screen display
  })), {
    name: 'All Instructors',
    title: 'Complete Teaching Team',
    specialization: 'Comprehensive Yoga Education',
    experience: 'Collective 50+ years',
    certifications: ['International Certifications', 'Advanced Training', 'Continuing Education'],
    rating: 4.9,
    students: '1000+',
    description: 'Discover our complete team of certified yoga instructors, each bringing unique expertise and passion to create a comprehensive learning experience for all levels.',
    image: '🧘‍♂️'
  }];
  const handleViewAllInstructors = () => {
    navigate('/instructors');
  };
  const handleEditInstructors = () => {
    navigate('/admin');
    setTimeout(() => {
      const event = new CustomEvent('switchToInstructorsTab');
      window.dispatchEvent(event);
    }, 100);
  };

  // Check if user is logged in as admin
  const currentUser = localStorage.getItem('currentUser');
  const isAdmin = currentUser ? JSON.parse(currentUser).role === 'admin' : false;
  return <section id="instructors" className="py-20 bg-gradient-to-br from-yoga-sand to-yoga-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-yoga-forest">
              Meet Our Instructors
            </h2>
            {isAdmin && <Button variant="outline" size="sm" onClick={handleEditInstructors} className="text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white">
                <Edit size={16} className="mr-1" />
                Edit All
              </Button>}
          </div>
          <p className="text-xl text-yoga-forest/80 max-w-3xl mx-auto leading-relaxed">
            Our team of certified and experienced yoga instructors are passionate about guiding you 
            on your wellness journey with wisdom, compassion, and expertise.
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {instructors.map((instructor, index) => <div key={instructor.name} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              {/* Edit button for individual instructor - only show for admin and not for "All Instructors" card */}
              {isAdmin && instructor.name !== 'All Instructors' && <Button variant="outline" size="sm" onClick={handleEditInstructors} className="absolute top-4 right-4 text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white">
                  <Edit size={14} />
                </Button>}

              {/* Header */}
              <div className="flex items-start space-x-6 mb-6">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-yoga-sage to-yoga-forest rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  {instructor.image}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-2xl font-bold text-yoga-forest">
                      {instructor.name}
                    </h3>
                    {/* Edit button for All Instructors card - only show for admin */}
                    {instructor.name === 'All Instructors' && isAdmin && <Button variant="outline" size="sm" onClick={handleEditInstructors} className="text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white">
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>}
                  </div>
                  <p className="text-yoga-terracotta font-medium mb-2">
                    {instructor.title}
                  </p>
                  <p className="text-yoga-forest/70 text-sm mb-3">
                    Specializes in {instructor.specialization}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yoga-terracotta fill-current" />
                      <span className="font-medium text-yoga-forest">{instructor.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} className="text-yoga-sage" />
                      <span className="text-yoga-forest/70">{instructor.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award size={16} className="text-yoga-terracotta" />
                      <span className="text-yoga-forest/70">{instructor.experience}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-yoga-forest/80 leading-relaxed mb-6">
                {instructor.description}
              </p>

              {/* Certifications */}
              <div className="space-y-3">
                <h4 className="font-semibold text-yoga-forest">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {instructor.certifications.map(cert => <span key={cert} className="px-3 py-1 bg-yoga-sage/20 text-yoga-forest text-sm rounded-full border border-yoga-sage/30">
                      {cert}
                    </span>)}
                </div>
              </div>

              {/* View All Instructors Button - only for the "All Instructors" card */}
              {instructor.name === 'All Instructors' && <div className="mt-6">
                  <Button className="w-full bg-yoga-forest hover:bg-yoga-sage text-white" onClick={handleViewAllInstructors}>
                    View All Instructors
                  </Button>
                </div>}
            </div>)}
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-16">
          
        </div>
      </div>
    </section>;
};
export default Instructors;