// app/api/admin/users/[id]/route.ts 

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { isAdmin } from '@/lib/adminAuth';
import User from '@/models/User';
import Video from '@/models/Video';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    const userId = params.id;
    
    // Find user first
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Don't allow admin to delete themselves
    if (user.email === session.user.email) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Delete user's videos first (if they have any)
    // Note: Your Video model doesn't have userId, so we'll skip this for now
    // await Video.deleteMany({ userId: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Admin delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}