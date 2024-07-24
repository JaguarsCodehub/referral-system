import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, first_name, profile_image_url, publicMetadata } = body?.data;
    const referralCode = publicMetadata?.referralCode || null;

    // Ensure referral code is available
    console.log('Referral Code from Webhook:', referralCode);

    const user = await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        name: first_name,
        profileImage: profile_image_url,
      },
      create: {
        clerkId: id,
        name: first_name || '',
        profileImage: profile_image_url,
        referral_code: generateReferralCode(),
        referred_by: referralCode || null,
      },
    });

    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referral_code: referralCode },
      });

      if (referrer) {
        await prisma.user.update({
          where: { id: referrer.id },
          data: {
            points: { increment: 20 },
          },
        });

        await prisma.referrals.create({
          data: {
            referrer_id: referrer.id,
            referred_id: user.id,
          },
        });
      }
    }

    // Call the API to update public metadata
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/set-public-metadata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, referralCode }),
    });

    return new NextResponse('User updated in database successfully', {
      status: 200,
    });
  } catch (error) {
    console.log('Error updating database (Webhook)', error);
    return new NextResponse('Error updating user in database', { status: 500 });
  }
}

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
