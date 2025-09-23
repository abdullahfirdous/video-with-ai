'use client'
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { useState, useRef, useEffect } from "react";

interface VideoComponentProps {
  video: IVideo;
  onDelete?: (videoId: string) => void;
  showDeleteButton?: boolean;
  isCurrentlyPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}

export default function VideoComponent({ 
  video, 
  onDelete,
  showDeleteButton = true,
  isCurrentlyPlaying = false,
  onPlay,
  onPause
}: VideoComponentProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle case where video is undefined or missing required properties
  if (!video) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4">
          <p className="text-center text-gray-500">Video not found</p>
        </div>
      </div>
    );
  }

  // Convert _id to string if it exists
  const videoId = video._id?.toString() || '';

  // Extract path from full ImageKit URL
  const getVideoPath = (videoUrl: string) => {
    if (!videoUrl) return '';
    
    // If it's already a path (starts with /), return as is
    if (videoUrl.startsWith('/')) {
      return videoUrl;
    }
    
    // If it's a full ImageKit URL, extract the path part
    if (videoUrl.includes('ik.imagekit.io')) {
      try {
        const url = new URL(videoUrl);
        // Extract path after the ImageKit endpoint
        const pathMatch = url.pathname.match(/\/[^\/]+\/(.+)/);
        return pathMatch ? `/${pathMatch[1]}` : videoUrl;
      } catch (error) {
        console.error('Error parsing video URL:', error);
        return videoUrl;
      }
    }
    
    // If it doesn't start with /, add it
    return videoUrl.startsWith('/') ? videoUrl : `/${videoUrl}`;
  };

  // Pause this video if another one is playing
  useEffect(() => {
    if (!isCurrentlyPlaying && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [isCurrentlyPlaying]);

  const handleVideoPlay = () => {
    // Reset video to start from beginning when it starts playing
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    
    if (onPlay) {
      onPlay();
    }
  };

  const handleVideoPause = () => {
    if (onPause) {
      onPause();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!videoId) return;

    setIsDeleting(true);
    try {
      // Use your API client to delete the video
      const { apiClient } = await import('@/lib/api-client');
      await apiClient.deleteVideo(videoId);

      // If onDelete callback is provided, call it
      if (onDelete) {
        await onDelete(videoId);
      }

      setShowConfirmDialog(false);
      
      // Show success message
      alert('Video deleted successfully!');
      
      // Optionally refresh the page to update the video list
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error deleting video:', error);
      alert(`Failed to delete video: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
        {/* Delete Button */}
        {showDeleteButton && (
          <button
            onClick={handleDeleteClick}
            className="cursor-pointer absolute top-2 right-2 z-50 bg-white/80 hover:bg-white backdrop-blur-sm text-gray-700 hover:text-red-500 p-2 rounded-full shadow-lg transition-all duration-200"
            title="Delete video"
            disabled={isDeleting}
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </button>
        )}

        <figure className="relative">
          <Link href={`/videos/${videoId}`} className="relative group w-full block">
            <div
              className="overflow-hidden relative w-full group"
              style={{ aspectRatio: "9/16" }}
            >
              <video
                ref={videoRef}
                src={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${getVideoPath(video.VideoUrl || '')}?tr=h-360,w-240`}
                controls={video.controls !== false}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                preload="metadata"
              />
              
              {/* Overlay to indicate clickable */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </figure>

        <div className="p-4">
          <Link
            href={`/videos/${videoId}`}
            className="hover:opacity-80 transition-opacity block"
          >
            <h2 className="text-black font-semibold text-lg mb-2 line-clamp-2">
              {video.title || 'Untitled Video'}
            </h2>
          </Link>

          <p className="text-black text-sm line-clamp-3">
            {video.description || 'No description available'}
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Video</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{video.title || 'this video'}"? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="cursor-pointer px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}