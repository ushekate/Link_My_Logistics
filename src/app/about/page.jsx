"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Truck, Warehouse, Globe, ClipboardList, ArrowRight, Building2,
  PlaneIcon, Ship, ShoppingCart, Anchor, Building,
  TruckElectric,
  Handshake,
  ChartLine,
  Boxes
} from "lucide-react";
import Footer from "../components/footer/Footer";
import Navbar from "../components/header/navbar";

const missionPoints = [
  { title: "Digital Transformation", desc: "Revolutionizing logistics through our innovative digital platform that connects all aspects of the supply chain.", icon: <TruckElectric /> },
  { title: "Reliable Partnerships", desc: "Building a network of verified and reliable service providers across the logistics ecosystem.", icon: <Handshake /> },
  { title: "Operational Excellence", desc: "Optimizing logistics routes, assets, and partners to offer timely and affordable services.", icon: <ChartLine /> },
];

const offerings = [
  { title: "Container Freight Station", desc: "Comprehensive CFS services for import and export cargo handling.", icon: <Warehouse /> },
  { title: "Warehousing & Storage", desc: "Bonded and general warehousing solutions for all your storage needs.", icon: <Boxes /> },
  { title: "Transportation", desc: "Domestic and inter-state transportation services across India.", icon: <Truck /> },
  { title: "End-to-End 3PL", desc: "Complete logistics management solutions for your business.", icon: <Globe /> },
];

const chooseUsPoints = [
  { title: "One-Stop Platform", desc: "All Logistics services under a single digital roof." },
  { title: "Digital Access", desc: "User Friendly Platform for business of all sizes" },
  { title: "Central Dashboard", desc: "Track Orders, Shipments, and Performance in one place." },
  { title: "Cost-Effective", desc: "Optimized routes, and partnerships for affordable services." },
  { title: "Transparency", desc: "Clear Pricing, reliable SLAs, and open ratings." },
  { title: "End-to-End Visibility", desc: "Complete control and real time Updates on your cargo." },
];

const clients = [
  { icon: <Ship size={40} className="p-2 bg-primary/20 rounded-full" />, title: "Importers & Exporters" },
  { icon: <Building size={40} className="p-2 bg-primary/20 rounded-full" />, title: "MSMEs & Enterprises" },
  { icon: <PlaneIcon size={40} className="p-2 bg-primary/20 rounded-full" />, title: "Freight Forwarders" },
  { icon: <Building2 size={40} className="p-2 bg-primary/20 rounded-full" />, title: "Manufacturers" },
  { icon: <ShoppingCart size={40} className="p-2 bg-primary/20 rounded-full" />, title: "E-commerce Players" },
  { icon: <Anchor size={40} className="p-2 bg-primary/20 rounded-full" />, title: "Port Operators" },
];

export default function Home() {

  return (
    <main className="font-sans text-gray-800">
      <Navbar />

      <section className="relative bg-black text-white min-h-[80vh] flex items-center justify-center px-4">
        <Image src="/cargo-ship.png" alt="Hero" fill className="object-cover opacity-60" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">India's First Digital Logistics Partner</h1>
          <p className="text-lg mb-6 animate-fade-up delay-200">Transforming the logistics landscape with a one-stop destination for all your logistics needs – CFS, Warehousing, Transportation, and End-to-End 3PL services.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50 text-center px-4">
        <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
        <p className="max-w-2xl mx-auto mb-10 text-gray-600">
          To provide easy, cost-effective, and fast logistics solutions for every consignee, shipper, exporter, or importer regardless of size or industry.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 bg-primary/20 p-8 rounded-xl max-w-6xl mx-auto">
          {missionPoints.map((item, idx) => (
            <div key={idx} className="bg-white shadow-md border-t-4 border-primary rounded-lg p-6">
              <div className="text-primary w-fit mb-4 bg-primary/20 p-2 rounded-full">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 text-center bg-foreground/20 px-4">
        <h2 className="text-3xl font-bold mb-4 text-primary">What We Offer</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-10">
          We connect businesses with verified and reliable service providers across the logistics ecosystem to offer comprehensive solutions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto py-8">
          {offerings.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-6 py-10 rounded shadow hover:shadow-lg transition">
              <div className="text-primary mb-4 bg-primary/20 p-2 rounded-md w-fit">{item.icon}</div>
              <h4 className="font-semibold text-2xl mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2 items-center">
          <div className="animate-fade-right">
            <h2 className="text-3xl font-bold mb-6 text-primary">Why Choose Us?</h2>
            <p className="text-gray-600 mb-10">At Link My Logistics, we are not just a logistics service provider - we are your digital logistics partner. Together, let's simplify the complex and move your business forward.</p>
            <div className="space-y-4 text-gray-700 grid sm:grid-cols-2">
              {chooseUsPoints.map((point, idx) => (
                <div key={idx} className="gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✔</span>
                    <span className="font-semibold text-lg">{point.title}</span>
                  </div>
                  <div className="px-8">
                    <span className="text-sm">{point.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="animate-fade-left">
            <Image src="/bgimg1.jpeg" alt="Logistics dashboard" width={500} height={300} className="rounded-lg shadow w-full" />
          </div>
        </div>
      </section>

      <section className="py-16 text-center bg-foreground/10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-primary">Who We Serve</h2>
        <p className="text-gray-600 mb-10">Our digital logistics platform is designed to meet the needs of various businesses across industries.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {clients.map((client, idx) => (
            <div key={idx} className="bg-white px-3 py-8 rounded-xl shadow-sm space-y-4">
              <span className="text-2xl flex justify-center text-primary">{client.icon}</span>
              <p className="text-xl font-semibold text-black">{client.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white text-primary text-center py-16 px-4">
        <h2 className="text-3xl font-bold mb-4">Join the Future of Logistics</h2>
        <p className="mb-6 max-w-2xl mx-auto">At Link My Logistics, We are not just a logistics service provider – we are your digital logistics partner. Together, let's simplify the complex and move your business forward.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={"/customer/register"}>
            <button className="bg-primary text-white px-5 py-2 rounded">Book Services Now</button>
          </Link>
          <Link href={"/contact"}>
            <button className="border border-primary px-5 py-2 rounded">Contact Sales Team</button>
          </Link>
        </div>
      </section>

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
    </main>
  );
}

