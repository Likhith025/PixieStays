'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { FiMenu, FiX, FiHome, FiInfo, FiGrid, FiPhone } from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'Home', href: '/', icon: FiHome },
        { name: 'Properties', href: '/properties', icon: FiGrid },
        { name: 'About', href: '/about', icon: FiInfo },
        { name: 'Contact', href: '/contact', icon: FiPhone },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold font-heading text-primary tracking-tight">
                            Pixie<span className="text-secondary">Stays</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm uppercase tracking-wider"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/properties">
                            <Button size="sm">Book Now</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-foreground focus:outline-none">
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Animate Presence */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden glass border-t border-gray-200 absolute w-full"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-4 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-gray-50 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 pb-2">
                                <Link href="/properties" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full">Book Your Stay</Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
