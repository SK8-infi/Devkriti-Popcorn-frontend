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
    <div className="review-form bg-black text-white p-6 rounded-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-6">{initialData ? 'Edit Review' : 'Write a Review'}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div className="rating-section">
          <label className="block text-sm font-medium mb-2">Rating:</label>
          <div className="stars flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-colors ${
                  star <= rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-400 hover:text-yellow-300'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {rating > 0 && `${rating} out of 5 stars`}
          </p>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-2">Review Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            maxLength={100}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white"
          />
          <p className="text-xs text-gray-400 mt-1">{title.length}/100 characters</p>
        </div>

        {/* Content */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-2">Review:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your detailed experience..."
            maxLength={1000}
            required
            rows={6}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{content.length}/1000 characters</p>
        </div>

        {/* Pros */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-2">Pros:</label>
          {pros.map((pro, index) => (
            <div key={index} className="pros-cons-item flex gap-2 mb-2">
              <input
                type="text"
                value={pro}
                onChange={(e) => updatePro(index, e.target.value)}
                placeholder="What did you like?"
                maxLength={200}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white"
              />
              {pros.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removePro(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addPro} 
            className="add-btn flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            <Plus size={16} /> Add Pro
          </button>
        </div>

        {/* Cons */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-2">Cons:</label>
          {cons.map((con, index) => (
            <div key={index} className="pros-cons-item flex gap-2 mb-2">
              <input
                type="text"
                value={con}
                onChange={(e) => updateCon(index, e.target.value)}
                placeholder="What could be improved?"
                maxLength={200}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white"
              />
              {cons.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeCon(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addCon} 
            className="add-btn flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            <Plus size={16} /> Add Con
          </button>
        </div>

        {/* Visit Date */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-2">Visit Date:</label>
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 text-white"
          />
        </div>

        <div className="form-actions flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-semibold py-3 px-6 rounded-md transition-colors"
          >
            {isSubmitting ? 'Submitting...' : (initialData ? 'Update Review' : 'Submit Review')}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="cancel-btn flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TheatreReviewForm; 