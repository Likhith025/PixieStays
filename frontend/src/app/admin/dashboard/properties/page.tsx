'use client';

import React, { useEffect, useState } from 'react';
import { getProperties, createProperty, updateProperty, deleteProperty } from '@/lib/api';
import Button from '@/components/ui/Button';
import { FiPlus, FiTrash, FiImage, FiEdit2, FiX, FiUploadCloud, FiEye, FiCalendar } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import Link from 'next/link';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function PropertyManager() {
    const [properties, setProperties] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        images: [] as string[],
        amenities: [] as string[],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1
    });

    const fetchProperties = async () => {
        const data = await getProperties();
        setProperties(data as any);
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const resetForm = () => {
        setFormData({
            title: '', description: '', price: '', location: '',
            images: [], amenities: [], maxGuests: 2, bedrooms: 1, bathrooms: 1
        });
        setEditingId(null);
        setIsCreating(false);
    };

    const handleEdit = (property: any) => {
        setFormData({
            title: property.title,
            description: property.description,
            price: property.price,
            location: property.location,
            images: property.images || [],
            amenities: property.amenities || [],
            maxGuests: property.maxGuests,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms || 1
        });
        setEditingId(property._id);
        setIsCreating(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('image', file);

        try {
            // Updated to point to the correct backend port if needed, or rely on proxy/cors
            const res = await axios.post('http://localhost:5000/api/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            setFormData(prev => ({ ...prev, images: [...prev.images, res.data.url] }));
        } catch (err) {
            alert('Image upload failed');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price)
            };

            if (editingId) {
                await updateProperty(editingId, payload);
            } else {
                await createProperty(payload);
            }

            resetForm();
            fetchProperties();
        } catch (e) {
            alert('Failed to save property');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this property?')) {
            await deleteProperty(id);
            fetchProperties();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading text-gray-900">Property Manager</h1>
                {!isCreating && (
                    <Button onClick={() => setIsCreating(true)}>
                        <FiPlus className="mr-2" /> Add Property
                    </Button>
                )}
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Property' : 'Add New Property'}</h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                            <FiX size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-900">Title</label>
                                <input required type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary text-black" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-900">Location</label>
                                <input required type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary text-black" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-900">Description</label>
                            <div className="text-black bg-white rounded-lg">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={value => setFormData({ ...formData, description: value })}
                                    className="h-48 mb-12"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-900">Price / Night (₹)</label>
                                <input required type="number" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary text-black" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-900">Guests</label>
                                <input required type="number" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary text-black" value={formData.maxGuests} onChange={e => setFormData({ ...formData, maxGuests: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-900">Bedrooms</label>
                                <input required type="number" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary text-black" value={formData.bedrooms} onChange={e => setFormData({ ...formData, bedrooms: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-900">Bathrooms</label>
                                <input required type="number" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary text-black" value={formData.bathrooms} onChange={e => setFormData({ ...formData, bathrooms: Number(e.target.value) })} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900">Property Images (First is Cover)</label>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                        <img src={url} alt="Property" className="w-full h-full object-cover" />
                                        {index === 0 && (
                                            <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] text-center py-1">Cover</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                        >
                                            <FiX size={12} />
                                        </button>
                                    </div>
                                ))}

                                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:text-primary transition-colors text-gray-400 bg-gray-50">
                                    {uploading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    ) : (
                                        <>
                                            <FiUploadCloud size={24} />
                                            <span className="text-xs mt-1 text-center px-1">Add Image</span>
                                        </>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                            <Button type="submit">{editingId ? 'Update Property' : 'Create Property'}</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {properties.map((property: any) => (
                    <div key={property._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center bg-gray-50/50">
                        <div className="flex gap-4 items-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden relative flex-shrink-0">
                                {property.images?.[0] ? (
                                    <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <FiImage className="w-full h-full p-6 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{property.title}</h3>
                                <p className="text-sm text-gray-600">{property.location}</p>
                                <div className="mt-1 flex gap-3 text-xs text-gray-500">
                                    <span>₹{property.price}/night</span>
                                    <span>• {property.maxGuests} Guests</span>
                                    <span>• {property.bedrooms} Bed</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/admin/dashboard/properties/${property._id}/calendar`} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                                <FiCalendar />
                            </Link>
                            <button
                                onClick={() => handleEdit(property)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <FiEdit2 />
                            </button>
                            <button
                                onClick={() => handleDelete(property._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <FiTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
