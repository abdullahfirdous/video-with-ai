"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';

const ConditionalHeader = () => {
  const pathname = usePathname();
  
  // Pages where header should NOT appear
  const hideHeaderOn = ['/login', '/register'];
  const shouldShowHeader = !hideHeaderOn.includes(pathname);

  return shouldShowHeader ? <Header /> : null;
};

export default ConditionalHeader;