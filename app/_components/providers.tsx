import { ClerkProvider } from '@clerk/nextjs';
import { ConvexProvider } from 'convex/react';
import { ReactNode } from 'react';
import { convex } from '../convex/http';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ClerkProvider>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </ClerkProvider>
  );
};