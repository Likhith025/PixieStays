import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import { getContent } from '@/lib/api';
import Link from 'next/link';

// Dynamically fetch content on the server (simulated for now by client fetch in useEffect or server component)
// Since this is Next.js App Router, we can make this async
export const revalidate = 0; // Disable cache for dev

export default async function Home() {
  const content = await getContent();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-e32c0ee48154?q=80&w=2070&auto=format&fit=crop')`
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-bold font-heading text-white mb-6 leading-tight drop-shadow-lg">
            {content.home_hero_title || "Experience Luxury Like Never Before"}
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-8 font-light max-w-2xl mx-auto drop-shadow-md">
            {content.home_hero_subtitle || "Handpicked villas and apartments for your perfect stay."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/properties">
              <Button size="lg" className="w-full sm:w-auto">View Properties</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights / Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">Why Choose PixieStays?</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Prime Locations", desc: "Properties in the most desired spots of the city." },
              { title: "Premium Interiors", desc: "Designed for comfort with high-end amenities." },
              { title: "24/7 Support", desc: "We are always here to help you have a great stay." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold font-heading mb-3 text-primary">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
