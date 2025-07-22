import React, { useState, useContext } from 'react';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Profile = () => {
  const { user, updateUser } = useContext(UserContext);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    let profileImageUrl = user?.profileImageUrl || '';
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }
      const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE, {
        fullName,
        email,
        password: password || undefined,
        profileImageUrl,
      });
      updateUser(res.data.user);
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProfilePhotoSelector image={profilePic || user?.profileImageUrl} setImage={setProfilePic} />
        <Input
          label="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          type="text"
        />
        <Input
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
        />
        <Input
          label="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Leave blank to keep current password"
        />
        <Input
          label="Confirm New Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Repeat new password"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile; 