
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClassesSection from '@/components/ClassesSection';

const Classes = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32">
        <ClassesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Classes;
