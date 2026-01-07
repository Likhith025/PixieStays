'use client';

import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import { useRouter } from 'next/navigation';

const BookingForm = ({ propertyId, pricePerNight }: { propertyId: string, pricePerNight: number }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1
    });

    // Derived State
    const [nights, setNights] = useState(0);
    const [originalTotal, setOriginalTotal] = useState(0);

    useEffect(() => {
        if (formData.checkIn && formData.checkOut) {
            const start = new Date(formData.checkIn);
            const end = new Date(formData.checkOut);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                setNights(diffDays);
                setOriginalTotal(diffDays * pricePerNight);
            } else {
                setNights(0);
                setOriginalTotal(0);
            }
        }
    }, [formData.checkIn, formData.checkOut, pricePerNight]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Redirect to checkout with query params
        const params = new URLSearchParams({
            propertyId,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            guests: formData.guests.toString()
        });

        router.push(`/checkout?${params.toString()}`);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold font-heading mb-4 text-gray-900">Book This Stay</h3>
            <div className="text-2xl font-bold text-primary mb-6">₹{pricePerNight} <span className="text-sm text-gray-400 font-normal">/ night</span></div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                        <input required type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                        <input required type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-black" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <input required type="number" min="1" name="guests" value={formData.guests} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-black" />
                </div>

                {/* Total Calculation */}
                {nights > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center text-gray-600 mb-2">
                            <span>₹{pricePerNight} x {nights} nights</span>
                            <span>₹{originalTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-lg text-gray-900 mt-2">
                            <span>Total</span>
                            <span>₹{originalTotal.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                )}

                <Button type="submit" className="w-full mt-2">Book Now</Button>
            </form>
        </div>
    );
};

export default BookingForm;
