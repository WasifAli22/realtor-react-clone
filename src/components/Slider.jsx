import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import Spinner from './Spinner'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css'; // Import the base styles for Swiper
import { useNavigate } from "react-router-dom";

export default function Slider() {
    // State to hold the fetched listings and loading state
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize Swiper modules and set up navigation with react-router-dom
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch listings from Firebase when the component mounts
        async function fetchListings() {
            try {
                // Create a reference to the 'listings' collection
                const listingRef = collection(db, "listings");

                // Create a query to get the latest 5 listings, ordered by 'timestamp' in descending order
                const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));

                // Execute the query and get the snapshot of the results
                const querySnap = await getDocs(q); // Use getDocs instead of getDoc, as we are querying multiple documents

                // Process the snapshot and create an array of listings
                let listings = [];
                querySnap.forEach(doc => {
                    listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });

                // Update the state with the fetched listings and set loading to false
                setListings(listings);
                setLoading(false);
            } catch (error) {
                // Handle any errors that might occur during fetching
                console.error("Error fetching listings:", error);
                setLoading(false);
            }
        }

        // Call the fetchListings function
        fetchListings();
    }, []);

    // Render the appropriate components based on the loading and listing state
    if (loading) {
        // If loading is true, display the Spinner component while data is being fetched
        return <Spinner />;
    }

    if (listings.length === 0) {
        // If there are no listings, display nothing
        return <></>;
    }

    return (
        // Render the Swiper component with the fetched listings
        <>
            <Swiper slidesPerView={1}
                navigation
                Scrollbar={{ draggable: true }}
                pagination={{ type: "progressbar" }}
                effect="fade"
                loop="true"
                autoplay={{ delay: 3000 }}>
                {listings.map(({ data, id }) => (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${data.id}`)}>
                        {/* Render the listing's image */}
                        <div className="relative w-full h-[300px] overflow-hidden" style={{ background: `url(${data.imgUrls[0]}) center, no-repeat`, backgroundSize: "cover", }}></div>

                        {/* Render the listing's name */}
                        <p className='text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl'> {data.name} </p>

                        {/* Render the listing's price */}
                        <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
                            ${data.discountedPrice ?? data.regularPrice}
                            {data.type === "rent" && " / month"}
                        </p>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}
