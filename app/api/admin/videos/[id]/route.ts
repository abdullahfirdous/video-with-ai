// app/api/admin/videos/[id]/route.ts 

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { isAdmin } from '@/lib/adminAuth';
import Video from '@/models/Video';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    const videoId = params.id;
    
    // Find and delete video
    const video = await Video.findByIdAndDelete(videoId);
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Video deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Admin delete video error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}