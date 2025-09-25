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

        // Check if required environment variables exist
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

        console.log('Environment check:', {
            hasPrivateKey: !!privateKey,
            hasPublicKey: !!publicKey,
            privateKeyLength: privateKey?.length || 0,
            publicKeyLength: publicKey?.length || 0,
        });

        if (!privateKey || !publicKey) {
            console.error('Missing ImageKit environment variables:', {
                privateKey: !!privateKey,
                publicKey: !!publicKey,
            });
            return Response.json({
                error: 'Missing ImageKit configuration',
                details: {
                    privateKey: !!privateKey,
                    publicKey: !!publicKey,
                }
            }, { status: 500 });
        }

        const authenticationParameters = getUploadAuthParams({
            privateKey: privateKey,
            publicKey: publicKey,
        });

        console.log('ImageKit auth successful for user:', session.user.email);

        return Response.json({ 
            authenticationParameters, 
            publicKey: publicKey,
        });
 
    } catch (error) {
        console.error('ImageKit auth error:', error);
        return Response.json({
            error: "Authentication for Imagekit failed",
            message: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
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

        // Check file size (100MB for videos, 5MB for images)
        const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return Response.json(
                { error: `File size too large. Maximum ${file.type.startsWith('video/') ? '100MB' : '5MB'} allowed.` },
                { status: 400 }
            );
        }

        // Check file type (allow both images and videos)
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            return Response.json(
                { error: 'Only image and video files are allowed' },
                { status: 400 }
            );
        }

        // Check ImageKit configuration
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
        const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

        if (!privateKey || !publicKey || !urlEndpoint) {
            console.error('Missing ImageKit configuration:', {
                privateKey: !!privateKey,
                publicKey: !!publicKey,
                urlEndpoint: !!urlEndpoint,
            });
            return Response.json({
                error: 'ImageKit configuration missing',
                details: {
                    privateKey: !!privateKey,
                    publicKey: !!publicKey,
                    urlEndpoint: !!urlEndpoint,
                }
            }, { status: 500 });
        }

        // Import ImageKit dynamically to avoid bundling issues
        const ImageKit = (await import('imagekit')).default;
        
        const imagekit = new ImageKit({
            publicKey: publicKey,
            privateKey: privateKey,
            urlEndpoint: urlEndpoint,
        });

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop() || 'mp4';
        const folder = file.type.startsWith('video/') ? 'videos' : 'images';
        const fileName = `${folder.slice(0, -1)}-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        console.log('Uploading file:', {
            originalName: file.name,
            fileName: fileName,
            size: file.size,
            type: file.type,
            user: session.user.email,
        });

        // Upload to ImageKit
        const uploadResult = await imagekit.upload({
            file: buffer,
            fileName: fileName,
            folder: `/${folder}`,
            useUniqueFileName: true,
            tags: [
                'user_upload',
                session.user.email,
                file.type.startsWith('video/') ? 'video' : 'image'
            ]
        });

        console.log('Upload successful:', {
            fileId: uploadResult.fileId,
            url: uploadResult.url,
            name: uploadResult.name,
            user: session.user.email,
        });

        return Response.json({
            url: uploadResult.url,
            fileId: uploadResult.fileId,
            name: uploadResult.name,
            filePath: uploadResult.filePath,
            thumbnailUrl: uploadResult.thumbnailUrl,
        });

    } catch (error) {
        console.error('ImageKit upload error:', error);
        return Response.json(
            { 
                error: 'Failed to upload file',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}