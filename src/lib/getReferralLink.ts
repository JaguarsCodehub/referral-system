// lib/getReferralLink.ts
export const getReferralLink = (referralCode: string) => {
  if (!referralCode) {
    return null;
  }
  return `${process.env.NEXT_PUBLIC_BASE_URL}/welcome?ref=${referralCode}`;
};
