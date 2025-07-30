'use client';

import { useSidebar } from "@/contexts/SidebarProvider"
import { useEffect, useState } from "react";
import UserTable from "./components/UserTable";

export default function UserManagement() {
  const { setTitle } = useSidebar();
  const [activeTab, setActiveTab] = useState("clients");

  useEffect(() => {
    setTitle('User Management');
  }, []);

  const handleTabClick = (tabValue) => {
    console.log('Tab clicked:', tabValue);
    setActiveTab(tabValue);
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Custom Tab Header */}
        <div className="border-b px-6 py-4">
          <div className="flex bg-gray-100 p-1 rounded-lg max-w-md">
            <button
              onClick={() => handleTabClick("clients")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "clients"
                  ? "bg-primary text-white shadow"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              Clients
            </button>
            <button
              onClick={() => handleTabClick("customers")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "customers"
                  ? "bg-primary text-white shadow"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              Customers
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "clients" && <UserTable userType="Merchant" />}
          {activeTab === "customers" && <UserTable userType="Customer" />}
        </div>
      </div>
    </section>
  )
}

