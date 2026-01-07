'use client';

import React, { useEffect, useState } from 'react';
import { getBookings, getProperties } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
    const [bookings, setBookings] = useState([]);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const b = await getBookings();
            const p = await getProperties();
            setBookings(b as any);
            setProperties(p as any);
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-heading text-gray-900">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 font-medium">Total Properties</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{properties.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 font-medium">Total Bookings</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 font-medium">Pending Enquiries</h3>
                    <p className="text-3xl font-bold text-secondary mt-2">
                        {bookings.filter((b: any) => b.status === 'pending').length}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-heading text-gray-900">Recent Bookings</h2>
                    <Link href="/admin/dashboard/bookings" className="text-primary hover:underline font-medium">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-gray-500 text-sm border-b">
                            <tr>
                                <th className="pb-3 pl-2">Guest</th>
                                <th className="pb-3">Property</th>
                                <th className="pb-3">Dates</th>
                                <th className="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {bookings.slice(0, 5).map((booking: any) => (
                                <tr key={booking._id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-3 pl-2 font-medium text-black">{booking.guestName}</td>
                                    <td className="py-3 text-black">{booking.propertyId?.title || 'Unknown Property'}</td>
                                    <td className="py-3 text-black">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</td>
                                    <td className="py-3 capitalize">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bookings.length === 0 && <p className="text-center text-gray-500 py-4">No bookings yet.</p>}
                </div>
            </div>
        </div>
    );
}
