import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import AuthLayout from '../../components/layouts/AuthLayout';

const VerifyEmail = () => {
  const [status, setStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();
  const navigate = useNavigate();
  const handled = useRef(false); // Prevent double status update

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }
    axiosInstance.get(`${API_PATHS.AUTH.VERIFY_EMAIL}?token=${token}`)
      .then(res => {
        if (!handled.current) {
          setStatus('success');
          setMessage(res.data.message || 'Email verified successfully! You can now log in.');
          handled.current = true;
        }
      })
      .catch(err => {
        if (!handled.current) {
          setStatus('error');
          setMessage(
            err.response?.data?.message || 'Verification failed. The link may have expired or is invalid.'
          );
          handled.current = true;
        }
      });
    // eslint-disable-next-line
  }, [location.search]);

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow text-center">
        {status === 'pending' && <p className="text-gray-700">{message}</p>}
        {status === 'success' && (
          <>
            <p className="text-green-700 font-semibold mb-4">{message}</p>
            <button
              className="btn-primary mt-2"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-red-600 font-semibold mb-4">{message}</p>
            <button
              className="btn-primary mt-2"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail; 