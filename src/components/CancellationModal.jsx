import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Clock, IndianRupee } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CancellationModal = ({ isOpen, onClose, booking, onCancellationSuccess }) => {
  const { api } = useAppContext();
  const [cancellationPolicy, setCancellationPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (isOpen && booking) {
      fetchCancellationPolicy();
    }
  }, [isOpen, booking]);

  const fetchCancellationPolicy = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/cancellation/policy/${booking._id}`);
      
      if (response.data.success) {
        setCancellationPolicy(response.data);
      } else {
        toast.error(response.data.message || 'Failed to get cancellation policy');
      }
    } catch (error) {
      console.error('Error fetching cancellation policy:', error);
      toast.error(error.response?.data?.message || 'Failed to get cancellation policy');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      setSubmitting(true);
      
      const response = await api.post(`/api/cancellation/cancel/${booking._id}`, {
        reason: reason || 'User requested cancellation'
      });

      if (response.data.success) {
        toast.success('Booking cancelled successfully!');
        onCancellationSuccess && onCancellationSuccess(response.data.cancellation);
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const formatTimeUntilShow = (hours) => {
    if (hours >= 24) {
      return `${Math.floor(hours / 24)} day(s) ${Math.floor(hours % 24)} hour(s)`;
    } else {
      return `${Math.floor(hours)} hour(s) ${Math.floor((hours % 1) * 60)} minute(s)`;
    }
  };

  const canCancel = cancellationPolicy?.refundInfo?.hoursUntilShow > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Cancel Booking</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={submitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : cancellationPolicy ? (
            <>
              {/* Booking Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Booking Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Movie:</span> {cancellationPolicy.booking.movieTitle}</p>
                  <p><span className="font-medium">Theatre:</span> {cancellationPolicy.booking.theatreName}</p>
                  <p><span className="font-medium">Show Time:</span> {cancellationPolicy.booking.showDateTime ? new Date(cancellationPolicy.booking.showDateTime).toLocaleString('en-IN') : 'N/A'}</p>
                  <p><span className="font-medium">Seats:</span> {cancellationPolicy.booking.seats.join(', ')}</p>
                  <p><span className="font-medium">Original Amount:</span> ₹{cancellationPolicy.booking.originalAmount}</p>
                </div>
              </div>

              {/* Time Until Show */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Time Until Show</span>
                </div>
                <p className="text-lg">
                  {formatTimeUntilShow(cancellationPolicy.refundInfo.hoursUntilShow)}
                </p>
              </div>

              {/* Refund Information */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-green-600 mb-3">
                  <IndianRupee className="w-5 h-5" />
                  <span className="font-medium">Refund Information</span>
                </div>
                
                {cancellationPolicy.refundInfo.refundAmount > 0 ? (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-green-800">
                      <span className="font-medium">Refund Amount: </span>
                      ₹{cancellationPolicy.refundInfo.refundAmount} 
                      ({cancellationPolicy.refundInfo.refundPercentage}% of original amount)
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Refund will be processed within 5-7 business days
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-800 font-medium">No refund applicable</p>
                    <p className="text-sm text-red-600 mt-1">
                      Cancellations made less than 2 hours before show time are not eligible for refund
                    </p>
                  </div>
                )}
              </div>

              {/* Cancellation Policy */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Cancellation Policy</h3>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-medium">24+ hours before show:</span> 80% refund</li>
                    <li><span className="font-medium">12-24 hours before show:</span> 50% refund</li>
                    <li><span className="font-medium">2-12 hours before show:</span> 25% refund</li>
                    <li><span className="font-medium">Less than 2 hours:</span> No refund</li>
                  </ul>
                </div>
              </div>

              {/* Warning for past shows */}
              {!canCancel && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Cannot Cancel</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-800">
                      This booking cannot be cancelled as the show has already started or passed.
                    </p>
                  </div>
                </div>
              )}

              {/* Cancellation Reason */}
              {canCancel && (
                <div className="mb-6">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Cancellation (Optional)
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows="3"
                    placeholder="Please let us know why you're cancelling..."
                    disabled={submitting}
                  />
                </div>
              )}

              {/* Confirmation Dialog */}
              {showConfirmation && (
                <div className="mb-6">
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">Confirm Cancellation</span>
                    </div>
                    <p className="text-yellow-800 mb-3">
                      Are you sure you want to cancel this booking? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelBooking}
                        disabled={submitting}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Cancelling...
                          </>
                        ) : (
                          'Yes, Cancel Booking'
                        )}
                      </button>
                      <button
                        onClick={() => setShowConfirmation(false)}
                        disabled={submitting}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        No, Keep Booking
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        {!loading && cancellationPolicy && (
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            {canCancel && !showConfirmation && (
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={submitting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Booking
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CancellationModal;