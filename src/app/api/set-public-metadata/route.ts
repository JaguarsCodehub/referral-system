import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId, referralCode } = await req.json();
    console.log('Set Public Metadata Triggered:', { userId, referralCode });

    // Update public metadata
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { referralCode },
    });

    return NextResponse.json({ message: 'Metadata updated successfully' });
  } catch (error) {
    console.error('Error updating metadata:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
