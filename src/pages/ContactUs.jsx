import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Star, Heart } from 'lucide-react';
import GlareHover from '../components/GlareHover';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black pt-20 py-10 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, Times, serif', color: '#FFD6A0' }}>
            Contact Us
          </h1>
          <p className="text-gray-300 mb-6">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid xl:grid-cols-3 gap-8 mb-16">
          {/* Contact Information - Takes 1 column */}
          <div className="xl:col-span-1">
            <h2 className="text-2xl font-bold mb-6" style={{ 
              color: '#FFD6A0'
            }}>
              Get in Touch
            </h2>
            <div className="space-y-6">
              <div 
                className="p-6 rounded-2xl border border-gray-600/50 hover:border-primary/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl text-black" style={{ backgroundColor: '#FFD6A0' }}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">Email</h3>
                    <p className="text-gray-300">support@popcorn.com</p>
                    <p className="text-gray-300">info@popcorn.com</p>
                  </div>
                </div>
              </div>

              <div 
                className="p-6 rounded-2xl border border-gray-600/50 hover:border-primary/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl text-black" style={{ backgroundColor: '#FFD6A0' }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">Phone</h3>
                    <p className="text-gray-300">+91 62629 51712</p>
                    <p className="text-gray-300">+91 83184 07289</p>
                    <p className="text-gray-300">+91 78934 55768</p>
                  </div>
                </div>
              </div>

              <div 
                className="p-6 rounded-2xl border border-gray-600/50 hover:border-primary/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl text-black" style={{ backgroundColor: '#FFD6A0' }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">Address</h3>
                    <p className="text-gray-300">ABV-IIITM GWALIOR</p>
                    <p className="text-gray-300">Morena Link Road, 474015</p>
                    <p className="text-gray-300">Madhya Pradesh, India</p>
                  </div>
                </div>
              </div>

              <div 
                className="p-6 rounded-2xl border border-gray-600/50 hover:border-primary/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl text-black" style={{ backgroundColor: '#FFD6A0' }}>
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">Business Hours</h3>
                    <p className="text-gray-300">Monday - Friday: 9:00 AM - 8:00 PM</p>
                    <p className="text-gray-300">Saturday - Sunday: 10:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Takes 2 columns */}
          <div className="xl:col-span-2">
            <div 
              className="p-6 rounded-xl border border-gray-600/50 backdrop-blur-sm relative overflow-hidden max-w-2xl mx-auto mt-12"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              }}
            >
              {/* Form Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6" style={{ 
                  color: '#FFD6A0'
                }}>
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full bg-black border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email address"
                        className="w-full bg-black border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="subject" className="block text-gray-300 text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What is this about?"
                      className="w-full bg-black border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="block text-gray-300 text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      placeholder="Tell us more about your inquiry..."
                      className="w-full bg-black border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full text-black font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{
                      backgroundColor: '#FFD6A0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.target.style.backgroundColor = '#E6C090';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.target.style.backgroundColor = '#FFD6A0';
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="bg-green-900/20 border border-green-600/50 text-green-400 p-4 rounded-lg flex items-center gap-2">
                      <MessageCircle size={20} />
                      Thank you! Your message has been sent successfully.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ContactUs; 