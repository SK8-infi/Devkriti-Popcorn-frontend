import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
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
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className="relative">
      {/* Fixed Background SVG */}
      <div 
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url("/bg-4.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen pt-20 py-10 px-4" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-7xl mx-auto" style={{ backgroundColor: 'transparent' }}>
        {/* Header Section */}
        <div className="text-center mb-10" style={{ backgroundColor: 'transparent' }}>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, Times, serif', color: '#FFD6A0', backgroundColor: 'transparent' }}>
            Contact Us
          </h1>
          <p className="text-gray-300 mb-6">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="flex justify-center mb-16">
          {/* Contact Form - Takes full width */}
          <div className="w-full max-w-4xl">
            <div 
              className="p-6 rounded-xl border border-gray-600/50 backdrop-blur-sm relative overflow-hidden max-w-2xl mx-auto mt-12"
                              style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
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
                    className="w-full font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFD6A0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                        e.target.style.border = '1px solid rgba(255, 214, 160, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                        e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
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
                      Thank you! Your message has been sent successfully. We will get back to you soon!
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="bg-red-900/20 border border-red-600/50 text-red-400 p-4 rounded-lg flex items-center gap-2">
                      <MessageCircle size={20} />
                      Failed to send message. Please try again later or contact us directly.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 