import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import SeatLayoutEditor from '../../components/admin/SeatLayoutEditor';
import { Building2, MapPin } from 'lucide-react';

const ROOM_TYPES = ["Normal", "3D", "IMAX"];

const defaultLayout = Array(8).fill().map(() => Array(10).fill(1));

const ManageRooms = () => {
  const { api, user, isAdmin, theatre, theatreCity } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addForm, setAddForm] = useState({ name: '', type: 'Normal', layout: defaultLayout });
  const [editRoomId, setEditRoomId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', type: 'Normal', layout: defaultLayout });

  // Fetch rooms
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/my-theatre');
      if (data.success && data.theatre && data.theatre.rooms) {
        setRooms(data.theatre.rooms);
      } else {
        setRooms([]);
      }
    } catch (e) {
      setRooms([]);
    }
    setLoading(false);
  };

  useEffect(() => { 
    if (user && isAdmin) {
      fetchRooms(); 
    } else {
      // If no user or not admin, stop loading but keep rooms empty
      setLoading(false);
      setRooms([]);
    }
  }, [user, isAdmin]);

  // Add room
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/admin/my-theatre/room/add', addForm);
      if (data.success) {
        toast.success('Room added!');
        setRooms(data.rooms);
        setAddForm({ name: '', type: 'Normal', layout: defaultLayout });
      } else {
        toast.error(data.message || 'Failed to add room');
      }
    } catch (e) {
      toast.error('Error adding room');
    }
  };

  // Edit room
  const startEditRoom = (room) => {
    setEditRoomId(room._id);
    setEditForm({ name: room.name, type: room.type, layout: room.layout });
  };
  const handleEditRoom = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/admin/my-theatre/room/update', { roomId: editRoomId, ...editForm });
      if (data.success) {
        toast.success('Room updated!');
        setRooms(data.rooms);
        setEditRoomId(null);
      } else {
        toast.error(data.message || 'Failed to update room');
      }
    } catch (e) {
      toast.error('Error updating room');
    }
  };

  // Delete room
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      const { data } = await api.post('/api/admin/my-theatre/room/delete', { roomId });
      if (data.success) {
        toast.success('Room deleted!');
        setRooms(data.rooms);
      } else {
        toast.error(data.message || 'Failed to delete room');
      }
    } catch (e) {
      toast.error('Error deleting room');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* Theatre Info Header */}
      {(theatre || theatreCity) && (
        <div className="w-full flex justify-center mb-6">
          <div className="flex items-center gap-4 bg-white/10 border border-white/30 rounded-xl px-6 py-4 backdrop-blur-md">
            {theatre && (
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-white font-semibold">{theatre}</span>
              </div>
            )}
            {theatreCity && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-white font-semibold">{theatreCity}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Manage Theatre Rooms</h1>
      {loading ? <div>Loading...</div> : (
        <>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Add Room</h2>
            <form onSubmit={handleAddRoom} className="flex flex-col gap-4">
              <div className="flex gap-4 items-end flex-wrap">
                <input type="text" required placeholder="Room Name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className="border p-2 rounded" />
                <select value={addForm.type} onChange={e => setAddForm(f => ({ ...f, type: e.target.value }))} className="border p-2 rounded">
                  {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="w-full my-4">
                <SeatLayoutEditor layout={Array.isArray(addForm.layout) && Array.isArray(addForm.layout[0]) ? addForm.layout : defaultLayout} setLayout={layout => setAddForm(f => ({ ...f, layout }))} />
              </div>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded self-start">Add Room</button>
            </form>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Rooms</h2>
            {rooms.length === 0 ? <div>No rooms yet.</div> : (
              <table className="w-full border mt-2">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-2">Name</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room._id} className="border-b">
                      <td className="p-2">{room.name}</td>
                      <td className="p-2">{room.type}</td>
                      <td className="p-2 flex gap-2">
                        <button onClick={() => startEditRoom(room)} className="bg-yellow-400 px-3 py-1 rounded">Edit</button>
                        <button onClick={() => handleDeleteRoom(room._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {editRoomId && (
            <div className="mt-8 p-4 border rounded bg-white/10">
              <h2 className="text-lg font-semibold mb-2">Edit Room</h2>
              <form onSubmit={handleEditRoom} className="flex flex-col gap-4">
                <div className="flex gap-4 items-end flex-wrap">
                  <input type="text" required placeholder="Room Name" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="border p-2 rounded" />
                  <select value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))} className="border p-2 rounded">
                    {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div className="w-full my-4">
                  <SeatLayoutEditor layout={Array.isArray(editForm.layout) && Array.isArray(editForm.layout[0]) ? editForm.layout : defaultLayout} setLayout={layout => setEditForm(f => ({ ...f, layout }))} />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Save</button>
                  <button type="button" onClick={() => setEditRoomId(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageRooms; 