// app/welcome/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

const WelcomePage = () => {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref'); // Get the referral code from URL
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && user && referralCode) {
      const updateReferral = async () => {
        await fetch('/api/update-referral', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, referralCode }),
        });
      };
      updateReferral();
    }
  }, [isLoaded, user, referralCode]);

  return <div>Welcome to the platform!</div>;
};

export default WelcomePage;
