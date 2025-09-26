// ===== FILE 7: app/admin/page.tsx =====
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, Video, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalVideos: number;
  recentUsers: number;
  recentVideos: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        
        if (response.status === 403) {
          router.push('/');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError('Failed to fetch stats');
        }
      } catch (error) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session, router]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users and videos</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Videos</p>
                  <p className="text-2xl font-bold text-white">{stats.totalVideos}</p>
                </div>
                <Video className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">New Users (7d)</p>
                  <p className="text-2xl font-bold text-white">{stats.recentUsers}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">New Videos (7d)</p>
                  <p className="text-2xl font-bold text-white">{stats.recentVideos}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/users" className="block">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-gray-600 transition-colors duration-200 group">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors duration-200">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Manage Users</h3>
                  <p className="text-gray-400">View and manage all user accounts</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/videos" className="block">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-gray-600 transition-colors duration-200 group">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors duration-200">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Manage Videos</h3>
                  <p className="text-gray-400">View and manage all videos</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}