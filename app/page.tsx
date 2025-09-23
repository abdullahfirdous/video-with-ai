'use client'

import { useState, useEffect } from "react";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/models/Video";
import { Video, AlertCircle, RefreshCw, Play, Users, Eye, TrendingUp, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchVideos();
    }
  }, [session]);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/video');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-3xl shadow-2xl p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10"></div>
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    return null;
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
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <main className="relative container mx-auto px-4 py-8">
        {/* Enhanced Header Section */}
        <div className="mb-12">
          <div className="relative">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 mb-8 shadow-2xl">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Video Gallery
                  </h1>
                  <p className="text-gray-400 text-lg">Explore and manage your video collection</p>
                </div>
              </div>
              
              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/40 border border-gray-700/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <Play className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{videos.length}</h3>
                      <p className="text-gray-400 text-sm">Total Videos</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/40 border border-gray-700/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Quality</h3>
                      <p className="text-gray-400 text-sm">Content</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/40 border border-gray-700/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center border border-green-500/20">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">HD</h3>
                      <p className="text-gray-400 text-sm">Streaming</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-3xl shadow-2xl p-12 backdrop-blur-xl max-w-md mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5"></div>
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-6 relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-blue-500"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-blue-500/30"></div>
                </div>
                <p className="text-gray-300 text-lg font-medium">Loading amazing videos...</p>
                <p className="text-gray-500 text-sm mt-2">This won't take long</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-3xl shadow-2xl p-12 backdrop-blur-xl max-w-md mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-600/5"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <AlertCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-white font-semibold text-xl mb-2">Oops! Something went wrong</h3>
                <p className="text-red-300 mb-8 text-lg">{error}</p>
                <button 
                  onClick={fetchVideos}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Section Header for Video Feed */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Video Feed</h2>
              </div>
              <div className="h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-transparent mb-8"></div>
            </div>
            
            <VideoFeed videos={videos} />
          </div>
        )}
      </main>
    </div>
  );
}