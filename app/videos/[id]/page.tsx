'use client'
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { IVideo } from "@/models/Video";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Home } from "lucide-react";
import Link from "next/link";

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<IVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoId = params?.id as string;

  // Extract path from full ImageKit URL
  const getVideoPath = (videoUrl: string) => {
    if (!videoUrl) return '';
    
    if (videoUrl.startsWith('/')) {
      return videoUrl;
    }
    
    if (videoUrl.includes('ik.imagekit.io')) {
      try {
        const url = new URL(videoUrl);
        const pathMatch = url.pathname.match(/\/[^\/]+\/(.+)/);
        return pathMatch ? `/${pathMatch[1]}` : videoUrl;
      } catch (error) {
        console.error('Error parsing video URL:', error);
        return videoUrl;
      }
    }
    
    return videoUrl.startsWith('/') ? videoUrl : `/${videoUrl}`;
  };

  useEffect(() => {
    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/video/${videoId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const videoData = await response.json();
      setVideo(videoData);
    } catch (error) {
      console.error('Error fetching video:', error);
      setError('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-3xl shadow-2xl p-12 backdrop-blur-xl max-w-md mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5"></div>
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-blue-500"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-blue-500/30"></div>
            </div>
            <p className="text-gray-300 text-lg font-medium">Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-3xl shadow-2xl p-12 backdrop-blur-xl max-w-md mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-600/5"></div>
          <div className="relative text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Play className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">Video not found</h3>
            <p className="text-red-300 mb-8 text-lg">{error || 'The video you requested could not be found.'}</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/"
              className="bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-xl border border-gray-700/50 p-3 rounded-2xl transition-all duration-300 text-gray-300 hover:text-white shadow-lg"
            >
              <Home className="w-6 h-6" />
            </Link>
            <div className="h-8 w-px bg-gray-700/50"></div>
            <h1 className="text-2xl font-bold text-white">Video Player</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="xl:col-span-2">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl">
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  src={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${getVideoPath(video.VideoUrl || '')}`}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlayPause}
                />
                
                {/* Custom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <div className="flex items-center gap-4 text-white">
                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlayPause}
                      className="cursor-pointer hover:bg-white/20 p-3 rounded-full transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>

                    {/* Progress Bar */}
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`
                        }}
                      />
                    </div>

                    {/* Time Display */}
                    <span className="text-sm font-mono min-w-[100px] text-center">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {/* Mute Button */}
                    <button
                      onClick={toggleMute}
                      className="cursor-pointer hover:bg-white/20 p-3 rounded-full transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Information Section */}
          <div className="xl:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl h-fit">
              <div className="space-y-6">
                {/* Video Title */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {video.title || 'Untitled Video'}
                  </h2>
                  <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                </div>

                {/* Video Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">Description</h3>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {video.description || 'No description available for this video.'}
                    </p>
                  </div>
                </div>

                {/* Video Stats */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-300">Video Details</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-600/30">
                      <div className="text-blue-400 text-sm font-medium">Quality</div>
                      <div className="text-white font-semibold">HD</div>
                    </div>
                    <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-600/30">
                      <div className="text-purple-400 text-sm font-medium">Duration</div>
                      <div className="text-white font-semibold">{formatTime(duration)}</div>
                    </div>
                    <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-600/30">
                      <div className="text-green-400 text-sm font-medium">Status</div>
                      <div className="text-white font-semibold">{isPlaying ? 'Playing' : 'Paused'}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-gray-700/50">
                  <button
                    onClick={togglePlayPause}
                    className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {isPlaying ? 'Pause Video' : 'Play Video'}
                  </button>
                  
                  <Link
                    href="/"
                    className="w-full bg-gray-700/40 hover:bg-gray-700/60 text-gray-300 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 border border-gray-600/30 text-center block"
                  >
                    Back to Gallery
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;   
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.6);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.8);
        }
      `}</style>
    </div>
  );
}