"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const pathname = usePathname();
  
  // Set year on client side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  // Don't render footer on login and register pages
  const hideFooterRoutes = ['/login', '/register', '/auth/login', '/auth/register'];
  
  if (hideFooterRoutes.includes(pathname)) {
    return null;
  }

  return (
    <footer className="border-t border-gray-700 mt-auto" style={{backgroundColor: '#1F2937'}}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Main Copyright */}
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              © {currentYear || 2025} <span className="text-white font-semibold">Video with AI</span>. All rights reserved.
            </p>
          </div>

          {/* Designer Credit */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Developed by</span>
            <div className="flex items-center gap-1">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                Sheikh
              </span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                Abdullah
              </span>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
        </div>
      </div>
    </footer>
  );
}