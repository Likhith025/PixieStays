'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { FiMenu, FiX, FiHome, FiInfo, FiGrid, FiPhone } from 'react-icons/fi';

import EnquiryModal from './EnquiryModal';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    const isHome = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'Home', href: '/', icon: FiHome },
        { name: 'Properties', href: '/properties', icon: FiGrid },
        { name: 'About', href: '/about', icon: FiInfo },
        { name: 'Contact', href: '/contact', icon: FiPhone },
    ];

    // Dynamic classes based on state
    const navClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || !isHome
        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
        : 'bg-transparent py-5'
        }`;

    const textClasses = scrolled || !isHome ? 'text-gray-900 hover:text-primary' : 'text-white hover:text-white/80';
    const logoClasses = scrolled || !isHome ? 'text-primary' : 'text-white';
    const spanClasses = scrolled || !isHome ? 'text-secondary' : 'text-white/90';

    return (
        <>
            <nav className={navClasses}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className={`text-2xl font-bold font-heading tracking-tight transition-colors ${logoClasses}`}>
                                Pixie<span className={spanClasses}>Stays</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8 items-center">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`${textClasses} transition-colors font-medium text-sm uppercase tracking-wider`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button
                                onClick={() => setIsEnquiryOpen(true)}
                                className={`${textClasses} transition-colors font-medium text-sm uppercase tracking-wider focus:outline-none`}
                            >
                                Enquiry
                            </button>
                            <Link href="/properties">
                                <Button size="sm" variant={scrolled || !isHome ? 'primary' : 'outline'} className={!scrolled && isHome ? 'text-white border-white hover:bg-white hover:text-primary' : ''}>
                                    Book Now
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsOpen(!isOpen)} className={`${textClasses} focus:outline-none`}>
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
                            className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                                {links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-4 rounded-md text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <button
                                    onClick={() => { setIsOpen(false); setIsEnquiryOpen(true); }}
                                    className="block w-full text-left px-3 py-4 rounded-md text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50 transition-colors text-center"
                                >
                                    Enquiry
                                </button>
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
            <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
        </>
    );
};

export default Navbar;
