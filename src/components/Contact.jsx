import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { toast } from 'react-toastify';

export default function Contact({ userRef, listing }) {
    // State variables to hold landlord data, user's message, and error state for empty message
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    // Fetch landlord data from Firestore when the component mounts or userRef changes
    useEffect(() => {
        // Function to get landlord data from Firestore
        async function getLandlord() {
            const docRef = doc(db, "users", userRef);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLandlord(docSnap.data());
            } else {
                toast.error("Could not get landlord data");
            }
        }

        // Call the getLandlord function to fetch the data
        getLandlord();
    }, [userRef]);

    // Handler function to update the message state and reset the error message state
    function onChange(e) {
        setMessage(e.target.value);
        setShowErrorMessage(false); // Reset the error message when the user types in the textarea.
    }

    // Handler function to handle sending the message or displaying an error if the message is empty
    function onSendClick() {
        if (message.trim() === '') {
            // If the message is empty or only contains whitespace, show the error message.
            setShowErrorMessage(true);
        } else {
            // Send the email with the message content.
            window.location.href = `mailto:${landlord.email}?Subject=${listing.name}&body=${message}`;
        }
    }

    return (
        <>
            {landlord !== null && (
                <div className="flex flex-col w-full">
                    {/* Display the landlord's name and the listing name */}
                    <p>Contact {landlord.name.toLowerCase()} for the {listing.name} </p>
                    <div className="mt-3 mb-6">
                        {/* Textarea for the user to enter the message */}
                        <textarea
                            name="message"
                            id="message"
                            rows="2"
                            placeholder=""
                            value={message}
                            onChange={onChange}
                            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
                        ></textarea>
                        {/* Show an error message if the user clicks "Send Message" without entering any message */}
                        {showErrorMessage && (
                            <span className="text-red-500">Please enter a message before sending.</span>
                        )}
                    </div>
                    {/* Button to send the message */}
                    <button
                        type='button'
                        onClick={onSendClick}
                        className='px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6'
                    >
                        Send Message
                    </button>
                </div>
            )}
        </>
    );
}
