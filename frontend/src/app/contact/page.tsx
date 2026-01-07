import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import { getContent } from '@/lib/api';

export const revalidate = 0;

export default async function ContactPage() {
    const content = await getContent();

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">Get in Touch</h1>
                    <p className="text-gray-600 text-lg">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="bg-gray-50 p-8 rounded-2xl">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Contact Information</h3>
                            <div className="space-y-4 text-gray-600">
                                <p className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 w-20">Email:</span>
                                    {content.contact_email || "hello@pixiestays.com"}
                                </p>
                                <p className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 w-20">Phone:</span>
                                    {content.contact_phone || "+91 98765 43210"}
                                </p>
                                <p className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 w-20">Address:</span>
                                    Andheri West, Mumbai, India
                                </p>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                            <h3 className="text-xl font-semibold mb-2 text-primary">For Guests</h3>
                            <p className="text-gray-600 mb-4">Looking for immediate assistance with a booking?</p>
                            <a href={`https://wa.me/${(content.contact_phone || "919876543210").replace(/[^0-9]/g, '')}`} target="_blank">
                                <Button className="w-full">Chat on WhatsApp</Button>
                            </a>
                        </div>
                    </div>

                    {/* Simple Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none" placeholder="How can we help?" />
                            </div>
                            <Button className="w-full" size="lg">Send Message</Button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
