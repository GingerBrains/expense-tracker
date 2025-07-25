import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../context/userContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password){
      setError('Please enter your password');
      return;
    }

    setError("");
    
    //Login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('accessToken',token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message){
        setError(error.response.data.message);
      } else{
        setError("Something went wrong, please try again later.");
      }
  }
}

  return(
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your credentials to login
        </p>

          <form onSubmit={handleLogin}>
            <Input
              value={email}
              onChange={({target}) => setEmail(target.value)}
              label="Email Address"
              placeholder="morgan@example.com"
              type="email"
            />
            <Input
              value={password}
              onChange={({target}) => setPassword(target.value)}
              label="Password"
              placeholder="********"
              type="password"
            />
            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

            <button type='submit' className='btn-primary'>
              LOGIN
            </button>

            <div className='flex justify-start mt-2'>
              <Link to="/forgot-password" className="text-primary text-sm underline hover:opacity-80">
                Forgot Password?
              </Link>
            </div>

            <p className='text-[13px] text-slate-600 mt-3'>
              Dont have an account?{" "}
              <Link className='font-medium text-primary underline' to="/signUp">
                Sign Up
              </Link>
            </p>

          </form>

        </div>
    </AuthLayout>
  )
};

export default Login