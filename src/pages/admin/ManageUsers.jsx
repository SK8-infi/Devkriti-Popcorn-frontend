import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { Users, Shield, User, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';

const ManageUsers = () => {
    const { api, isAdmin, isAuthenticated, loading, hasAdAccess, fetchAdAccess } = useAppContext();
    const [users, setUsers] = useState([]);
    const [manageLoading, setManageLoading] = useState(false);
    const [promoteEmail, setPromoteEmail] = useState('');
    const [demoteEmail, setDemoteEmail] = useState('');

    // Mock users data for demonstration
    const mockUsers = [
        { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
        { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
    ];

    useEffect(() => {
        // For now, use mock data
        setUsers(mockUsers);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAdAccess();
        }
    }, [isAuthenticated]);

    const handlePromoteToAdmin = async (e) => {
        e.preventDefault();
        if (!promoteEmail) {
            toast.error('Please enter an email address');
            return;
        }

        setManageLoading(true);
        try {
            const response = await api.post('/api/user/promote-to-admin', {
                email: promoteEmail
            });

            if (response.data.success) {
                toast.success('User promoted to admin successfully!');
                setPromoteEmail('');
                // Update the users list
                setUsers(users.map(user => 
                    user.email === promoteEmail 
                        ? { ...user, role: 'admin' }
                        : user
                ));
            }
        } catch (error) {
            console.error('Promote error:', error);
            toast.error(error.response?.data?.message || 'Failed to promote user');
        } finally {
            setManageLoading(false);
        }
    };

    const handleDemoteFromAdmin = async (e) => {
        e.preventDefault();
        if (!demoteEmail) {
            toast.error('Please enter an email address');
            return;
        }

        setManageLoading(true);
        try {
            const response = await api.post('/api/user/demote-from-admin', {
                email: demoteEmail
            });

            if (response.data.success) {
                toast.success('User demoted from admin successfully!');
                setDemoteEmail('');
                // Update the users list
                setUsers(users.map(user => 
                    user.email === demoteEmail 
                        ? { ...user, role: 'user' }
                        : user
                ));
            }
        } catch (error) {
            console.error('Demote error:', error);
            toast.error(error.response?.data?.message || 'Failed to demote user');
        } finally {
            setManageLoading(false);
        }
    };

    // Show loading while checking authentication
    if (loading) return <Loading/>

    // Redirect if not authenticated
    if (!isAuthenticated) {
        window.location.href = '/';
        return <Loading/>;
    }

    // Show loading while checking admin status
    if (typeof isAdmin === 'undefined') return <Loading/>

    // Redirect if not admin
    if (!isAdmin) {
        window.location.href = '/';
        return <Loading/>;
    }

    // Show loading while checking AD access
    if (typeof hasAdAccess === 'undefined') return <Loading/>

    // Redirect if no AD access
    if (!hasAdAccess) {
        window.location.href = '/admin';
        return <Loading/>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/admin" 
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Admin Panel
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <Link 
                                to="/" 
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Home
                            </Link>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Users className="w-6 h-6 text-blue-600" />
                            <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
                    <p className="text-gray-600">Promote or demote users to admin status</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Promote to Admin */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <Shield className="w-6 h-6 text-green-600 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-900">Promote to Admin</h2>
                        </div>
                        
                        <form onSubmit={handlePromoteToAdmin} className="space-y-4">
                            <div>
                                <label htmlFor="promoteEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                    User Email
                                </label>
                                <input
                                    type="email"
                                    id="promoteEmail"
                                    value={promoteEmail}
                                    onChange={(e) => setPromoteEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter user email"
                                    required
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={manageLoading}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {manageLoading ? 'Promoting...' : 'Promote to Admin'}
                            </button>
                        </form>
                    </div>

                    {/* Demote from Admin */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <User className="w-6 h-6 text-red-600 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-900">Demote from Admin</h2>
                        </div>
                        
                        <form onSubmit={handleDemoteFromAdmin} className="space-y-4">
                            <div>
                                <label htmlFor="demoteEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Email
                                </label>
                                <input
                                    type="email"
                                    id="demoteEmail"
                                    value={demoteEmail}
                                    onChange={(e) => setDemoteEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter admin email"
                                    required
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={manageLoading}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {manageLoading ? 'Demoting...' : 'Demote from Admin'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Users List */}
                <div className="mt-8 bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Current Users</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.role === 'admin' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Actions</h4>
                    <div className="text-sm text-blue-700">
                        <p>• Enter the email address of the user you want to promote or demote</p>
                        <p>• Only existing users can be promoted to admin</p>
                        <p>• Admin users have access to the admin dashboard and management features</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers; 