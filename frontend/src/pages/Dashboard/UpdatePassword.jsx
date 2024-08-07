import React, { useState, useContext } from 'react';
import { AuthContext } from '../../utilities/providers/AuthProvider';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUser from '../../hooks/useUser';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline } from "react-icons/io5";

const UpdatePassword = () => {
  const { updatePassword } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const { currentUser } = useUser();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      await updatePasswordInDatabase(newPassword);
      Swal.fire({
        title: 'Success!',
        text: 'Your password has been updated.',
        icon: 'success',
        timer: 1500
      });
      setCurrentPassword('');
      setNewPassword('');
      navigate('/dashboard/userP') 
    } catch (error) {
      console.error("Error updating password:", error.message);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        timer: 1500
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePasswordInDatabase = async (newPassword) => {
    try {
      await axiosSecure.patch(`http://localhost:5000/user/${currentUser._id}`, { password: newPassword });
      Swal.fire({
        title: 'Success!',
        text: 'Your password has been updated.',
        icon: 'success',
        timer: 1500
      });
    } catch (error) {
      console.error('Error updating password in the database:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error updating your password.',
        icon: 'error',
        timer: 1500
      });
    }
  };

  return (
    <div className="w-[1000px] h-screen justify-center flex items-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className='text-2xl font-bold mb-6'>Update Your Password</h2>
        <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                Current Password
            </label>
            <input
                id="currentPassword"
                name="currentPassword"
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
            <span 
                onClick={() => setShowPassword(!showPassword)} 
                className='absolute right-0 top-7 bottom-0 flex items-center pr-3 cursor-pointer'
            >
                <IoEyeOutline className='h-4 w-4 text-gray-400' />
            </span>
        </div>

        <div className="mb-6 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          <span 
            onClick={() => setShowNewPassword(!showNewPassword)} 
            className='absolute right-0 top-7 bottom-0 flex items-center pr-3 cursor-pointer'
          >
            <IoEyeOutline className='h-4 w-4 text-gray-400' />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-[#f2e48d] justify-center hover:bg-secondary text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
          <Link to="/dashboard/userP">
            <button
              type='button'
              className='bg-red-300 justify-center hover:bg-red-500 text-black font-bold py-2 px-4 
                rounded focus:outline-none focus:shadow-outline'
            >
              Cancel
            </button>
          </Link>        
        </div>
      </form>
    </div>
  );
};

export default UpdatePassword;
