'use client';

import React, { useEffect, useState } from 'react';
import { getBookings } from '@/lib/api';

export default function BookingManager() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await getBookings();
            setBookings(data as any);
        };
        fetch();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading text-gray-900">Manage Bookings</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-black text-sm">
                        <tr>
                            <th className="py-4 px-6">Guest Info</th>
                            <th className="py-4 px-6">Property</th>
                            <th className="py-4 px-6">Dates</th>
                            <th className="py-4 px-6">Guests</th>
                            <th className="py-4 px-6">Total</th>
                            <th className="py-4 px-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking: any) => (
                            <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="font-medium text-black">{booking.guestName}</div>
                                    <div className="text-sm text-black">{booking.guestEmail}</div>
                                    <div className="text-sm text-black">{booking.guestPhone}</div>
                                </td>
                                <td className="py-4 px-6 font-medium text-black">
                                    {booking.propertyId?.title || 'Unknown Property'}
                                </td>
                                <td className="py-4 px-6 text-sm text-black">
                                    {new Date(booking.checkIn).toLocaleDateString()} <br /> to <br />
                                    {new Date(booking.checkOut).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-sm text-black">{booking.guests}</td>
                                <td className="py-4 px-6 font-medium text-black">₹{booking.totalPrice}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && <div className="p-8 text-center text-gray-500">No bookings to display.</div>}
            </div>
        </div>
    );
}
