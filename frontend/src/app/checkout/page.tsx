import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutForm from '@/components/CheckoutForm';
import { getProperty } from '@/lib/api';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Checkout - PixieStays',
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ propertyId: string, checkIn: string, checkOut: string, guests: string }> }) {
    const params = await searchParams;
    const { propertyId, checkIn, checkOut, guests } = params;

    if (!propertyId || !checkIn || !checkOut || !guests) {
        redirect('/');
    }

    const property = await getProperty(propertyId);

    if (!property) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Property Not Found</h1>
                        <p className="text-gray-500 mt-2">The property you are trying to book does not exist.</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 md:px-8">
                <h1 className="text-3xl font-bold font-heading text-gray-900 mb-8">Finalize Your Booking</h1>

                <CheckoutForm
                    property={property}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    guests={parseInt(guests)}
                />
            </div>

            <Footer />
        </main>
    );
}
