// Import necessary modules from Firebase and React
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { db } from '../firebase';
import Spinner from '../components/Spinner';

// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking,FaChair } from "react-icons/fa";
import SwipperCore from 'swiper';
import { EffectFade, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css'; // Import the base styles for Swiper

// Listing component responsible for displaying a single listing
export default function Listing() {
    // State to hold the listing data and loading status
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

    // Enable Swiper modules
    SwipperCore.use([Autoplay, Navigation, Pagination]);

    // Get the listing ID from the URL parameters
    const params = useParams();

    // Fetch the listing data from Firebase when the component mounts
    useEffect(() => {
        async function fetchListing() {
            // Create a reference to the document in the "listings" collection with the given ID
            const docRef = doc(db, "listings", params.listingId);

            // Get the document snapshot from Firestore
            const docSnap = await getDoc(docRef);

            // If the document exists, set the listing state with the document data
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingId]);

    // If the data is still loading, display the spinner component
    if (loading) {
        return <Spinner />;
    }

    // Once the data is loaded, render the listing details
    return (
        <main>
            {/* Swiper component for displaying image slides */}
            <Swiper
                slidesPerView={1}
                navigation
                // pagination={{ clickable: true }} // You can uncomment this line if you want to use clickable pagination bullets
                Scrollbar={{ draggable: true }}
                pagination={{ type: "progressbar" }}
                effect="fade"
                loop="true"
                // modules={[EffectFade]}
                autoplay={{ delay: 3000 }}
            >
                {/* Map through the image URLs and create Swiper slides */}
                {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div className="w-full relative overflow-hidden h-[300px]" style={{ background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: "cover" }}>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Component for copying the listing URL to the clipboard */}
            <div onClick={() => {
                // Copy the current URL to the clipboard
                navigator.clipboard.writeText(window.location.href);
                setShareLinkCopied(true);

                // Hide the "Link Copied" message after 2 seconds
                setTimeout(() => {
                    setShareLinkCopied(false);
                }, 2000);
            }} className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full h-12 w-12 flex justify-center items-center">
                <FaShare className='text-lg text-slate-500' />
            </div>
            {/* Display a message when the link is copied */}
            {shareLinkCopied && (
                <p className='fixed z-10 p-2 top-[23%] lg:space-x-5 right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white'>Link Copied</p>
            )}

            <div className="flex flex-col md:flex-row max-w-6xl lg:mx-auto m-4 p-4 rounded-lg shadow-lg bg-white">
                <div className="w-full h-[200px] lg:h-[400px] ">
                    <p className='text-2xl font-bold mb-3 text-blue-900'>
                        {listing.name} - ${" "}
                        {listing.offer
                            ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {listing.type === "rent" ? " / month" : ""}
                    </p>
                    <p className="flex items-center mt-6 mb-3 font-semibold">
                        <FaMapMarkerAlt className="text-green-700 mr-1" />{listing.address}
                    </p>
                    <div className="flex justify-start items-center space-x-4 w-[75%]">
                        <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md'>{listing.type === "rent" ? "Rent" : "Sale"}</p>
                        <p>{listing.offer && (
                            <p className='w-full max-w-[200px] bg-green-800 rounded-md py-1 px-2 text-white text-center font-semibold shadow-md'> ${+listing.regularPrice - +listing.discountedPrice} discount </p>
                        )}</p>
                    </div>
                    <p className='mt-3 mb-3'> <span className='font-semibold'> Description - </span>  {listing.description}</p>
                    <ul className='flex items-center space-x-2 sm:space-x-10 text-sm font-semibold'>
                        <li className='flex items-center whitespace-nowrap'> <FaBed className="text-lg mr-1" />
                            {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaBath className="text-lg mr-1" />
                            {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaParking className="text-lg mr-1" />
                            {listing.parking ? "Parking spot" : "No parking"}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaChair className="text-lg mr-1" />
                            {listing.furnished ? "Furnished" : "Not furnished"}
                        </li>
                    </ul>
                </div>
                <div className="w-full h-[200px] lg:h-[400px]"></div>
            </div>
        </main>
    );
}
