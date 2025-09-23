import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { useState } from "react";
import { Video, Upload, Plus } from "lucide-react";
import Link from "next/link";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [currentlyPlayingVideo, setCurrentlyPlayingVideo] = useState<string | null>(null);

  const handleVideoPlay = (videoId: string) => {
    setCurrentlyPlayingVideo(videoId);
  };

  const handleVideoPause = () => {
    setCurrentlyPlayingVideo(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoComponent 
          key={video._id?.toString()} 
          video={video} 
          isCurrentlyPlaying={currentlyPlayingVideo === video._id?.toString()}
          onPlay={() => handleVideoPlay(video._id?.toString() || '')}
          onPause={handleVideoPause}
        />
      ))}

      {videos.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
          <div className="text-gray-400 mb-6">
            <Video className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No videos yet</h3>
          <p className="text-gray-400 text-center mb-6 max-w-md">
            Get started by uploading your first video. Share your content with the world!
          </p>
          <Link 
            href="/upload" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <Upload className="w-5 h-5" />
            Upload Your First Video
          </Link>
        </div>
      )}
    </div>
  );
}