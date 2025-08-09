import React, { useState } from 'react';
import { Star, Plus, X } from 'lucide-react';

const TheatreReviewForm = ({ theatreId, onSubmit, onCancel, initialData }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [pros, setPros] = useState(initialData?.pros?.length ? initialData.pros : ['']);
  const [cons, setCons] = useState(initialData?.cons?.length ? initialData.cons : ['']);
  const [visitDate, setVisitDate] = useState(initialData?.visitDate ? new Date(initialData.visitDate).toISOString().split('T')[0] : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!title.trim()) {
      alert('Please enter a review title');
      return;
    }

    if (!content.trim()) {
      alert('Please enter review content');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        theatreId,
        rating,
        title: title.trim(),
        content: content.trim(),
        pros: pros.filter(p => p.trim()),
        cons: cons.filter(c => c.trim()),
        visitDate: visitDate || new Date().toISOString().split('T')[0]
      };

      await onSubmit(reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPro = () => setPros([...pros, '']);
  const removePro = (index) => setPros(pros.filter((_, i) => i !== index));
  const updatePro = (index, value) => {
    const newPros = [...pros];
    newPros[index] = value;
    setPros(newPros);
  };

  const addCon = () => setCons([...cons, '']);
  const removeCon = (index) => setCons(cons.filter((_, i) => i !== index));
  const updateCon = (index, value) => {
    const newCons = [...cons];
    newCons[index] = value;
    setCons(newCons);
  };

  return (
    <div className="review-form text-white p-3 rounded-lg max-w-lg mx-auto" style={{
      background: 'transparent',
      marginTop: '80px',
      overflow: 'hidden',
      zIndex: 9999,
      position: 'relative'
    }}>
      <h3 className="text-lg font-bold mb-3">{initialData ? 'Edit Review' : 'Write a Review'}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Rating */}
        <div className="rating-section">
          <label className="block text-xs font-medium mb-1">Rating:</label>
          <div className="stars flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-5 h-5 cursor-pointer transition-colors ${
                  star <= rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-400 hover:text-yellow-300'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {rating > 0 && `${rating} out of 5 stars`}
          </p>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="block text-xs font-medium mb-1">Review Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            maxLength={100}
            required
            className="w-full px-3 py-1 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">{title.length}/100 characters</p>
        </div>

        {/* Content */}
        <div className="form-group">
          <label className="block text-xs font-medium mb-1">Review:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your detailed experience..."
            maxLength={1000}
            required
            rows={3}
            className="w-full px-3 py-1 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white resize-none text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">{content.length}/1000 characters</p>
        </div>

        {/* Pros */}
        <div className="form-group">
          <label className="block text-xs font-medium mb-1">Pros:</label>
          {pros.map((pro, index) => (
            <div key={index} className="pros-cons-item flex gap-2 mb-1">
              <input
                type="text"
                value={pro}
                onChange={(e) => updatePro(index, e.target.value)}
                placeholder="What did you like?"
                maxLength={200}
                className="flex-1 px-3 py-1 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white text-sm"
              />
              {pros.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removePro(index)}
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addPro} 
            className="add-btn flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-xs"
          >
            <Plus size={12} /> Add Pro
          </button>
        </div>

        {/* Cons */}
        <div className="form-group">
          <label className="block text-xs font-medium mb-1">Cons:</label>
          {cons.map((con, index) => (
            <div key={index} className="pros-cons-item flex gap-2 mb-1">
              <input
                type="text"
                value={con}
                onChange={(e) => updateCon(index, e.target.value)}
                placeholder="What could be improved?"
                maxLength={200}
                className="flex-1 px-3 py-1 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white text-sm"
              />
              {cons.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeCon(index)}
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addCon} 
            className="add-btn flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-xs"
          >
            <Plus size={12} /> Add Con
          </button>
        </div>

        {/* Visit Date */}
        <div className="form-group">
          <label className="block text-xs font-medium mb-1">Visit Date:</label>
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white text-sm"
          />
        </div>

        <div className="form-actions flex gap-3 pt-1">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-semibold py-1 px-4 rounded-md transition-colors text-sm"
          >
            {isSubmitting ? 'Submitting...' : (initialData ? 'Update Review' : 'Submit Review')}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="cancel-btn flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-4 rounded-md transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TheatreReviewForm; 