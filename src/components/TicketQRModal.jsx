import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import QRCode from 'qrcode';

const TicketQRModal = ({ isOpen, onClose, qrData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && qrData && canvasRef.current) {
      // Generate QR code on canvas
      const qrString = typeof qrData === 'string' ? qrData : JSON.stringify(qrData);
      
      QRCode.toCanvas(canvasRef.current, qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch(err => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [isOpen, qrData]);

  // Lock/unlock body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is unlocked when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ticket QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center">
          <div className="bg-gray-50 p-6 rounded-lg mb-4 flex justify-center">
            <canvas 
              ref={canvasRef}
              className="border border-gray-200 rounded-lg"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-800 mb-2">Scan this QR code at the theatre entrance</p>
            <p>Present this to theatre staff to verify your ticket.</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-red-950 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketQRModal; 