// app/api/admin/stats/route.ts 

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { isAdmin } from '@/lib/adminAuth';
import User from '@/models/User';
import Video from '@/models/Video';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    const [totalUsers, totalVideos, recentUsers, recentVideos] = await Promise.all([
      User.countDocuments(),
      Video.countDocuments(),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      Video.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
    ]);

    return NextResponse.json({
      totalUsers,
      totalVideos,
      recentUsers,
      recentVideos
    }, { status: 200 });

  } catch (error) {
    console.error('Admin get stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}