'use client';

import React, { useEffect, useState } from 'react';
import { getContent, updateContent } from '@/lib/api';
import Button from '@/components/ui/Button';

// We need a way to fetch the raw list (including metadata like labels) not just the key-value map.
// I'll assume getContent returns { key: value } from public API, but for Admin we might need more info.
// Actually, let's update api/content/route.js to return array for admin if needed, OR just store metadata in the DB and return it all.
// The current `getContent` returns a map. I should create `getAllContentRaw` for admin or just rely on keys.
// For now, I'll rely on the keys I know or fetch the array. 
// Wait, my `getContent` controller returned a map `res.json(contentMap)`. 
// I should update the backend controller to support returning the full array for the admin panel.
// OR I can just map the known keys.
// Let's check `backend/controllers/contentController.js`. It returns a Map. 
// I'll update the backend to return the full list if a query param is present or a specific admin endpoint.
// Let's modify the backend first to be cleaner.
// I'll stick to the current plan: Modify backend to return array `if (req.query.format === 'raw')`.

export default function ContentManager() {
    // Placeholder until I fix backend return type or logic
    // Actually, I'll just hardcode the editing UI based on known keys for now to save time,
    // OR better, I'll fetch the content map and display inputs for each key.

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
            // content state updates automatically if we use inputs bound to local state
            alert('Updated!');
        } catch (e) {
            alert('Failed to update');
        } finally {
            setLoading(false);
        }
    };

    const knownFields = [
        { key: 'home_hero_title', label: 'Home Hero Title' },
        { key: 'home_hero_subtitle', label: 'Home Hero Subtitle' },
        { key: 'contact_email', label: 'Contact Email' },
        { key: 'contact_phone', label: 'Contact Phone' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading text-gray-900">Site Content Editor</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                {knownFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                                value={content[field.key] || ''}
                                onChange={(e) => setContent({ ...content, [field.key]: e.target.value })}
                            />
                            <Button
                                size="sm"
                                onClick={() => handleSave(field.key, content[field.key])}
                                disabled={loading}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-500">Note: Changes reflect immediately on the public website.</p>
        </div>
    );
}
