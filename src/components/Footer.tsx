import React from 'react';
import { Heart, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ExternalLink, MessageCircle, Globe, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  const exploreLinks = [{
    name: 'About Us',
    href: '/about-us'
  }, {
    name: 'Our Classes',
    href: '/classes'
  }, {
    name: 'Events',
    href: '/events'
  }, {
    name: 'Instructors',
    href: '/instructors'
  }, {
    name: 'Contact',
    href: '/contact'
  }, {
    name: 'Collaborations',
    href: '/collaborations'
  }];
  const contactCards = [{
    icon: MapPin,
    title: 'Visit Us',
    details: ['123 Wellness Street,', 'Mumbai 400001']
  }, {
    icon: Phone,
    title: 'Call Us',
    details: ['+918777816410']
  }, {
    icon: Mail,
    title: 'Email Us',
    details: ['info@shaktiyogaraai.com']
  }];
  const socialLinks = [{
    icon: Facebook,
    href: 'https://www.facebook.com/raaikotha/',
    label: 'Facebook'
  }, {
    icon: Instagram,
    href: 'https://www.instagram.com/raaikotha/?hl=en',
    label: 'Instagram'
  }, {
    icon: Twitter,
    href: 'https://twitter.com/raaikotha',
    label: 'Twitter'
  }, {
    icon: Youtube,
    href: 'https://www.youtube.com/c/RaaiKotha',
    label: 'YouTube'
  }];
  const legalLinks = [{
    name: 'Privacy Policy',
    href: '/privacy-policy'
  }, {
    name: 'Terms & Conditions',
    href: '/terms-conditions'
  }, {
    name: 'Refund Policy',
    href: '/refund-policy'
  }];
  return <footer className="bg-gradient-to-br from-yoga-sage to-yoga-forest text-white">
      {/* Header Section with Logo and Description */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16">
              <img src="/lovable-uploads/001a3e79-c253-4f0f-8842-ed9a57850b57.png" alt="Shakti Yoga Raai Logo" className="w-full h-full object-contain filter brightness-0 invert" />
            </div>
            <div className="text-left">
              <h3 className="text-4xl font-bold">Shakti Yoga Raai</h3>
              <p className="text-yoga-cream text-lg">Transform • Heal • Grow</p>
            </div>
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Transform your mind, body, and soul through authentic yoga practices. 
            Join our community of wellness seekers on a journey to inner peace and holistic health.
          </p>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Explore Section */}
          <div className="text-center lg:text-left">
            <h4 className="text-2xl font-bold mb-8">Explore</h4>
            <ul className="space-y-4">
              {exploreLinks.map(link => <li key={link.name}>
                  <Link to={link.href} className="text-white/80 hover:text-white transition-colors duration-300 text-lg">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Get In Touch Section */}
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-6">Get In Touch</h4>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-3">
              {contactCards.map(contact => {
              const IconComponent = contact.icon;
              return <div key={contact.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <IconComponent size={16} className="text-white" />
                    </div>
                    <h5 className="text-sm font-semibold mb-2">{contact.title}</h5>
                    
                  </div>;
            })}
            </div>
          </div>

          {/* Connect Section */}
          <div className="text-center lg:text-right">
            <h4 className="text-2xl font-bold mb-8">Connect</h4>
            
            {/* Follow Our Journey */}
            <div className="mb-8">
              <h5 className="text-lg font-semibold mb-4 text-yoga-cream">Follow Our Journey</h5>
              <div className="flex justify-center lg:justify-end space-x-3">
                {socialLinks.map(social => {
                const IconComponent = social.icon;
                return <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors" title={`Follow us on ${social.label}`}>
                      <IconComponent size={18} />
                    </a>;
              })}
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h5 className="text-lg font-semibold mb-4 text-yoga-cream">Legal</h5>
              <div className="space-y-2">
                {legalLinks.map(link => <Link key={link.name} to={link.href} className="block text-white/80 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-white/80">
              <span>© 2024 Shakti Yoga Raai • Dev Partner:</span>
              <a href="https://GorillaTechSolution.com" target="_blank" rel="noopener noreferrer" className="text-yoga-cream hover:text-white transition-colors underline">
                Gorilla Tech Solution
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;