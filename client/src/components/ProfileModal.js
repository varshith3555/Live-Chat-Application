import { useState } from 'react';
import API from '../api/api';
import toast from 'react-hot-toast';

const ProfileModal = ({ user, onClose, onProfileUpdate }) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatar(res.data.url);
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = () => setAvatar('');

  const handleProfileSave = async () => {
    try {
      setLoading(true);
      await API.patch('/users/profile', { name, avatar });
      toast.success('Profile updated!');
      onProfileUpdate({ name, avatar });
      onClose();
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await API.patch('/users/password', { oldPassword, newPassword });
      toast.success('Password updated!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <div className="flex flex-col items-center mb-4">
          <img src={avatar || '/default-avatar.png'} alt="avatar" className="w-20 h-20 rounded-full object-cover border mb-2" />
          <div className="flex gap-2">
            <label className="px-3 py-1 bg-neon text-midnight rounded cursor-pointer">
              Change
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
            {avatar && (
              <button className="px-3 py-1 bg-red-100 text-red-600 rounded" onClick={handleRemoveAvatar}>Remove</button>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded mb-4" onClick={handleProfileSave} disabled={loading}>
          Save Profile
        </button>
        <hr className="my-4" />
        <h3 className="font-semibold mb-2">Change Password</h3>
        <input className="w-full border rounded px-3 py-2 mb-2" type="password" placeholder="Old password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
        <input className="w-full border rounded px-3 py-2 mb-2" type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        <input className="w-full border rounded px-3 py-2 mb-2" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        <button className="w-full bg-neon text-midnight py-2 rounded" onClick={handlePasswordChange} disabled={loading}>
          Change Password
        </button>
        <button className="w-full mt-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ProfileModal; 