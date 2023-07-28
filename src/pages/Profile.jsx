import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { FcHome } from "react-icons/fc"
import { Link } from 'react-router-dom';
export default function Profile() {
  // Get the authentication instance and the navigation hook
  const auth = getAuth();
  const navigate = useNavigate();

  // State variables to handle user profile details and edit mode
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFromData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  // Destructure user profile details from the formData object
  const { name, email } = formData;

  // Function to handle user logout
  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  // Function to handle changes in the input fields
  function onChange(e) {
    setFromData((prevstate) => ({
      ...prevstate,
      [e.target.id]: e.target.value,
    }));
  }

  // Function to submit the profile changes to Firebase
  async function onSubmit() {
    try {
      // Check if the display name has been changed
      if (auth.currentUser.displayName !== name) {
        // Update the display name in Firebase authentication
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update the name in the Firestore document
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }

      // Show success toast message
      toast.success("Profile detail updated");
    } catch (error) {
      // Show error toast message if update fails
      toast.error("Could not update the profile detail");
    }
  }

  // JSX rendering of the component
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/* Name input */}
            <input
              type="text"
              id='name'
              disabled={!changeDetail}
              onChange={onChange}
              value={name}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border
               border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`}
            />
            {/* Email input */}
            <input
              type="email"
              id='email'
              value={email}
              className=' mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out'
              disabled
            />
            <div className="flex justify-between whitespace-nowrap mb-6 text-sm md:text-lg">
              <p className='flex items-center mb-6'>Do you want to change your name? <span className='text-red-600 hover:text-red-700 transition ease-in-out cursor-pointer ml-1 duration-200'
                onClick={() => {
                  // If in edit mode, submit the changes and toggle edit mode
                  changeDetail && onSubmit();
                  setChangeDetail((prevstate) => !prevstate);
                }}>
                {changeDetail ? "Apply change" : "Edit"}
              </span>
              </p>
              {/* Button to sign out */}
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-700 transition ease-in-out duration-200 cursor-pointer'>Sign Out</p>
            </div>
          </form>
          <button type='submit' className='transition ease-in-out duration-150 hover:shadow-lg rounded shadow-md hover:bg-blue-700 active:bg-blue-800 bg-blue-600 text-white w-full uppercase px-7 py-3 text-sm font-medium'>
            <Link to="/create-listing" className='flex justify-center items-center'>
              <FcHome className='mr-2 text-3xl p-1 rounded-full bg-red-200 border-2' /> Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
    </>
  )
}
