'use client';
import Image from 'next/image';
import Footer from '../components/footer/Footer';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/header/navbar';

export default function ContactUs() {
    return (

        <section className="min-h-screen bg-secondary/20 flex flex-col items-center overflow-x-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Hero */}
            <div className="relative w-full h-[80vh] flex items-center justify-center">
                <Image
                    src="/bgimg3.webp"
                    alt="Contact Us Hero"
                    fill
                    className="object-cover brightness-75"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10">
                    <h1 className="text-white text-5xl font-extrabold drop-shadow-lg animate-fade-up">Contact Us</h1>
                    <p className="text-white/90 text-lg mt-3 animate-fade-up delay-200">We’re here to help. Reach out anytime.</p>
                </div>
            </div>

            {/* Contact Section */}
            <div className="w-full max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Form */}
                <div className="bg-white/90 p-8 rounded-2xl shadow-xl">
                    <h2 className="text-3xl font-bold text-primary mb-6">Get in Touch</h2>
                    <form className="space-y-5">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full border border-secondary/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full border border-secondary/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
                            required
                        />
                        <textarea
                            rows={5}
                            placeholder="Your Message"
                            className="w-full border border-secondary/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#265a34] transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Info + Map */}
                <div className="flex flex-col justify-between">
                    <div className="bg-white/90 p-8 rounded-2xl shadow-xl mb-6">
                        <h3 className="text-2xl font-bold text-primary mb-4">Our Office</h3>
                        <p className="text-light-primary mb-2">Haware Infotech Park, Sector 30A,</p>
                        <p className="text-light-primary mb-2">Vashi, Navi Mumbai,</p>
                        <p className="text-light-primary mb-2">Maharashtra 400703</p>
                        <p className="text-light-primary mb-2">Email: 
                            <button>
                                <a href="mailto:helpedesklinkmylogistics@gmail.com" className="hover:text-primary transition-colors">
                                    helpdesklinkmylogistics@gmail.com
                                </a>
                            </button>
                        </p>
                        <p className="text-light-primary">Phone: 
                            <a href="tel:+9102233794084" className="hover:text-primary transition-colors">
                                Tel. +91 022 33794084,
                            </a></p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl h-64">
                        <iframe
                        title="GOL Office Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9542625702575!2d72.99672527466494!3d19.06574845229534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c14e84cbb1cf%3A0xec7d66136f702da4!2sHaware%20Infotech%20Park%2C%20Sector%2030A%2C%20Vashi%2C%20Navi%20Mumbai%2C%20Maharashtra%20400703!5e0!3m2!1sen!2sin!4v1754319965133!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowfullscreen
                        loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Animations */}
            <style jsx>{`
                .animate-fade-up {
                    animation: fadeUp 0.8s ease-out both;
                }
                .animate-fade-left {
                    animation: fadeLeft 0.8s ease-out both;
                }
                .animate-fade-right {
                    animation: fadeRight 0.8s ease-out both;
                }
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes fadeRight {
                    from {
                        opacity: 0;
                        transform: translateX(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </section>
    );
}
