// app/sign-up/page.tsx
'use client';
import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');
  const redirectUrl = referralCode
    ? `/welcome?ref=${referralCode}`
    : '/welcome';

  return (
    <SignUp path='/sign-up' routing='path' fallbackRedirectUrl={redirectUrl} />
  );
}
