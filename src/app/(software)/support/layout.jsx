'use client';

import ProtectedRoutes from '@/contexts/ProtectedRoutes';
import { ROLES } from '@/constants/roles';
import { useEffect } from 'react';
import { useSidebar } from '@/contexts/SidebarProvider';

/**
 * Support Section Layout
 * Protects support routes and ensures proper authentication
 */
export default function SupportLayout({ children }) { 
  return (
    <ProtectedRoutes allowedRoles={[ROLES.CUSTOMER, ROLES.MERCHANT, ROLES.GOL_STAFF, ROLES.GOL_MOD, ROLES.ROOT]}>
      {children}
    </ProtectedRoutes>
  );
}
