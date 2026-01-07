'use client';

import React, { useEffect, useState } from 'react';
import { getEnquiries, updateEnquiry, deleteEnquiry } from '@/lib/api';
import Button from '@/components/ui/Button';
import { FiTrash2, FiSave, FiMessageSquare, FiUser, FiPhone, FiHome, FiUsers } from 'react-icons/fi';

const EnquiriesPage = () => {
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        setLoading(true);
        const data = await getEnquiries();
        setEnquiries(data);
        setLoading(false);
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        // Optimistic update
        const originalEnquiries = [...enquiries];
        setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));

        try {
            await updateEnquiry(id, { status: newStatus });
        } catch (error) {
            setEnquiries(originalEnquiries); // Revert on fail
            alert("Failed to update status");
        }
    };

    const handleNoteSave = async (id: string, note: string) => {
        try {
            await updateEnquiry(id, { adminNote: note });
            alert("Note saved!");
        } catch (error) {
            alert("Failed to save note");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this enquiry?")) return;
        try {
            await deleteEnquiry(id);
            setEnquiries(prev => prev.filter(e => e._id !== id));
        } catch (error) {
            alert("Failed to delete enquiry");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading enquiries...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading text-gray-900">Enquiries</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {enquiries.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        No enquiries found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold uppercase tracking-wider border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4">Message</th>
                                    <th className="px-6 py-4 w-1/4">Admin Note</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {enquiries.map((enquiry) => (
                                    <tr key={enquiry._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <select
                                                value={enquiry.status}
                                                onChange={(e) => handleStatusChange(enquiry._id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold focus:outline-none cursor-pointer border-0
                                                    ${enquiry.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                        enquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                                                            enquiry.status === 'Converted' ? 'bg-green-100 text-green-700' :
                                                                'bg-gray-100 text-gray-700'}`}
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Converted">Converted</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 flex items-center gap-2">
                                                <FiUser className="text-gray-400" /> {enquiry.name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                <FiPhone className="text-gray-400" /> {enquiry.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 space-y-1">
                                            {enquiry.propertyId && (
                                                <div className="flex items-center gap-2 text-indigo-600 font-medium">
                                                    <FiHome size={14} /> {enquiry.propertyId.title}
                                                </div>
                                            )}
                                            {enquiry.guests && (
                                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                    <FiUsers size={14} /> {enquiry.guests} Guests
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2">
                                                <FiMessageSquare className="text-gray-400 mt-1 flex-shrink-0" />
                                                <p className="line-clamp-3 text-gray-600 italic">"{enquiry.description || 'No message'}"</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <textarea
                                                className="w-full text-xs p-2 border border-gray-200 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-y"
                                                rows={3}
                                                placeholder="Internal notes..."
                                                defaultValue={enquiry.adminNote}
                                                onBlur={(e) => {
                                                    if (e.target.value !== enquiry.adminNote) {
                                                        handleNoteSave(enquiry._id, e.target.value);
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(enquiry._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Enquiry"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnquiriesPage;
