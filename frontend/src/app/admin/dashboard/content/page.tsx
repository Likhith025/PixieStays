'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getContent, updateContent } from '@/lib/api';
import Button from '@/components/ui/Button';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function ContentManager() {
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const data = await getContent();
            setContent(data);
        };
        fetch();
    }, []);

    const handleSave = async (key: string, value: string) => {
        setLoading(true);
        try {
            await updateContent({ key, value });
            alert('Updated!');
        } catch (e) {
            alert('Failed to update');
        } finally {
            setLoading(false);
        }
    };

    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    }), []);

    const knownFields = [
        { key: 'home_hero_title', label: 'Home Hero Title', type: 'text' },
        { key: 'home_hero_subtitle', label: 'Home Hero Subtitle', type: 'text' },
        { key: 'about_title', label: 'About Page Title', type: 'text' },
        { key: 'about_content', label: 'About Page Content', type: 'richtext' }, // Changed to richtext
        { key: 'contact_email', label: 'Contact Email', type: 'text' },
        { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
        { key: 'contact_address', label: 'Contact Address', type: 'text' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading text-gray-900">Site Content Editor</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                {knownFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <div className="flex flex-col gap-4">
                            {field.type === 'richtext' ? (
                                <div className="bg-white text-black">
                                    <ReactQuill
                                        theme="snow"
                                        value={content[field.key] || ''}
                                        onChange={(value) => setContent({ ...content, [field.key]: value })}
                                        modules={modules}
                                        className="h-64 mb-12" // Add margin bottom for toolbar
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleSave(field.key, content[field.key])}
                                            disabled={loading}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none min-h-[150px] text-black"
                                            value={content[field.key] || ''}
                                            onChange={(e) => setContent({ ...content, [field.key]: e.target.value })}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none text-black"
                                            value={content[field.key] || ''}
                                            onChange={(e) => setContent({ ...content, [field.key]: e.target.value })}
                                        />
                                    )}
                                    <Button
                                        size="sm"
                                        onClick={() => handleSave(field.key, content[field.key])}
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-500">Note: Changes reflect immediately on the public website.</p>
        </div>
    );
}
