// app/api/admin/videos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { isAdmin } from '@/lib/adminAuth';
import Video from '@/models/Video';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    const videos = await Video.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ videos }, { status: 200 });

  } catch (error) {
    console.error('Admin get videos error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}