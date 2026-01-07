import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { getProperty } from '@/lib/api';
import Image from 'next/image';
import { FiMapPin, FiCheckCircle, FiUsers, FiMaximize2 } from 'react-icons/fi';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const property = await getProperty(resolvedParams.id);

    if (!property) return notFound();

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Image Grid (Placeholder for now, usually would handle 5 images) */}
            <div className="pt-24 pb-8 max-w-7xl mx-auto px-4 md:px-8">
                <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                    <Image
                        src={property.images[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80"}
                        alt={property.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full text-white flex items-center gap-2">
                        <FiMapPin /> {property.location}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold font-heading text-gray-900 mb-2">{property.title}</h1>
                            <div className="flex gap-4 text-gray-500 text-sm">
                                <span className="flex items-center gap-1"><FiUsers /> {property.maxGuests} Guests</span>
                                <span className="flex items-center gap-1"><FiMaximize2 /> {property.bedrooms} Bedrooms</span>
                            </div>
                        </div>

                        <div className="prose prose-lg text-gray-600">
                            <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">About this space</h3>
                            <p className="whitespace-pre-line">{property.description}</p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {property.amenities.map((amenity: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-gray-600 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                        <FiCheckCircle className="text-primary" /> {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Booking Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28">
                            <BookingForm propertyId={property._id} pricePerNight={property.price} />
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
