import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
    // State to manage the page state (e.g., "Sign In" or "Profile")
    const [pageState, setPageState] = useState("Sign In")

    // Get the Firebase auth instance
    const auth = getAuth()

    // Effect hook to update pageState when user authentication changes
    useEffect(() => {
        // Listen for authentication state changes
        onAuthStateChanged(auth, (user) => {
            // If the user is logged in, set pageState to "Profile"
            // Otherwise, set it to "Sign In"
            if (user) {
                setPageState("Profile")
            } else {
                setPageState("Sign In")
            }
        })
    }, [auth]) // Only run this effect when the auth instance changes

    // Get the current location and navigation function from React Router
    const location = useLocation()
    const navigate = useNavigate()

    // Function to check if the given route matches the current location
    function pathMatchRoute(route) {
        if (route === location.pathname) {
            return true
        }
        // If the route doesn't match, return false
        return false
    }

    return (
        <div className='bg-white border-b shadow-sm sticky top-0 z-40'>
            <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
                <div className="">
                    <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="logo" onClick={() => navigate("/")} className='h-5 cursor-pointer' />
                </div>
                <div className="">
                    <ul className='flex space-x-10'>
                        {/* Home link with click event to navigate to the home page */}
                        <li className={`py-3 cursor-pointer text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute('/') && "!text-black !border-b-red-500"}`} onClick={() => navigate("/")}>Home</li>
                        {/* Offers link with click event to navigate to the offers page */}
                        <li className={`py-3 cursor-pointer text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute('/offers') && "!text-black !border-b-red-500"}`} onClick={() => navigate("/offers")}>Offers</li>
                        {/* Profile/Sign In link with click event to navigate to the profile page if signed in, otherwise sign-in page */}
                        <li className={`py-3 cursor-pointer text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
                        ${(pathMatchRoute('/sign-in') || pathMatchRoute('/profile')) && "!text-black !border-b-red-500"}`} onClick={() => navigate("/profile")}>{pageState}</li>
                    </ul>
                </div>
            </header>
        </div>
    )
}
