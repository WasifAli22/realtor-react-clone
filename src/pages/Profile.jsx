import { getAuth, updateProfile } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { FcHome } from "react-icons/fc"
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Profile() {
  // Get the authentication instance and the navigation hook
  const auth = getAuth();
  const navigate = useNavigate();

  // State variables to handle user profile details and edit mode
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    async function fetchUserListings() {
      try {
        // Retrieve user listings from Firestore
        const listingRef = collection(db, "listings");
        const q = query(listingRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc) => {
          // Store listing data into listings array
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        // Set listings and loading state once the data is retrieved
        setListings(listings);
        setLoading(false);
      } catch (error) {
        // Handle any potential errors while fetching listings
        console.error("Error fetching user listings:", error);
      }
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  // JSX rendering of the component
  return (
    <>
      {/* User Profile Section */}
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
              <p className='flex items-center mb-6'>
                {/* Toggle Edit Mode */}
                Do you want to change your name?{" "}
                <span
                  className='text-red-600 hover:text-red-700 transition ease-in-out cursor-pointer ml-1 duration-200'
                  onClick={() => {
                    // If in edit mode, submit the changes and toggle edit mode
                    changeDetail && onSubmit();
                    setChangeDetail((prevstate) => !prevstate);
                  }}
                >
                  {changeDetail ? "Apply change" : "Edit"}
                </span>
              </p>
              {/* Button to sign out */}
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-700 transition ease-in-out duration-200 cursor-pointer'>
                Sign Out
              </p>
            </div>
          </form>
          {/* Button to create a new listing */}
          <button
            type='submit'
            className='transition ease-in-out duration-150 hover:shadow-lg rounded shadow-md hover:bg-blue-700 active:bg-blue-800 bg-blue-600 text-white w-full uppercase px-7 py-3 text-sm font-medium'
          >
            <Link to="/create-listing" className='flex justify-center items-center'>
              <FcHome className='mr-2 text-3xl p-1 rounded-full bg-red-200 border-2' /> Sell or rent your home
            </Link>
          </button>
        </div>
      </section>

      {/* Display User Listings */}
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold mb-6'>My Listings</h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl-grid-cols-5 mt-6 mb-6'>
              {/* Render each listing using ListingItem component */}
              {listings.map((listing) => (
                <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
