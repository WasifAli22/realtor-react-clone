import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'

// Custom hook to check the authentication status using Firebase
export function useAuthStatus() {
    // State variables to track login status and checking status
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    // useEffect hook to run the authentication check when the component mounts
    useEffect(() => {
        // Get the Firebase auth instance
        const auth = getAuth()

        // Use Firebase's onAuthStateChanged() method to listen for authentication state changes
        // This function will be called whenever the user's authentication state changes,
        // for example, when the user logs in or logs out.
        // The 'user' argument will be non-null if the user is logged in, and null if the user is logged out.
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // If 'user' is not null, it means the user is logged in, so update the loggedIn state to true
                setLoggedIn(true)
            }

            // Whether the user is logged in or not, the checking process is completed, so update the checkingStatus state to false
            setCheckingStatus(false)
        })

        // The empty dependency array [] ensures that this effect runs only once when the component mounts.
        // Since we don't have any dependencies, there's no need to re-run this effect during component updates.
    }, [])
    return { loggedIn, checkingStatus }
}
