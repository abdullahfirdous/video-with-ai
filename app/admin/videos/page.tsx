"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trash2, ArrowLeft, Search, Play, Calendar, FileText } from "lucide-react";
import Link from "next/link";

interface Video {
  _id: string;
  title: string;
  description: string;
  VideoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminVideos() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/admin/videos');
        
        if (response.status === 403) {
          router.push('/');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos);
        } else {
          setError('Failed to fetch videos');
        }
      } catch (error) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchVideos();
    }
  }, [session, router]);

  const handleDeleteVideo = async (videoId: string, videoTitle: string) => {
    if (!confirm(`Are you sure you want to delete video: "${videoTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingVideoId(videoId);

    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVideos(videos.filter(video => video._id !== videoId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete video');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setDeletingVideoId(null);
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Video Management</h1>
              <p className="text-gray-400">Manage all videos</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Videos Grid */}
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div key={video._id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden group">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-900">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <Play className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">
                    {truncateText(video.title, 40)}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {truncateText(video.description, 80)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>Video</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={video.VideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200 text-center"
                    >
                      View Video
                    </a>
                    <button
                      onClick={() => handleDeleteVideo(video._id, video.title)}
                      disabled={deletingVideoId === video._id}
                      className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      title="Delete video"
                    >
                      {deletingVideoId === video._id ? (
                        <div className="w-4 h-4 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredVideos.length === 0 && !error && (
          <div className="text-center py-12">
            <Play className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchTerm ? 'No videos found matching your search' : 'No videos found'}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Showing {filteredVideos.length} of {videos.length} videos
          </p>
        </div>
      </div>
    </div>
  );
}