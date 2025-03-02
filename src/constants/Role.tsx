import { ObjectValues } from '@/types/Common';

export const ROLES = {
  SUPPORTER: 'SUPPORTER',
  SHELTER: 'SHELTER',
} as const;

export type RoleType = ObjectValues<typeof ROLES>;
