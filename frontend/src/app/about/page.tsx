'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getContent } from '@/lib/api';

export default function AboutPage() {
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getContent();
                setContent(data);
            } catch (error) {
                console.error('Failed to fetch content');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-primary pt-32 pb-20 px-4 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                    {content.about_title || 'About PixieStays'}
                </h1>
                <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    ) : (
                        <div
                            className="prose prose-lg text-gray-600 max-w-none prose-headings:font-heading prose-a:text-primary"
                            dangerouslySetInnerHTML={{ __html: content.about_content || 'Welcome to PixieStays! We are dedicated to providing the best hospitality experience.' }}
                        />
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
