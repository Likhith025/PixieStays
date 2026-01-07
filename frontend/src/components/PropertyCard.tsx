'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiUsers } from 'react-icons/fi';

interface PropertyProps {
    _id: string;
    title: string;
    images: string[];
    location: string;
    price: number;
    maxGuests: number;
}

const PropertyCard: React.FC<{ property: PropertyProps }> = ({ property }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={property.images[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80"}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary shadow-sm">
                    ₹{property.price.toLocaleString()}/night
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiMapPin className="mr-1 text-secondary" />
                    {property.location}
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-600 text-sm">
                        <FiUsers className="mr-2" />
                        Up to {property.maxGuests} guests
                    </div>
                    <Link href={`/properties/${property._id}`} className="text-primary font-medium hover:text-secondary transition-colors">
                        View Details →
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default PropertyCard;
