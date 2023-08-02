// Import required libraries and components
import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { db } from "../firebase";
import { useNavigate, useParams } from 'react-router';

// Create a functional component named CreateListing
export default function CreateListing() {
    // Initialize necessary state variables using the useState hook
    const navigate = useNavigate();
    const auth = getAuth();
    // eslint-disable-next-line no-unused-vars
    const [getLocationEnabled, setGetLocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const [formData, setFromData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: true,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {}
    });
    // Destructure formData to access its properties directly
    const { type, name, bedrooms, bathrooms, furnished, parking, address, description, offer, regularPrice, discountedPrice, latitude, longitude, images } = formData;
    const params = useParams()

    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error("You can not edit this listing")
            navigate("/")
        }
    }, [auth.currentUser.uid,listing,navigate])

    useEffect(() => {
        setLoading(true)
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data())
                setFromData({...docSnap.data() })
                setLoading(false)
            }else{
                navigate("/")
                toast.error("listing does not exist")
            }

        }
        fetchListing()
    }, [navigate,params.listingId]) 


    // Event handler to update form data on input change
    function onchange(e) {
        let boolean = null;
        if (e.target.value === "true") {
            boolean = true;
        }
        if (e.target.value === "false") {
            boolean = false;
        }
        // Files
        if (e.target.files) {
            setFromData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        }
        // Text/Boolean/Number
        if (!e.target.files) {
            setFromData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }));
        }
    }

    // Event handler to submit the form and create a new listing
    async function onsubmit(e) {
        e.preventDefault();
        setLoading(true);
        // Validate discounted price
        if (+discountedPrice >= +regularPrice) {
            setLoading(false);
            toast.error("Discounted price needs to be less than regular price");
            return;
        }
        // Validate image count
        if (images.length > 6) {
            setLoading(false);
            toast.error("Maximum 6 images are allowed");
            return;
        }

        // Helper function to store each image to Firebase Storage
        async function storeImage(image) {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                const storageRef = ref(storage, fileName);
                // Upload the file and metadata
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        // eslint-disable-next-line default-case
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
        }

        // Store all images and get their download URLs
        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch((error) => {
            setLoading(false);
            toast.error("Images not uploaded");
            return;
        });

        // Prepare the data for Firestore document creation
        const formDataCopy = {
            ...formData,
            imgUrls,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid
        };
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;

        // Create a new listing document in Firestore
        const docRef = doc(db, "listings",params.listingId)
        
        await updateDoc(docRef, formDataCopy);

        setLoading(false);
        toast.success("Listing Edited");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }

    // If loading is true, show a spinner component
    if (loading) {
        return <Spinner />;
    }


    return (
        <main className='max-w-md mx-auto px-2'>
            <h1 className='text-3xl text-center mt-6 font-bold'> Edit Listing</h1>
            <form onSubmit={onsubmit}>
                <p className='text-lg mt-6 font-semibold'>Sell / Rent</p>
                <div className="flex">
                    <button className={`px-7 mr-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                     focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full
                      ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button' id='type' value="sale" onClick={onchange}>sell
                    </button>
                    <button className={`px-7 ml-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                     focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full
                      ${type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button' id='type' value="rent" onClick={onchange}>Rent
                    </button>
                </div>
                <p className='text-lg mt-6 font-semibold'>Name</p>
                <input type="text" id='name' value={name} onChange={onchange} className='mb-6 px-4 py-2 text-gray-700 w-full text-xl bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' required placeholder='Name' maxLength="32" />
                <div className="flex space-x-6 mb-6">
                    <div className="">
                        <p className='text-lg mt-6 font-semibold'>Beds</p>
                        <input type="number" id='bedrooms' value={bedrooms} onChange={onchange} min="1" max="50" required className='px-4 text-center py-2 text-gray-700 w-full text-xl bg-white border border-gray-700 rounded transition duration-150 ease-in-out' />
                    </div>
                    <div className="">
                        <p className='text-lg mt-6 font-semibold'>Baths</p>
                        <input type="number" id='bathrooms' value={bathrooms} onChange={onchange} min="1" max="50" required className='px-4 text-center py-2 text-gray-700 w-full text-xl bg-white border border-gray-700 rounded transition duration-150 ease-in-out' />
                    </div>
                </div>
                <p className='text-lg mt-6 font-semibold'>Parking spot</p>
                <div className="flex">
                    <button className={`px-7 mr-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                     focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full
                      ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button' id='parking' value={true} onClick={onchange}>Yes
                    </button>
                    <button className={`px-7 ml-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                     focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full
                      ${parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button' id='parking' value={false} onClick={onchange}>No
                    </button>
                </div>
                <p className='text-lg mt-6 font-semibold'>Furnished</p>
                <div className="flex">
                    <button className={`px-7 mr-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                     focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full
                      ${!furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button' id='furnished' value={true} onClick={onchange}>Yes
                    </button>
                    <button className={`px-7 ml-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                     focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full
                      ${furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button' id='furnished' value={false} onClick={onchange}>No
                    </button>
                </div>
                <p className='text-lg mt-6 font-semibold'>Address</p>
                <textarea type="text" id='address' value={address} onChange={onchange} className='mb-6 px-4 py-2 text-gray-700 w-full text-xl bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' required placeholder='Address' />
                {!getLocationEnabled && (
                    <div className="flex space-x-6 justify-start mb-6">
                        <div className="">
                            <p className='text-lg font-semibold'>Latitude</p>
                            <input min="-90" max="90" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' type="number" value={latitude} id="latitude" onChange={onchange} required />
                        </div>
                        <div className="">
                            <p className='text-lg font-semibold'>Longitude</p>
                            <input min="-180" max="180" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' type="number" value={longitude} id="longitude" onChange={onchange} required />
                        </div>
                    </div>
                )}
                <p className='text-lg font-semibold'>Description</p>
                <textarea type="text" id='description' value={description} onChange={onchange} className='mb-6 px-4 py-2 text-gray-700 w-full text-xl bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' required placeholder='Description' />
                <p className='text-lg font-semibold'>Offer</p>
                <div className="flex mb-6">
                    <button className={`px-7 mr-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                     focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full
                      ${!offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button' id='offer' value={true} onClick={onchange}>Yes
                    </button>
                    <button className={`px-7 ml-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg
                     focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full
                      ${offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button' id='offer' value={false} onClick={onchange}>No
                    </button>
                </div>
                <div className="flex items-center mb-6">
                    <div className="">
                        <p className='text-lg font-semibold'>Regular price</p>
                        <div className="flex justify-center items-center space-x-6">
                            <input type="number" className='w-full px-4 py-2 bg-white border text-gray-700 focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center border-gray-300 rounded text-xl transition ease-in-out' id='regularPrice' value={regularPrice} onChange={onchange} required min="50" max="40000000" />
                            {type === "rent" && (
                                <div className="">
                                    <p className='text-base w-full whitespace-nowrap'>$ / month</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {offer && (
                    <div className="flex items-center mb-6">
                        <div className="">
                            <p className='text-lg font-semibold'>discounted price</p>
                            <div className="flex justify-center items-center space-x-6">
                                <input type="number" required={offer} className='w-full px-4 py-2 bg-white border text-gray-700 focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center border-gray-300 rounded text-xl transition ease-in-out' id='discountedPrice' value={discountedPrice} onChange={onchange} min="50" max="40000000" />
                                {type === "rent" && (
                                    <div className="">
                                        <p className='text-base w-full whitespace-nowrap'>$ / month</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="mb-6">
                    <p className='text-lg font-semibold'>Images</p>
                    <p className='text-gray-600'>The first image will be cover (max 6)</p>
                    <input type="file" className="px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded transition ease-in-out focus:bg-white focus:border-slate-600" id="images" onChange={onchange} multiple required accept='.jpg,.png,.jpeg' />
                </div>
                <button type="submit" className='mb-6 w-full px-7 py-3 bg-blue-600 text-white text-sm uppercase font-medium rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-xl transition ease-in-out duration-150'>Edit Listing</button>
            </form>

        </main>
    )
}
