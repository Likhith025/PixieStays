'use client';

import React, { useEffect, useState } from 'react';
import { getLinks, createLink, updateLink, deleteLink } from '@/lib/api';
import Button from '@/components/ui/Button';
import { FiTrash, FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiYoutube, FiGlobe, FiLink, FiEdit2, FiX, FiPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Map icon strings to components
const iconMap: any = {
    'FiFacebook': FiFacebook,
    'FiInstagram': FiInstagram,
    'FiTwitter': FiTwitter,
    'FiLinkedin': FiLinkedin,
    'FiYoutube': FiYoutube,
    'FiGlobe': FiGlobe,
    'FiLink': FiLink
};

export default function LinkManager() {
    const [links, setLinks] = useState([]);
    const [formData, setFormData] = useState({ name: '', url: '', icon: 'FiLink' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchLinks = async () => {
        const data = await getLinks();
        setLinks(data as any);
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', url: '', icon: 'FiLink' });
        setEditingId(null);
    };

    const openAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleEdit = (link: any) => {
        setFormData({ name: link.name, url: link.url, icon: link.icon });
        setEditingId(link._id);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await updateLink(editingId, formData);
        } else {
            await createLink(formData);
        }
        setIsModalOpen(false);
        resetForm();
        fetchLinks();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this link?')) {
            await deleteLink(id);
            fetchLinks();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading text-gray-900">Social Media Links</h1>
                <Button onClick={openAddModal} className="flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all cursor-pointer">
                    <FiPlus /> Add New Link
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {links.map((link: any) => {
                        const Icon = iconMap[link.icon] || FiLink;
                        return (
                            <motion.div
                                key={link._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group cursor-pointer"
                            >
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className={`p-3 rounded-xl text-2xl transition-colors duration-300 ${link.name.toLowerCase().includes('instagram') ? 'bg-pink-50 text-pink-500 group-hover:bg-pink-100' :
                                        link.name.toLowerCase().includes('facebook') ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' :
                                            'bg-gray-50 text-gray-700 group-hover:bg-gray-100'
                                        }`}>
                                        <Icon />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-gray-900 text-lg">{link.name}</h4>
                                        <a href={link.url} target="_blank" className="text-sm text-gray-500 hover:text-primary block break-all transition-colors">{link.url}</a>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEdit(link)}
                                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg shadow-sm"
                                    >
                                        <FiEdit2 />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(link._id)}
                                        className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg shadow-sm"
                                    >
                                        <FiTrash />
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Link' : 'Add New Link'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <FiX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Platform Name</label>
                                    <input required type="text" placeholder="Facebook" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-black transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700">URL</label>
                                    <input required type="url" placeholder="https://..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-black transition-all" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Icon</label>
                                    <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-black bg-white transition-all appearance-none cursor-pointer" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })}>
                                        {Object.keys(iconMap).map(icon => (
                                            <option key={icon} value={icon}>{icon.replace('Fi', '')}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pt-2">
                                    <Button type="submit" className="w-full justify-center py-3 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                        {editingId ? 'Update Link' : 'Add Link'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
