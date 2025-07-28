import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Star, Heart } from 'lucide-react';
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
    <div className="contact-container">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get in Touch</h1>
          <p className="contact-hero-subtitle">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="contact-main">
        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h2 className="contact-section-title">Contact Information</h2>
            <div className="contact-info-grid">
              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Mail size={24} />
                </div>
                <div className="contact-info-content">
                  <h3>Email</h3>
                  <p>support@popcorn.com</p>
                  <p>info@popcorn.com</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Phone size={24} />
                </div>
                <div className="contact-info-content">
                  <h3>Phone</h3>
                  <p>+91 62629 51712</p>
                  <p>+91 83184 07289</p>
                  <p>+91 78934 55768</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <MapPin size={24} />
                </div>
                <div className="contact-info-content">
                  <h3>Address</h3>
                  <p>ABV-IIITM GWALIOR</p>
                  <p>Morena Link Road, 474015</p>
                  <p>Madhya Pradesh, India</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Clock size={24} />
                </div>
                <div className="contact-info-content">
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                  <p>Saturday - Sunday: 10:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2 className="contact-section-title">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="What is this about?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
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
                <div className="success-message">
                  <MessageCircle size={20} />
                  Thank you! Your message has been sent successfully.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="contact-section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I book tickets?</h3>
              <p>Browse our movies, select your preferred showtime, choose your seats, and complete the payment process. You'll need to create an account to book tickets.</p>
            </div>
            <div className="faq-item">
              <h3>Can I cancel my booking?</h3>
              <p>Yes, you can cancel your booking up to 2 hours before the showtime. Please contact our support team for assistance.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer refunds?</h3>
              <p>We offer full refunds for cancellations made at least 2 hours before the showtime. Refunds are processed within 3-5 business days.</p>
            </div>
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept all major credit cards, debit cards, and digital wallets including PayPal, Apple Pay, and Google Pay.</p>
            </div>
            <div className="faq-item">
              <h3>Are there any booking fees?</h3>
              <p>We charge a small convenience fee of $2.50 per ticket to cover processing and service costs.</p>
            </div>
            <div className="faq-item">
              <h3>How do I change my location?</h3>
              <p>Click on the location icon in the navigation bar to select your preferred city. This will show you movies and theatres in your area.</p>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="social-section">
          <div className="social-content">
            <div className="social-info">
              <h2>Stay Connected</h2>
              <p>Follow us on social media for the latest movie updates, exclusive offers, and behind-the-scenes content.</p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <Star size={20} />
                  <span>Facebook</span>
                </a>
                <a href="#" className="social-link">
                  <Star size={20} />
                  <span>Twitter</span>
                </a>
                <a href="#" className="social-link">
                  <Star size={20} />
                  <span>Instagram</span>
                </a>
                <a href="#" className="social-link">
                  <Star size={20} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
            <div className="newsletter-signup">
              <h3>Newsletter</h3>
              <p>Subscribe to our newsletter for movie updates and exclusive offers.</p>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">
                  <Heart size={16} />
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 