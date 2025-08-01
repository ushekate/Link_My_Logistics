"use client";

import Link from 'next/link';
import { Search, Menu, X } from "lucide-react";
import Packages from './components/packages/Packages';
import WhiteCard from './components/white-card/WhiteCard';
import GreenCard from './components/green-card/GreenCard';
import FAQ from "./components/faq/faq";
import Footer from './components/footer/Footer';
import { useEffect, useState } from "react";
import MobileWhiteCard from "./components/white-card/mobileWhiteCard";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from 'next/image';
import Navbar from './components/header/navbar';
import { usePathname } from 'next/navigation';


export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const info = [
    { no: "5.6K+", label: "Global Partners" },
    { no: "100K", label: "Monthly Deliveries" },
    { no: "24/7", label: "Customer Support" },
    { no: "150K+", label: "Satisfied Customers" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [
    '/bgimg.jpeg',
    '/bgimg1.jpeg',
    '/bgimg2.jpeg',
    '/bgimg3.webp',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 4000); // change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white">
      {/* Glassmorphism Navbar */}
      {/* <Navbar /> */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-md border-b border-white/20 flex justify-between items-center px-6 py-3 h-auto">
        <div className="w-auto h-full flex justify-center items-center pt-2 px-2">
          <Image
            src={'/logistics-logo.png'}
            width={250}
            height={100}
            alt='Logo'
          />
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="text-black" /> : <Menu className="text-black" />}
          </button>
        </div>

        <div
          className={`absolute md:static top-20 md:top-0 right-0 w-3/4 md:w-auto md:flex transition-all duration-300 ease-in-out z-20
          ${menuOpen ? 'flex flex-col bg-background backdrop-blur-md shadow-lg rounded-l-lg p-6' : 'hidden'}
          md:flex md:flex-row md:bg-transparent md:shadow-none md:rounded-none md:p-0 space-y-4 md:space-y-0 md:space-x-10`}
        >
          {[
            { text: 'Home', href: '/' },
            { text: 'Services', href: '/services' },
            { text: 'About Us', href: '/about' },
            { text: 'Contact Us', href: '/contact' },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              // className="cursor-pointer text-primary md:text-white md:drop-shadow-lg hover:underline text-lg font-semibold transition-all duration-200 hover:text-blue-200"
              className={`cursor-pointer text-lg font-semibold transition-all duration-200 hover:underline hover:text-primary ${pathname === item.href ? 'text-primary underline' : 'text-foreground'
                }`}
            >
              {item.text}
            </Link>
          ))}

          <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
            <Link
              href="/customer/login"
              className="text-primary bg-white/90 backdrop-blur-sm px-4 py-1.5 text-sm rounded-3xl text-center hover:bg-white transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/client/register"
              className="bg-primary/90 backdrop-blur-sm text-white px-4 py-1.5 text-sm rounded-3xl text-center hover:bg-primary transition-all duration-200"
            >
              Be a Merchant
            </Link>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-cover bg-center backdrop-blur-sm transition-all mt-8 duration-1000"
        style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})`, }}
      >
        {
          useIsMobile() ? (
            <MobileWhiteCard />
          ) : (
            <WhiteCard />
          )
        }
      </div>

      <section className="px-6 sm:px-20 py-16 bg-accent">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-10 text-center">
          News & Updates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* News Cards */}
          <div className="md:col-span-2 space-y-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-2xl hover:shadow-md transition overflow-hidden">
              <img
                src="https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg"
                alt="Singapore Logistics Hub"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-black">
                  New Hub Opened in Singapore
                </h3>
                <p className="mt-2 text-black">
                  We have officially launched our new logistics hub in Singapore
                  to better serve customers in Southeast Asia. This hub
                  increases our regional delivery capacity by 40%.
                </p>
                <span className="text-sm text-gray-500 mt-2 block">
                  Posted on May 28, 2025
                </span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-2xl hover:shadow-md transition overflow-hidden">
              <img
                src="https://images.pexels.com/photos/221047/pexels-photo-221047.jpeg"
                alt="Eco-Friendly Packaging"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-black">
                  CFS Launches Eco-Friendly Packaging
                </h3>
                <p className="mt-2 text-black">
                  In our mission to reduce carbon footprint, CFS is introducing
                  recyclable, biodegradable packaging materials across all
                  services globally.
                </p>
                <span className="text-sm text-gray-500 mt-2 block">
                  Posted on May 20, 2025
                </span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-2xl hover:shadow-md transition overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg"
                alt="24/7 Customer Support"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-black">
                  24/7 Customer Service Now Available
                </h3>
                <p className="mt-2 text-black">
                  You spoke, we listened! Our support team is now available
                  around the clock to assist you with tracking, quotes, and
                  service inquiries.
                </p>
                <span className="text-sm text-gray-500 mt-2 block">
                  Posted on May 15, 2025
                </span>
              </div>
            </div>
          </div>
          {/* Updates Sidebar */}
          <aside className="bg-white p-6 rounded-xl shadow-2xl">
            <h4 className="text-lg font-bold text-primary mb-4">
              Latest Updates
            </h4>
            <ul className="space-y-4 text-sm text-gray-700 list-disc list-inside">
              <li>
                <span className="font-semibold">June 5:</span> Scheduled
                maintenance from 12:00 AM to 3:00 AM GMT.
              </li>
              <li>
                <span className="font-semibold">New Feature:</span> Real-time
                driver GPS tracking is live.
              </li>
              <li>
                <span className="font-semibold">Reminder:</span> Submit customs
                documents 24 hours before shipping.
              </li>
              <li>
                <span className="font-semibold">Update:</span> Mobile app v3.2
                now supports dark mode and QR scanning.
              </li>
              <li>
                <span className="font-semibold">Notice:</span> Expect delays in
                some regions due to severe weather.
              </li>
            </ul>
          </aside>
        </div>
      </section>
      <div className="bg-primary h-40 py-6 mt-10 flex flex-wrap justify-center items-center gap-y-4 gap-x-20 sm:gap-60 px-4">
        {info.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-white text-xs sm:text-base"
          >
            <h1 className="text-lg sm:text-3xl font-bold">{item.no}</h1>
            <h3 className="mt-1 text-[10px] sm:text-sm text-center">
              {item.label}
            </h3>
          </div>
        ))}
      </div>
      <GreenCard />
      <div className="bg-accent">
        <section className="text-center py-10">
          <h1 className="text-primary font-bold text-2xl sm:text-3xl">
            Track Your Package
          </h1>
          <div className="flex justify-center mt-6">
            <Link
              href="/tracking"
              className="bg-primary text-white px-8 py-3 rounded-md flex items-center space-x-2 hover:bg-blue-500 transition font-medium"
            >
              <Search size={18} />
              <span>Click Here to Track Your Package</span>
            </Link>
          </div>
        </section>
      </div>
      <FAQ />
      <Footer />
    </div>
  );
}
