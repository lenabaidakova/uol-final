'use client';

// user provider for easy access to users data from any component on the client
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import { RoleType } from '@/constants/Role';

interface RoleContextType {
  role: RoleType | null;
  name: string | null;
  email: string | null;
  setRole: React.Dispatch<React.SetStateAction<RoleType | null>>;
}

export const UserContext = createContext<RoleContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [role, setRole] = useState<RoleType | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      if (session.user.role && session.user.role !== role) {
        setRole(session.user.role as RoleType);
      }
      if (session.user.name && session.user.name !== name) {
        setName(session.user.name);
      }
      if (session.user.email && session.user.email !== email) {
        setEmail(session.user.email);
      }
    }
  }, [session, role, name]);

  return (
    <UserContext.Provider value={{ role, name, email, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserData() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  return context;
}
