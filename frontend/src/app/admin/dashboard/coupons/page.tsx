'use client';

import React, { useEffect, useState } from 'react';
import { getCoupons, createCoupon, deleteCoupon, updateCoupon } from '@/lib/api';
import Button from '@/components/ui/Button';
import { FiTrash2, FiPlus, FiTag, FiCalendar, FiCheck } from 'react-icons/fi';

export default function CouponPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderValue: 0,
        maxDiscountAmount: 0,
        validUntil: '',
        usageLimit: 0,
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        const data = await getCoupons();
        setCoupons(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            await deleteCoupon(id);
            fetchCoupons();
        }
    };

    const handleToggleStatus = async (coupon: any) => {
        await updateCoupon(coupon._id, { isActive: !coupon.isActive });
        fetchCoupons();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCoupon(formData);
            setShowForm(false);
            fetchCoupons();
            // Reset form
            setFormData({
                code: '',
                description: '',
                discountType: 'percentage',
                discountValue: 0,
                minOrderValue: 0,
                maxDiscountAmount: 0,
                validUntil: '',
                usageLimit: 0,
                isActive: true
            });
        } catch (err) {
            alert('Failed to create coupon');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-gray-900">Smart Coupons</h1>
                    <p className="text-gray-500">Manage discounts and promo codes</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <FiPlus className="mr-2" /> {showForm ? 'Cancel' : 'Create Coupon'}
                </Button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-fade-in">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">New Coupon Details</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                            <input
                                type="text"
                                required
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full p-3 border border-gray-200 rounded-xl font-mono uppercase tracking-wider text-black"
                                placeholder="SUMMER2024"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <input
                                type="text"
                                required
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-3 border border-gray-200 rounded-xl text-black"
                                placeholder="Summer Sale Discount"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                            <select
                                value={formData.discountType}
                                onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                className="w-full p-3 border border-gray-200 rounded-xl text-black"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.discountValue}
                                    onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                    className="w-full p-3 border border-gray-200 rounded-xl text-black"
                                    placeholder={formData.discountType === 'percentage' ? '10' : '500'}
                                />
                                <span className="font-bold text-gray-500">
                                    {formData.discountType === 'percentage' ? '%' : '₹'}
                                </span>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Value (₹)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.minOrderValue}
                                onChange={e => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                                className="w-full p-3 border border-gray-200 rounded-xl text-black"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount (for % type)</label>
                            <input
                                type="number"
                                min="0"
                                disabled={formData.discountType === 'flat'}
                                value={formData.maxDiscountAmount}
                                onChange={e => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                                className="w-full p-3 border border-gray-200 rounded-xl disabled:bg-gray-50 text-black"
                                placeholder="Leave 0 for no limit"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                            <input
                                type="date"
                                required
                                value={formData.validUntil}
                                onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                                className="w-full p-3 border border-gray-200 rounded-xl text-black"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit (0 for unlimited)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.usageLimit}
                                onChange={e => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                className="w-full p-3 border border-gray-200 rounded-xl text-black"
                            />
                        </div>

                        <div className="col-span-2">
                            <Button type="submit" size="lg" className="w-full justify-center">
                                Create Smart Coupon
                            </Button>
                        </div>
                    </form>

                    {/* Helpful Examples Section */}
                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FiTag className="text-primary" /> Coupon Logic Examples
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                            {/* Valid Example 1 */}
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                <div className="flex items-center gap-2 font-bold text-green-800 mb-1">
                                    <FiCheck /> Valid: Percentage Discount
                                </div>
                                <p className="text-green-700">
                                    <strong>Rules:</strong> 10% Off, Min Order ₹5000<br />
                                    <strong>Booking:</strong> Total ₹8000<br />
                                    <strong>Result:</strong> <span className="underline">✅ Discount of ₹800 Applied</span>
                                </p>
                            </div>

                            {/* Valid Example 2 */}
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                <div className="flex items-center gap-2 font-bold text-green-800 mb-1">
                                    <FiCheck /> Valid: Flat Discount
                                </div>
                                <p className="text-green-700">
                                    <strong>Rules:</strong> ₹500 Off, Min Order ₹2000<br />
                                    <strong>Booking:</strong> Total ₹3500<br />
                                    <strong>Result:</strong> <span className="underline">✅ Discount of ₹500 Applied</span>
                                </p>
                            </div>

                            {/* Invalid Example 1 */}
                            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                <div className="flex items-center gap-2 font-bold text-red-800 mb-1">
                                    <FiCheck className="rotate-45" /> Invalid: Low Order Value
                                </div>
                                <p className="text-red-700">
                                    <strong>Rules:</strong> ₹1000 Off, Min Order ₹10,000<br />
                                    <strong>Booking:</strong> Total ₹5,000<br />
                                    <strong>Result:</strong> <span className="underline">❌ Error: Minimum order of ₹10,000 required</span>
                                </p>
                            </div>

                            {/* Invalid Example 2 */}
                            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                <div className="flex items-center gap-2 font-bold text-red-800 mb-1">
                                    <FiCheck className="rotate-45" /> Invalid: Expired
                                </div>
                                <p className="text-red-700">
                                    <strong>Rules:</strong> Valid Until Yesterday<br />
                                    <strong>Booking:</strong> Any Amount<br />
                                    <strong>Result:</strong> <span className="underline">❌ Error: Coupon has expired</span>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                    <div key={coupon._id} className={`bg-white p-6 rounded-2xl shadow-sm border ${coupon.isActive ? 'border-gray-200' : 'border-gray-100 opacity-75'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 text-blue-700 font-mono font-bold px-3 py-1 rounded-lg border border-blue-100 tracking-wider">
                                {coupon.code}
                            </div>
                            <div className={`px-2 py-0.5 rounded text-xs font-bold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <FiTag className="text-primary" />
                                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">{coupon.description}</p>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-xl">
                            <div className="flex justify-between">
                                <span>Min Order:</span>
                                <span className="font-medium">₹{coupon.minOrderValue}</span>
                            </div>
                            {coupon.maxDiscountAmount > 0 && (
                                <div className="flex justify-between">
                                    <span>Max Discount:</span>
                                    <span className="font-medium">₹{coupon.maxDiscountAmount}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Expires:</span>
                                <span className="font-medium">{new Date(coupon.validUntil).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Used:</span>
                                <span className="font-medium">{coupon.usedCount} times</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleToggleStatus(coupon)}
                                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${coupon.isActive ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                            >
                                {coupon.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                                onClick={() => handleDelete(coupon._id)}
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
