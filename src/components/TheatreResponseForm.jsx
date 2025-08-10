import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const TheatreResponseForm = ({ reviewId, onResponse, onCancel }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Please enter a response');
      return;
    }

    setIsSubmitting(true);

    try {
      await onResponse(reviewId, content.trim());
      setContent('');
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="theatre-response-form bg-gray-800 p-4 rounded-md border border-gray-600" style={{
      backgroundImage: 'url("/bg-4.svg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-yellow-400" />
        <span className="text-sm font-medium text-yellow-400">Respond to Review</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your response to this review..."
          maxLength={1000}
          required
          rows={4}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white resize-none"
        />
        <p className="text-xs text-gray-400">{content.length}/1000 characters</p>
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-semibold rounded-md transition-colors"
          >
            <Send size={16} />
            {isSubmitting ? 'Sending...' : 'Send Response'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-red-950 text-white font-semibold rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TheatreResponseForm; 