'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLinks, getContent } from '@/lib/api';
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiYoutube, FiGlobe, FiLink } from 'react-icons/fi';

const iconMap: any = {
    'FiFacebook': FiFacebook,
    'FiInstagram': FiInstagram,
    'FiTwitter': FiTwitter,
    'FiLinkedin': FiLinkedin,
    'FiYoutube': FiYoutube,
    'FiGlobe': FiGlobe,
    'FiLink': FiLink
};

const Footer = () => {
    const [links, setLinks] = useState([]);
    const [content, setContent] = useState<any>({});

    useEffect(() => {
        const fetchData = async () => {
            const [linksData, contentData] = await Promise.all([
                getLinks(),
                getContent()
            ]);
            setLinks(linksData as any);
            setContent(contentData);
        };
        fetchData();
    }, []);

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold font-heading text-white tracking-tight">
                            Pixie<span className="text-secondary">Stays</span>
                        </Link>
                        <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                            Experience premium vacation rentals in the heart of the city. curated for comfort and style.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-secondary">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/properties" className="text-gray-400 hover:text-white transition-colors">Properties</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-secondary">Contact</h3>
                        <ul className="mt-4 space-y-2 text-gray-400">
                            <li>{content.contact_address || 'Andheri West, Mumbai'}</li>
                            <li>{content.contact_phone || '+91 98765 43210'}</li>
                            <li>{content.contact_email || 'hello@pixiestays.com'}</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-secondary">Follow Us</h3>
                        <div className="mt-4 flex space-x-4">
                            {links.map((link: any) => {
                                const Icon = iconMap[link.icon] || FiLink;
                                return (
                                    <a key={link._id} href={link.url} target="_blank" className="text-gray-400 hover:text-white text-xl transition-colors">
                                        <Icon />
                                    </a>
                                );
                            })}
                            {links.length === 0 && <span className="text-gray-500 text-sm">No links added yet.</span>}
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} PixieStays. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
