import React from 'react';
import { Outlet, Navigate } from 'react-router';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

export default function PrivateRoute() {
    // Use the 'useAuthStatus' custom hook to get the authentication status and checking status
    const { loggedIn, checkingStatus } = useAuthStatus();

    // Check if the authentication status is still being checked
    if (checkingStatus) {
        // If checking is in progress, display a simple loading message
        return <Spinner/>
    }

    // If checking is completed, check if the user is logged in
    return loggedIn ? (
        // If the user is logged in, render the nested routes defined by 'Outlet'
        <Outlet />
    ) : (
        // If the user is not logged in, redirect them to the sign-in page
        <Navigate to="/sign-in" />
    );
}
