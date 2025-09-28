import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, Star, Users, Mail, Phone, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useInstructorsData, type InstructorBase } from '@/hooks/useInstructorsData';
import { useScrollToTop } from '@/hooks/useScrollToTop';
export interface Instructor extends InstructorBase {}
const Instructors = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const instructors = useInstructorsData();
  const handleEditInstructor = () => {
    navigate('/admin');
    setTimeout(() => {
      const event = new CustomEvent('switchToInstructorsTab');
      window.dispatchEvent(event);
    }, 100);
  };

  // Check if user is logged in as admin
  const currentUser = localStorage.getItem('currentUser');
  const isAdmin = currentUser ? JSON.parse(currentUser).role === 'admin' : false;
  return <div className="min-h-screen bg-yoga-cream">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yoga-forest to-yoga-sage text-white text-center py-0">
        <div className="container mx-auto px-4 my-[144px]">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-5xl font-bold">Meet Our Instructors</h1>
            {isAdmin && <Button variant="outline" onClick={handleEditInstructor} className="border-white text-white hover:bg-white hover:text-yoga-forest">
                <Edit size={16} className="mr-2" />
                Edit All
              </Button>}
          </div>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Our team of certified and experienced yoga instructors are passionate about guiding you 
            on your wellness journey with wisdom, compassion, and expertise.
          </p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => <Card key={instructor.id} className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 relative">
                {/* Edit button for individual instructor - only show for admin */}
                {isAdmin && <Button variant="outline" size="sm" onClick={handleEditInstructor} className="absolute top-4 right-4 text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white">
                    <Edit size={14} />
                  </Button>}

                {/* Instructor Image */}
                <div className="text-center mb-6">
                  <img src={instructor.image} alt={instructor.name} className="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow-lg" />
                  <h3 className="text-2xl font-bold text-yoga-forest mb-1">{instructor.name}</h3>
                  <p className="text-yoga-terracotta font-medium mb-2">{instructor.title}</p>
                  <p className="text-yoga-forest/70 text-sm">Specializes in {instructor.specialization}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center space-x-4 text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yoga-terracotta fill-current" />
                    <span className="font-medium text-yoga-forest">{instructor.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} className="text-yoga-sage" />
                    <span className="text-yoga-forest/70">{instructor.students}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award size={16} className="text-yoga-terracotta" />
                    <span className="text-yoga-forest/70">{instructor.experience}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-yoga-forest/80 leading-relaxed mb-6 text-center">
                  {instructor.description}
                </p>

                {/* Certifications */}
                <div className="mb-6">
                  <h4 className="font-semibold text-yoga-forest mb-3 text-center">Certifications</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {instructor.certifications.map(cert => <span key={cert} className="px-3 py-1 bg-yoga-sage/20 text-yoga-forest text-sm rounded-full border border-yoga-sage/30">
                        {cert}
                      </span>)}
                  </div>
                </div>

                {/* Contact Info */}
                {(instructor.email || instructor.phone) && <div className="border-t pt-4 space-y-2">
                    {instructor.email && <div className="flex items-center justify-center space-x-2 text-sm text-yoga-forest/70">
                        <Mail size={14} />
                        <span>{instructor.email}</span>
                      </div>}
                    {instructor.phone && <div className="flex items-center justify-center space-x-2 text-sm text-yoga-forest/70">
                        <Phone size={14} />
                        <span>{instructor.phone}</span>
                      </div>}
                  </div>}
              </Card>)}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Card className="bg-gradient-to-r from-yoga-forest to-yoga-sage rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Passionate About Teaching Yoga?</h3>
            <p className="text-xl mb-6 opacity-90">
              We're always looking for certified yoga instructors who share our vision of 
              authentic, transformative yoga practice. Join our team!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-yoga-forest hover:bg-yoga-cream">
                View Open Positions
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-yoga-forest">
                Submit Application
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Instructors;