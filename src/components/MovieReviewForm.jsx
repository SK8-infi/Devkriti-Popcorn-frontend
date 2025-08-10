import React, { useState } from 'react';
import { Star, Plus, X, MessageSquare } from 'lucide-react';

const MovieReviewForm = ({ movieId, onSubmit, onCancel, initialData }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [pros, setPros] = useState(initialData?.pros?.length ? initialData.pros : ['']);
  const [cons, setCons] = useState(initialData?.cons?.length ? initialData.cons : ['']);
  const [watchDate, setWatchDate] = useState(initialData?.watchDate ? new Date(initialData.watchDate).toISOString().split('T')[0] : '');
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
        movieId,
        rating,
        title: title.trim(),
        content: content.trim(),
        pros: pros.filter(p => p.trim()),
        cons: cons.filter(c => c.trim()),
        watchDate: watchDate || new Date().toISOString().split('T')[0]
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
    <div className="bg-black/95 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-gray-800/50" style={{ transform: 'scale(0.7)', transformOrigin: 'center center', marginTop: '50px' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-black" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white" style={{fontFamily: 'Times New Roman, Times, serif'}}>
            {initialData ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <p className="text-gray-400 text-sm">Share your thoughts about this movie</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Your Rating</label>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                    star <= rating 
                      ? 'text-yellow-400 fill-current scale-110' 
                      : 'text-gray-600 hover:text-yellow-300 hover:scale-105'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-white">
              {rating > 0 && `${rating} out of 5`}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Review Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience in a few words..."
            maxLength={100}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 text-white text-base transition-all duration-200"
          />
          <p className="text-xs text-gray-500">{title.length}/100 characters</p>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Your Review</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your detailed thoughts about the movie..."
            maxLength={1000}
            required
            rows={4}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 text-white text-base resize-none transition-all duration-200"
          />
          <p className="text-xs text-gray-500">{content.length}/1000 characters</p>
        </div>

        {/* Pros and Cons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-green-400">What you liked</label>
            <div className="space-y-2">
              {pros.map((pro, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={pro}
                    onChange={(e) => updatePro(index, e.target.value)}
                    placeholder="Add something positive..."
                    maxLength={200}
                    className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 text-white text-sm transition-all duration-200"
                  />
                  {pros.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removePro(index)}
                      className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg transition-all duration-200"
                    >
                      <X size={16} className="text-red-400" />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addPro} 
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-400 text-sm transition-all duration-200"
              >
                <Plus size={16} /> Add Pro
              </button>
            </div>
          </div>

          {/* Cons */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-red-400">What could be better</label>
            <div className="space-y-2">
              {cons.map((con, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={con}
                    onChange={(e) => updateCon(index, e.target.value)}
                    placeholder="Add something to improve..."
                    maxLength={200}
                    className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 text-white text-sm transition-all duration-200"
                  />
                  {cons.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeCon(index)}
                      className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg transition-all duration-200"
                    >
                      <X size={16} className="text-red-400" />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addCon} 
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 text-sm transition-all duration-200"
              >
                <Plus size={16} /> Add Con
              </button>
            </div>
          </div>
        </div>

        {/* Watch Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">When did you watch it?</label>
          <input
            type="date"
            value={watchDate}
            onChange={(e) => setWatchDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 text-white transition-all duration-200"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:transform-none"
          >
            {isSubmitting ? 'Submitting...' : (initialData ? 'Update Review' : 'Submit Review')}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieReviewForm;
