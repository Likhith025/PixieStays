'use client';

import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import { createBooking, verifyCoupon } from '@/lib/api';
import { FiTag, FiCheck, FiX } from 'react-icons/fi';

const BookingForm = ({ propertyId, pricePerNight }: { propertyId: string, pricePerNight: number }) => {
    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkIn: '',
        checkOut: '',
        guests: 1
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
        if (formData.checkIn && formData.checkOut) {
            const start = new Date(formData.checkIn);
            const end = new Date(formData.checkOut);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                setNights(diffDays);
                const total = diffDays * pricePerNight;
                setOriginalTotal(total);
                // Reset coupon if dates change as total changes
                if (couponStatus) {
                    setCouponStatus(null);
                    setFinalTotal(total);
                } else {
                    setFinalTotal(total);
                }
            } else {
                setNights(0);
                setOriginalTotal(0);
                setFinalTotal(0);
            }
        }
    }, [formData.checkIn, formData.checkOut, pricePerNight]);

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
                propertyId,
                totalPrice: finalTotal,
                couponCode: couponStatus?.valid ? couponCode : null,
                discountAmount: couponStatus?.valid ? couponStatus.discount : 0
            });
            setMessage('Booking request sent successfully! We will contact you shortly.');
            setFormData({ guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', guests: 1 });
            setCouponCode('');
            setCouponStatus(null);
            setNights(0);
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold font-heading mb-4 text-gray-900">Book This Stay</h3>
            <div className="text-2xl font-bold text-primary mb-6">₹{pricePerNight} <span className="text-sm text-gray-400 font-normal">/ night</span></div>

            {message && (
                <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input required type="text" name="guestName" value={formData.guestName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-black" placeholder="John Doe" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input required type="tel" name="guestPhone" value={formData.guestPhone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-black" placeholder="+91 99999 99999" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required type="email" name="guestEmail" value={formData.guestEmail} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-black" placeholder="john@example.com" />
                </div>

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

                {/* Coupon Section */}
                {originalTotal > 0 && (
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
                )}

                {/* Total Calculation */}
                {nights > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center text-gray-600 mb-2">
                            <span>₹{pricePerNight} x {nights} nights</span>
                            <span>₹{originalTotal.toLocaleString('en-IN')}</span>
                        </div>
                        {couponStatus?.valid && (
                            <div className="flex justify-between items-center text-green-600 mb-2 font-medium">
                                <span>Discount Applied</span>
                                <span>-₹{couponStatus.discount.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center font-bold text-lg text-gray-900 mt-2">
                            <span>Total</span>
                            <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                )}

                <Button type="submit" isLoading={loading} className="w-full mt-2">Request Booking</Button>
            </form>
        </div>
    );
};

export default BookingForm;
