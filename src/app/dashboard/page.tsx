// pages/dashboard.tsx
'use client';
import { getReferralLink } from '@/lib/getReferralLink';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [referralLink, setReferralLink] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      // Log user public metadata to check if referralCode is present
      console.log('User Public Metadata:', user.publicMetadata);

      const referralCode = user.publicMetadata?.referralCode as string;
      if (referralCode) {
        setReferralLink(getReferralLink(referralCode));
      } else {
        console.log('No referral code found for the user.');
      }
    }
  }, [isLoaded, user]);

  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
      {referralLink && (
        <div className='flex flex-col'>
          <h2>Your Referral Link:</h2>
          <input type='text' value={referralLink} readOnly />
          <button
            className='mt-20'
            onClick={() => navigator.clipboard.writeText(referralLink)}
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
