import { useEffect, useState } from "react";
import Slider from "../components/Slider";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Home() {
    // State to hold offer listings, places for rent, and places for sale
    const [offerListing, setOfferListing] = useState(null);
    const [rentListing, setRentListing] = useState(null);
    const [saleListings, setSaleListings] = useState(null);

    // Fetch recent offers
    useEffect(() => {
        async function fetchOfferListings() {
            try {
                // Get reference to the 'listings' collection
                const listingRef = collection(db, "listings");
                // Create the query for offers, sorted by timestamp in descending order
                const q = query(listingRef, where("offer", "==", true), orderBy("timestamp", "desc"), limit(4));
                // Execute the query and get the snapshot of results
                const querySnap = await (getDocs(q));
                const listings = [];
                querySnap.forEach((doc) => {
                    listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                // Update the state with fetched offer listings
                setOfferListing(listings);
            } catch (error) {
                console.log("Error fetching offer listings:", error);
            }
        }
        // Call the fetchOfferListings function when the component mounts
        fetchOfferListings();
    }, []);

    // Fetch places for rent
    useEffect(() => {
        async function fetchRentListings() {
            try {
                // Get reference to the 'listings' collection
                const listingRef = collection(db, "listings");
                // Create the query for places for rent, sorted by timestamp in descending order
                const q = query(listingRef, where("type", "==", "rent"), orderBy("timestamp", "desc"), limit(4));
                // Execute the query and get the snapshot of results
                const querySnap = await (getDocs(q));
                const listings = [];
                querySnap.forEach((doc) => {
                    listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                // Update the state with fetched places for rent listings
                setRentListing(listings);
            } catch (error) {
                console.log("Error fetching places for rent listings:", error);
            }
        }
        // Call the fetchRentListings function when the component mounts
        fetchRentListings();
    }, []);

    // Fetch places for sale
    useEffect(() => {
        async function fetchSaleListings() {
            try {
                // Get reference to the 'listings' collection
                const listingRef = collection(db, "listings");
                // Create the query for places for sale, sorted by timestamp in descending order
                const q = query(listingRef, where("type", "==", "sale"), orderBy("timestamp", "desc"), limit(4));
                // Execute the query and get the snapshot of results
                const querySnap = await (getDocs(q));
                const listings = [];
                querySnap.forEach((doc) => {
                    listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                // Update the state with fetched places for sale listings
                setSaleListings(listings);
            } catch (error) {
                console.log("Error fetching places for sale listings:", error);
            }
        }
        // Call the fetchSaleListings function when the component mounts
        fetchSaleListings();
    }, []);

    return (
        <div>
            {/* Render the Slider component */}
            <Slider />

            <div className="max-w-6xl mx-auto pt-4 space-y-6">
                {/* Render recent offers section */}
                {offerListing && offerListing.length > 0 && (
                    <div className="m-2 mb-6">
                        <h2 className="px-3 text-2xl mt-6 font-semibold">Recent offers</h2>
                        {/* Link to view more offers */}
                        <Link to="/offers">
                            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                                Show more offers
                            </p>
                        </Link>
                        {/* Render offer listings */}
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                            {offerListing.map((listing) => (
                                <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                            ))}
                        </ul>
                    </div>
                )}

                {/* Render places for rent section */}
                {rentListing && rentListing.length > 0 && (
                    <div className="m-2 mb-6">
                        <h2 className="px-3 text-2xl mt-6 font-semibold">Places for rent</h2>
                        {/* Link to view more places for rent */}
                        <Link to="/category/rent">
                            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                                Show more places for rent
                            </p>
                        </Link>
                        {/* Render places for rent listings */}
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                            {rentListing.map((listing) => (
                                <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                            ))}
                        </ul>
                    </div>
                )}

                {/* Render places for sale section */}
                {saleListings && saleListings.length > 0 && (
                    <div className="m-2 mb-6">
                        <h2 className="px-3 text-2xl mt-6 font-semibold">Places for sale</h2>
                        {/* Link to view more places for sale */}
                        <Link to="/category/sale">
                            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                                Show more places for sale
                            </p>
                        </Link>
                        {/* Render places for sale listings */}
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                            {saleListings.map((listing) => (
                                <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
