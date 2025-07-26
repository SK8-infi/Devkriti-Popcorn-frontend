import React from 'react';
import ReactPlayer from 'react-player';
import { X } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailer }) => {
  if (!isOpen || !trailer) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X size={32} />
        </button>
        
        {/* Trailer title */}
        <div className="text-white text-center mb-4">
          <h3 className="text-xl font-semibold">{trailer.name}</h3>
          <p className="text-gray-300 text-sm">{trailer.type}</p>
        </div>

        {/* Video player */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <ReactPlayer
            url={trailer.youtube_url}
            width="100%"
            height="100%"
            controls={true}
            playing={true}
            config={{
              youtube: {
                playerVars: {
                  autoplay: 1,
                  rel: 0,
                  modestbranding: 1
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal; 