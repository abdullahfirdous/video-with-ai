// app/api/admin/users/route.ts 


import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { isAdmin } from '@/lib/adminAuth';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    const users = await User.find({}, {
      password: 0, // Don't include password in response
      resetPasswordToken: 0,
      resetPasswordExpiry: 0
    }).sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });

  } catch (error) {
    console.error('Admin get users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}