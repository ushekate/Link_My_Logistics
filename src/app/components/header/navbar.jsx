'use client';

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const pathname = usePathname();

    // Scroll 
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            if (currentY > lastScrollY && currentY > 50) {
                // Scrolling down
                setShowNavbar(false);
            } else {
                // Scrolling up
                setShowNavbar(true);
            }

            setLastScrollY(currentY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
            {/* <nav className={`flex justify-between items-center px-6 py-3 ${pathname === '/contact' ? 'bg-white/50 shadow-lg' : 'bg-white/50 backdrop-blur-md border-b border-white/20'} transition-colors duration-300`}> */}
            <nav className="absolute top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-md border-b border-white/20 flex justify-between items-center px-6 py-3 h-auto">
                {/* Logo */}
                <div className="flex items-center pt-2 px-2">
                    <Image
                        src="/logistics-logo.png"
                        width={250}
                        height={100}
                        alt="Logo"
                    />
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
                    </button>
                </div>

                {/* Nav Links */}
                <div
                    className={`absolute md:static top-20 right-0 w-3/4 md:w-auto transition-all duration-300 ease-in-out z-40
            ${menuOpen ? 'flex flex-col bg-black/60 backdrop-blur-md shadow-lg rounded-l-lg p-6' : 'hidden'}
            md:flex md:flex-row md:items-center md:bg-transparent md:shadow-none md:p-0 space-y-4 md:space-y-0 md:space-x-10`}
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
                            //   className="cursor-pointer text-white text-lg font-semibold transition-all duration-200 hover:underline hover:text-blue-300"
                            className={`cursor-pointer text-lg font-semibold transition-all duration-200 hover:underline hover:text-primary ${pathname === item.href ? 'text-primary underline' : 'text-foreground'
                                }`}
                        >
                            {item.text}
                        </Link>
                    ))}

                    {/* Buttons */}
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
        </header>
    );
}

