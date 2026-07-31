"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* DESKTOP SIDEBAR - FIXED / STATIONARY */}
      <div className="hidden lg:block fixed left-0 top-0 w-64 h-screen z-30">
        <Sidebar open={true} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* MOBILE SIDEBAR - OVERLAY */}
      <div className="lg:hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* MAIN AREA - THIS SCROLLS, SIDEBAR DOESN'T */}
      <div className="flex flex-col min-h-screen lg:ml-64">
        
        {/* NAVBAR - STICKY ON TOP */}
        <div className="sticky top-0 z-20">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}