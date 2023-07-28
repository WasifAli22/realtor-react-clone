import React, { useState } from 'react'

export default function CreateListing() {
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
    })
    const { type, name, bedrooms, bathrooms, furnished, parking, address, description, offer, regularPrice, discountedPrice } = formData
    function onchange() {

    }
    return (
        <main className='max-w-md mx-auto px-2'>
            <h1 className='text-3xl text-center mt-6 font-bold'> Create a Listing</h1>
            <form>
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
                        type='button' id='type' value="sale" onClick={onchange}>Rent
                    </button>
                </div>
                <p className='text-lg mt-6 font-semibold'>Name</p>
                <input type="text" id='name' value={name} onchange={onchange} className='mb-6 px-4 py-2 text-gray-700 w-full text-xl bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' required placeholder='Name' maxLength="32" minLength="10" />
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
                <textarea type="text" id='address' value={address} onchange={onchange} className='mb-6 px-4 py-2 text-gray-700 w-full text-xl bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' required placeholder='Address' />
                <p className='text-lg font-semibold'>Description</p>
                <textarea type="text" id='description' value={description} onchange={onchange} className='mb-6 px-4 py-2 text-gray-700 w-full text-xl bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' required placeholder='Description' />
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
                <button type="submit" className='mb-6 w-full px-7 py-3 bg-blue-600 text-white text-sm uppercase font-medium rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-xl transition ease-in-out duration-150'>Create Listing</button>
            </form>

        </main>
    )
}
