'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiPhone, FiHome, FiUsers, FiMessageSquare } from 'react-icons/fi';
import Button from './ui/Button';
import { createEnquiry, getProperties } from '@/lib/api';

interface EnquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        propertyId: '',
        guests: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchProperties();
        }
    }, [isOpen]);

    const fetchProperties = async () => {
        const data = await getProperties();
        setProperties(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createEnquiry(formData);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData({ name: '', phone: '', propertyId: '', guests: '', description: '' });
                onClose();
            }, 2000);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold font-heading text-gray-900">Send Enquiry</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {success ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Sent!</h3>
                                    <p className="text-gray-500">We will get back to you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Name *</label>
                                            <div className="relative">
                                                <FiUser className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Your Name"
                                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 placeholder:text-gray-400"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Phone *</label>
                                            <div className="relative">
                                                <FiPhone className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="Phone Number"
                                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 placeholder:text-gray-400"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Property Interest</label>
                                        <div className="relative">
                                            <FiHome className="absolute left-3 top-3 text-gray-400" />
                                            <select
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900"
                                                value={formData.propertyId}
                                                onChange={e => setFormData({ ...formData, propertyId: e.target.value })}
                                            >
                                                <option value="">Select a Property (Optional)</option>
                                                {properties.map((p: any) => (
                                                    <option key={p._id} value={p._id}>{p.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Number of Guests</label>
                                        <div className="relative">
                                            <FiUsers className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Guests (Optional)"
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 placeholder:text-gray-400"
                                                value={formData.guests}
                                                onChange={e => setFormData({ ...formData, guests: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Message</label>
                                        <div className="relative">
                                            <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                                            <textarea
                                                rows={3}
                                                placeholder="Any specific requirements? (Optional)"
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            isLoading={loading}
                                        >
                                            Submit Enquiry
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EnquiryModal;
