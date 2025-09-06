import React, { useState, useEffect } from 'react';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submissions, setSubmissions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);

  // Load existing submissions from localStorage
  useEffect(() => {
    const savedSubmissions = localStorage.getItem('contactSubmissions');
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newSubmission = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const updatedSubmissions = [...submissions, newSubmission];
    localStorage.setItem('contactSubmissions', JSON.stringify(updatedSubmissions));
    setSubmissions(updatedSubmissions);
    
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });

    // Reset submission status after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const clearSubmissions = () => {
    if (window.confirm('Are you sure you want to clear all submissions?')) {
      localStorage.removeItem('contactSubmissions');
      setSubmissions([]);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Timestamp'],
      ...submissions.map(sub => [
        `"${sub.name}"`,
        `"${sub.email}"`,
        `"${sub.phone}"`,
        `"${sub.subject}"`,
        `"${sub.message.replace(/"/g, '""')}"`,
        `"${sub.timestamp}"`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contact_submissions.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="contact-form-container">
      <h2>Contact Us</h2>
      
      {isSubmitted && (
        <div className="success-message">
          ✅ Thank you for your message! We'll get back to you soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number (optional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="What is this regarding?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
            placeholder="Type your message here..."
          />
        </div>

        <button type="submit" className="submit-btn">
          📧 Send Message
        </button>
      </form>

      {/* Admin controls */}
      <div className="admin-controls">
        <button 
          onClick={() => setShowSubmissions(!showSubmissions)} 
          className="toggle-btn"
        >
          {showSubmissions ? '👁️ Hide' : '👁️ Show'} Submissions ({submissions.length})
        </button>
        
        {submissions.length > 0 && (
          <>
            <button onClick={exportToCSV} className="export-btn">
              📊 Export to CSV
            </button>
            <button onClick={clearSubmissions} className="clear-btn">
              🗑️ Clear All
            </button>
          </>
        )}
      </div>

      {/* Submissions section */}
      {showSubmissions && (
        <div className="submissions-section">
          <h3>📋 Submitted Forms ({submissions.length})</h3>
          
          {submissions.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            <div className="submissions-list">
              {submissions.map((submission) => (
                <div key={submission.id} className="submission-card">
                  <h4>{submission.name} - {submission.subject}</h4>
                  <p><strong>📧 Email:</strong> {submission.email}</p>
                  {submission.phone && <p><strong>📞 Phone:</strong> {submission.phone}</p>}
                  <p><strong>💬 Message:</strong> {submission.message}</p>
                  <small>⏰ {new Date(submission.timestamp).toLocaleString()}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactForm;