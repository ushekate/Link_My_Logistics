'use client';

import ProtectedRoutes from '@/contexts/ProtectedRoutes';
import { ROLES } from '@/constants/roles';

export default function ClientSupportLayout({ children }) {
  return (
    <ProtectedRoutes allowedRoles={[ROLES.MERCHANT, ROLES.CUSTOMER]}>
      {children}
    </ProtectedRoutes>
  );
}
