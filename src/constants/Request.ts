import { ObjectValues } from '@/types/Common';
import {
  AlarmClockIcon,
  CircleCheckIcon,
  CircleIcon,
  CircleOffIcon,
} from 'lucide-react';

export const REQUEST_TYPE = {
  SUPPLIES: 'SUPPLIES',
  SERVICES: 'SERVICES',
  VOLUNTEERS: 'VOLUNTEERS',
} as const;

export const REQUEST_TYPE_LABELS = {
  [REQUEST_TYPE.SUPPLIES]: {
    label: 'Supplies',
  },
  [REQUEST_TYPE.SERVICES]: {
    label: 'Services',
  },
  [REQUEST_TYPE.VOLUNTEERS]: {
    label: 'Volunteers',
  },
};

export const URGENCY = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export const URGENCY_LABELS = {
  [URGENCY.HIGH]: {
    label: 'High',
    badge: 'tomato',
  },
  [URGENCY.MEDIUM]: {
    label: 'Medium',
    badge: 'orange',
  },
  [URGENCY.LOW]: {
    label: 'Low',
    badge: 'grass',
  },
} as const;

export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const REQUEST_STATUS_LABELS = {
  [REQUEST_STATUS.PENDING]: {
    label: 'Pending',
    icon: CircleIcon,
  },
  [REQUEST_STATUS.IN_PROGRESS]: {
    label: 'In progress',
    icon: AlarmClockIcon,
  },
  [REQUEST_STATUS.COMPLETED]: {
    label: 'Completed',
    icon: CircleCheckIcon,
  },
  [REQUEST_STATUS.ARCHIVED]: {
    label: 'Archived',
    icon: CircleOffIcon,
  },
};

export type RequestType = ObjectValues<typeof REQUEST_TYPE>;
export type UrgencyType = ObjectValues<typeof URGENCY>;
export type RequestStatusType = ObjectValues<typeof REQUEST_STATUS>;
