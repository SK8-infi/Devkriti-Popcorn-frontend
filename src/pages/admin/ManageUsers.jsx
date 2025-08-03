import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { Users, Shield, User, ArrowLeft, Home, RefreshCw, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import { getUserImage } from '../../utils/imageUtils';

const ManageUsers = () => {
    const { api, isAdmin, isAuthenticated, loading, hasOwnerAccess, fetchOwnerAccess } = useAppContext();
    const [users, setUsers] = useState([]);
    const [manageLoading, setManageLoading] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    // Fetch all users from backend
    const fetchUsers = async () => {
        setFetchingUsers(true);
        try {
            const response = await api.get('/api/admin/all-users');
            if (response.data.success) {
                setUsers(response.data.users);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Fetch users error:', error);
            toast.error('Error fetching users');
        } finally {
            setFetchingUsers(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchOwnerAccess();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAdmin && hasOwnerAccess) {
            fetchUsers();
        }
    }, [isAdmin, hasOwnerAccess]);

    const handleToggleAdmin = async (userId, currentRole, userEmail) => {
        setManageLoading(true);
        try {
            const endpoint = currentRole === 'admin' ? '/api/user/demote-admin' : '/api/user/promote-admin';
            const response = await api.post(endpoint, { email: userEmail });

            if (response.data.success) {
                const action = currentRole === 'admin' ? 'demoted from admin' : 'promoted to admin';
                toast.success(`User ${action} successfully!`);
                
                // Update the users list
                setUsers(users.map(user => 
                    user._id === userId 
                        ? { ...user, role: currentRole === 'admin' ? 'user' : 'admin' }
                        : user
                ));
            }
        } catch (error) {
            console.error('Toggle admin error:', error);
            toast.error(error.response?.data?.message || 'Failed to update user role');
        } finally {
            setManageLoading(false);
        }
    };

    // Filter and search users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesFilter;
    });

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
    if (typeof hasOwnerAccess === 'undefined') return <Loading/>

    // Redirect if no AD access
    if (!hasOwnerAccess) {
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
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
                            <p className="text-gray-600">Manage user roles and permissions</p>
                        </div>
                        <button
                            onClick={fetchUsers}
                            disabled={fetchingUsers}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${fetchingUsers ? 'animate-spin' : ''}`} />
                            {fetchingUsers ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="owner">Owners Only</option>
                                <option value="admin">Admins Only</option>
                                <option value="user">Users Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Users ({filteredUsers.length} of {users.length})
                            </h3>
                            <div className="text-sm text-gray-500">
                                {users.filter(u => u.role === 'owner').length} owners, {users.filter(u => u.role === 'admin').length} admins, {users.filter(u => u.role === 'user').length} users
                            </div>
                        </div>
                    </div>
                    
                    {fetchingUsers ? (
                        <div className="p-8 text-center">
                            <Loading />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchTerm || filterRole !== 'all' ? 'No users match your search criteria' : 'No users found'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {(() => {
                                                            const userImage = getUserImage(user);
                                                            return (
                                                                <>
                                                                    {userImage.hasImage ? (
                                                                        <img 
                                                                            className="h-10 w-10 rounded-full" 
                                                                            src={userImage.url} 
                                                                            alt="" 
                                                                            onError={(e) => {
                                                                                // If it's a Google image and we have a fallback URL, try that first
                                                                                if (userImage.isGoogleImage && userImage.fallbackUrl) {
                                                                                    e.target.src = userImage.fallbackUrl;
                                                                                    return;
                                                                                }
                                                                                // Otherwise, hide the image and show the fallback
                                                                                e.target.style.display = 'none';
                                                                                e.target.nextSibling.style.display = 'flex';
                                                                            }}
                                                                        />
                                                                    ) : null}
                                                                    {!userImage.hasImage && (
                                                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                            <span className="text-sm font-medium text-gray-700">
                                                                                {userImage.fallback}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">ID: {user._id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    user.role === 'owner' 
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : user.role === 'admin' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {user.role === 'owner' ? (
                                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-500 cursor-not-allowed">
                                                        Cannot Modify
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleToggleAdmin(user._id, user.role, user.email)}
                                                        disabled={manageLoading}
                                                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md ${
                                                            user.role === 'admin'
                                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        {manageLoading ? 'Updating...' : user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Actions</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                        <p>• Click "Make Admin" to promote a user to admin status</p>
                        <p>• Click "Remove Admin" to demote an admin to user status</p>
                        <p>• <strong>Owners cannot be modified</strong> - they have permanent access</p>
                        <p>• Use the search bar to find specific users</p>
                        <p>• Use the filter dropdown to view specific roles</p>
                        <p>• Only users with owner access can manage other users</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers; 