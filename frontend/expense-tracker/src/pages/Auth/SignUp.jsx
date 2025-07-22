import React,{ useState, useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'; // Uncommented
import axiosInstance  from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage'; // Uncommented

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null); // Profile picture state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate();

  //Handle SignUp form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = ''; // Removed the use of profilePic for now

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    if (!fullName) {
      setError('Please enter your full name');
      return;
    }

    setError("");

    // SignUp API call 
    try{
      // Upload image if selected
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl, // Now contains the uploaded image URL if available
      });
      // Show success message and hide form
      setSuccess(true);
    } catch (error){
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return(
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Enter your details below!</p>

        {success ? (
          <div className="bg-green-100 border border-green-300 text-green-800 rounded p-4 text-center">
            Registration successful!<br />
            Please check your email to verify your account before logging in.
            <button
              className="btn-primary mt-4"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        ) : (
        <form onSubmit={handleSignUp} className="w-full">

          {/* Profile Photo Selector */}
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 gap-4 w-full'>
            <Input
              value={fullName}
              onChange={({target}) => setFullName(target.value)}
              label="Full Name"
              placeholder="Arthur Morgan"
              type="text"
            />
            <Input
              value={email}
              onChange={({target}) => setEmail(target.value)}
              label="Email Address"
              placeholder="morgan@example.com"
              type="email"
            />
            <div className='col-span-1'>
              <Input
              value={password}
              onChange={({target}) => setPassword(target.value)}
              label="Password"
              placeholder="********"
              type="password"
            />
            </div>
            </div>

            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
            
            <button type='submit' className='btn-primary'>
              Sign Up
            </button>
            
            <p className='text-[13px] text-slate-600 mt-3 mb-4'>
  Already have an account?{" "}
  <Link className='font-medium text-primary underline' to="/login">
    Login
  </Link>
</p>

          </form>
        )}
      </div>
    </AuthLayout>
  )
}

export default SignUp
