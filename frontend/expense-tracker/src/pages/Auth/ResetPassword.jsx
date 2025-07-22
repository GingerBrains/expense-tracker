import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get token from URL
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!password || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, { token, password });
      setMessage(res.data.message || 'Password has been reset successfully.');
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow text-center">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        {success ? (
          <>
            <p className="text-green-700 mb-4">{message}</p>
            <button className="btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full">Reset Password</button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword; 