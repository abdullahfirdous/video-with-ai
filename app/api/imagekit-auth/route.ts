import { getUploadAuthParams } from "@imagekit/next/server"
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return Response.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const authenticationParameters = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
        });

        return Response.json({ 
            authenticationParameters, 
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY, 
        });
 
    } catch (error) {
        return Response.json({
            error: "Authentication for Imagekit failed",
        }, {status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return Response.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return Response.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return Response.json(
                { error: 'File size too large. Maximum 5MB allowed.' },
                { status: 400 }
            );
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            return Response.json(
                { error: 'Only image files are allowed' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // For now, we'll return a placeholder URL since you'll need to set up ImageKit upload
        // You can implement the actual ImageKit upload here
        const imageUrl = `https://via.placeholder.com/150?text=${encodeURIComponent(session.user.email)}`;

        return Response.json({
            url: imageUrl,
            fileId: `temp_${Date.now()}`,
            name: file.name,
        });

    } catch (error) {
        console.error('ImageKit upload error:', error);
        return Response.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}