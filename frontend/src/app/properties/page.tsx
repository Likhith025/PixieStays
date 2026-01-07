import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { getProperties } from '@/lib/api';

export const revalidate = 0;

export default async function PropertiesPage() {
    const properties = await getProperties();

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold font-heading text-gray-900 mb-4">Our Premium Collection</h1>
                    <p className="text-gray-600 text-lg max-w-2xl">Find the perfect space for your next stay. Whether it's a cozy apartment or a luxury villa, we have it all.</p>
                </div>

                {properties.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">No properties found at the moment. Please come back later!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property: any) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
