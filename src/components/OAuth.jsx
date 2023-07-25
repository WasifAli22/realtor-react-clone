import React from 'react'
import { FcGoogle } from "react-icons/fc"
export default function OAuth() {
    return (
        <button className='flex items-center justify-center rounded w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out'>
            <FcGoogle className='bg-white rounded-full text-2xl mr-2' />
            Continue with Google
        </button>
    )
}
