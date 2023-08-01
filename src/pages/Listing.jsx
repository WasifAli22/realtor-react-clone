import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../firebase'
import Spinner from '../components/Spinner'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwipperCore from 'swiper';
// eslint-disable-next-line no-unused-vars
import { EffectFade, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';


export default function Listing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true);
    SwipperCore.use([Autoplay, Navigation, Pagination])
    const params = useParams()
    useEffect(() => {
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)

            }
        }
        fetchListing()
    }, [params.listingId])
    if (loading) {
        return <Spinner />
    }

    return (
        <main>
            <Swiper
                slidesPerView={1}
                navigation
                // pagination={{ clickable: true }}
                Scrollbar={{ draggable: true }}
                pagination={{ type: "progressbar" }}
                effect="fade"
                loop="true"
                // modules={[EffectFade]}
                autoplay={{ delay: 3000 }}
            >
                {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div className="w-full relative overflow-hidden h-[300px]" style={{ background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: "cover" }}>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </main>
    )
}
