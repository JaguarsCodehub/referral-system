// pages/api/update-referral.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { userId, referralCode } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (referralCode) {
        const referrer = await prisma.user.findUnique({
          where: {
            referral_code: referralCode,
          },
        });

        if (referrer) {
          await prisma.user.update({
            where: {
              id: referrer.id,
            },
            data: {
              points: {
                increment: 20, // Add 20 points to the referrer's account
              },
            },
          });

          await prisma.referrals.create({
            data: {
              referrer_id: referrer.id,
              referred_id: user.id,
            },
          });

          // Update referred_by field for the new user
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              referred_by: referralCode,
            },
          });
        }
      }

      res.status(200).json({ message: 'Referral updated successfully' });
    } catch (error) {
      console.error('Error updating referral:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
