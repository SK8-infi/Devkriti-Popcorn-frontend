import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { Building2, MapPin, Calendar, Clock, User, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

const ListBookings = () => {
    const { api, theatre, theatreCity } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/admin/all-bookings');
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message || 'Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getBookingStatus = (booking) => {
        const now = new Date();
        const showTime = new Date(booking.show?.showDateTime);
        
        if (showTime < now) {
            return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Completed</span>;
        } else {
            return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Upcoming</span>;
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="p-6">

            <Title title="All Bookings" />

            {bookings.length === 0 ? (
                <div className="text-center py-8">
                    <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Found</h3>
                    <p className="text-gray-500">There are no bookings to display at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-4 mt-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white/10 border border-white/20 rounded-lg p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-4 h-4 text-primary" />
                                        <span className="font-semibold text-white">
                                            {booking.user?.name || 'Unknown User'}
                                        </span>
                                        <span className="text-gray-400">({booking.user?.email || 'No email'})</span>
                                    </div>
                                    
                                    <div className="text-white mb-2">
                                        <span className="font-semibold">Movie: </span>
                                        {booking.show?.movie?.title || 'Unknown Movie'}
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(booking.show?.showDateTime)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatTime(booking.show?.showDateTime)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Ticket className="w-4 h-4" />
                                            <span>{booking.seats?.length || 0} seats</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold">₹{booking.show?.normalPrice || booking.show?.vipPrice || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                    {getBookingStatus(booking)}
                                    <div className="text-xs text-gray-400">
                                        Booked on {formatDate(booking.createdAt)}
                                    </div>
                                </div>
                            </div>
                            
                            {booking.seats && booking.seats.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/20">
                                    <div className="text-sm text-gray-300 mb-1">Selected Seats:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {booking.seats.map((seat, index) => (
                                            <span key={index} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                                                {seat.row}-{seat.col}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListBookings; 