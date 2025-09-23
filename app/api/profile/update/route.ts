import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function PATCH(req: NextRequest) {
  try {
    console.log('=== PROFILE UPDATE DEBUG START ===');
    
    const session = await getServerSession(authOptions);
    console.log('Session:', { email: session?.user?.email, hasSession: !!session });
    
    if (!session?.user?.email) {
      console.log('ERROR: No session or email');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Request body:', body);
    const { displayName, profileImage } = body;

    await connectToDatabase();
    console.log('Database connected');
    
    const user = await User.findOne({ email: session.user.email });
    console.log('User found:', { 
      found: !!user, 
      currentDisplayName: user?.displayName,
      currentProfileImage: user?.profileImage?.substring(0, 50) + '...'
    });
    
    if (!user) {
      console.log('ERROR: User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateData: any = {};
    
    if (displayName !== undefined) {
      updateData.displayName = displayName;
      console.log('Updating displayName to:', displayName);
    }
    
    if (profileImage !== undefined) {
      updateData.profileImage = profileImage;
      console.log('Updating profileImage (length):', profileImage?.length);
    }

    console.log('Update data:', updateData);

    // Update user fields
    const updateResult = await User.updateOne(
      { _id: user._id },
      updateData
    );
    
    console.log('Update result:', updateResult);

    // Get updated user data
    const updatedUser = await User.findById(user._id);
    console.log('Updated user:', {
      displayName: updatedUser?.displayName,
      profileImageLength: updatedUser?.profileImage?.length
    });

    console.log('=== PROFILE UPDATE DEBUG END ===');

    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user: {
          displayName: updatedUser?.displayName,
          profileImage: updatedUser?.profileImage,
          email: updatedUser?.email
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update profile error:', error);
    console.log('=== PROFILE UPDATE DEBUG END (ERROR) ===');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}