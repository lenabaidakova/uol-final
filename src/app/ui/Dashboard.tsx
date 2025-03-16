'use client';

import { useUserData } from '@/providers/UserProvider';
import ShelterDashboard from '@/app/ui/ShelterDashboard';
import SupporterDashboard from '@/app/ui/SupporterDashboard';
import { ROLES } from '@/constants/Role';

export default function Dashboard() {
  const { role } = useUserData();

  if (role === ROLES.SHELTER) {
    return <ShelterDashboard />;
  }

  if (role === ROLES.SUPPORTER) {
    return <SupporterDashboard />;
  }
  return null;
}
