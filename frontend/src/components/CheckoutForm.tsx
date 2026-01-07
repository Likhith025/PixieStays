'use client';

import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import { createBooking, verifyCoupon } from '@/lib/api';
import { FiTag, FiCheck, FiX, FiCalendar, FiUsers, FiMapPin } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {
    property: any;
    checkIn: string;
    checkOut: string;
    guests: number;
}

const CheckoutForm = ({ property, checkIn, checkOut, guests }: CheckoutFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [couponStatus, setCouponStatus] = useState<{ valid: boolean, message: string, discount: number } | null>(null);
    const [verifying, setVerifying] = useState(false);

    // Derived State
    const [nights, setNights] = useState(0);
    const [originalTotal, setOriginalTotal] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);

    useEffect(() => {
        if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                setNights(diffDays);
                const total = diffDays * property.price;
                setOriginalTotal(total);
                setFinalTotal(total);
            }
        }
    }, [checkIn, checkOut, property.price]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode || originalTotal === 0) return;
        setVerifying(true);
        const result = await verifyCoupon(couponCode, originalTotal);
        setVerifying(false);

        if (result.valid) {
            setCouponStatus({ valid: true, message: result.message, discount: result.discount });
            setFinalTotal(originalTotal - result.discount);
        } else {
            setCouponStatus({ valid: false, message: result.message, discount: 0 });
            setFinalTotal(originalTotal);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await createBooking({
                ...formData,
                propertyId: property._id,
                checkIn,
                checkOut,
                guests,
                totalPrice: finalTotal,
                couponCode: couponStatus?.valid ? couponCode : null,
                discountAmount: couponStatus?.valid ? couponStatus.discount : 0
            });
            setMessage('Booking request sent successfully! We will contact you shortly.');
            // Optional: Redirect to success page or clear form
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Form */}
            <div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
                    <h2 className="text-2xl font-bold font-heading mb-6 text-gray-900">Guest Details</h2>
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input required type="text" name="guestName" value={formData.guestName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-black" placeholder="John Doe" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input required type="tel" name="guestPhone" value={formData.guestPhone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-black" placeholder="+91 99999 99999" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input required type="email" name="guestEmail" value={formData.guestEmail} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-black" placeholder="john@example.com" />
                        </div>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold font-heading mb-6 text-gray-900">Payment</h2>
                    <div className="space-y-4">
                        {/* Coupon Section */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FiTag className="text-primary" /> Have a Coupon?
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 uppercase font-medium outline-none focus:border-primary text-black"
                                    placeholder="CODE"
                                />
                                <Button type="button" size="sm" onClick={handleApplyCoupon} isLoading={verifying} className="px-4">
                                    Apply
                                </Button>
                            </div>
                            {couponStatus && (
                                <p className={`text-xs flex items-center gap-1 font-medium ${couponStatus.valid ? 'text-green-600' : 'text-red-500'}`}>
                                    {couponStatus.valid ? <FiCheck /> : <FiX />} {couponStatus.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-28">
                    <h3 className="text-xl font-bold font-heading mb-4 text-gray-900">Booking Summary</h3>

                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                                src={property.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'}
                                alt={property.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 line-clamp-2">{property.title}</h4>
                            <div className="text-sm text-gray-500 mt-1 flex items-center gap-1"><FiMapPin size={14} /> {property.location}</div>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
                        <div className="flex justify-between">
                            <span className="flex items-center gap-2"><FiCalendar /> Check-in</span>
                            <span className="font-medium text-gray-900">{checkIn}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center gap-2"><FiCalendar /> Check-out</span>
                            <span className="font-medium text-gray-900">{checkOut}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center gap-2"><FiUsers /> Guests</span>
                            <span className="font-medium text-gray-900">{guests}</span>
                        </div>
                    </div>

                    <div className="space-y-2 mb-6 pb-6 border-b border-gray-100">
                        <div className="flex justify-between items-center text-gray-600">
                            <span>₹{property.price} x {nights} nights</span>
                            <span>₹{originalTotal.toLocaleString('en-IN')}</span>
                        </div>
                        {couponStatus?.valid && (
                            <div className="flex justify-between items-center text-green-600 font-medium">
                                <span>Discount</span>
                                <span>-₹{couponStatus.discount.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center font-bold text-xl text-gray-900 mb-6">
                        <span>Total Payble</span>
                        <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <Button
                        type="submit"
                        form="checkout-form"
                        isLoading={loading}
                        className="w-full py-4 text-lg"
                    >
                        Confirm Booking
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutForm;
