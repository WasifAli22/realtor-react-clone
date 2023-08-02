import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

export default function Offers() {
  // State to hold the fetched listings, loading state, and the last fetched listing
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchListing] = useState(null);

  // Fetch the initial listings when the component mounts
  useEffect(() => {
    async function fetchListings() {
      try {
        // Get reference to the 'listings' collection
        const listingRef = collection(db, "listings");

        // Create the query to get offers, sorted by timestamp in descending order and limited to 8 listings
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(8)
        );

        // Execute the query and get the snapshot of results
        const querySnap = await getDocs(q);

        // Get the last visible document to use as a starting point for pagination
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListing(lastVisible);

        // Process the snapshot and create an array of listings
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        // Update the state with fetched listings and set loading to false
        setListings(listings);
        setLoading(false);
      } catch (error) {
        // Handle any errors that might occur during fetching and show a toast notification
        toast.error("Could not fetch listings");
      }
    }

    // Call the fetchListings function
    fetchListings();
  }, []);

  // Function to fetch more listings when the "Load more" button is clicked
  async function onFetchMoreListings() {
    try {
      // Get reference to the 'listings' collection
      const listingRef = collection(db, "listings");

      // Create the query to get more offers, sorted by timestamp in descending order and limited to 4 listings after the last fetched listing
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );

      // Execute the query and get the snapshot of results
      const querySnap = await getDocs(q);

      // Get the last visible document to use as a starting point for the next pagination
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);

      // Process the snapshot and create an array of additional listings
      const listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      // Update the state with the additional fetched listings by appending them to the existing listings
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      // Handle any errors that might occur during fetching and show a toast notification
      toast.error("Could not fetch more listings");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-3">
      {/* Render the heading */}
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">Offers</h1>

      {/* Check if data is still loading */}
      {loading ? (
        <Spinner /> // Show the Spinner component while loading
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            {/* Render the fetched listings */}
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {/* Render the "Load more" button if there are more listings to fetch */}
          {lastFetchedListing && (
            <div className="flex justify-center items-center">
              <button
                onClick={onFetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There are no current offers</p> // Show a message if there are no listings
      )}
    </div>
  );
}
