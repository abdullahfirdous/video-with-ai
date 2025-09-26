"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trash2, ArrowLeft, Search, User, Calendar } from "lucide-react";
import Link from "next/link";

interface User {
  _id: string;
  email: string;
  displayName?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        
        if (response.status === 403) {
          router.push('/');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          setError('Failed to fetch users');
        }
      } catch (error) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUsers();
    }
  }, [session, router]);

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user: ${userEmail}? This action cannot be undone.`)) {
      return;
    }

    setDeletingUserId(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setDeletingUserId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
              <p className="text-gray-400">Manage all user accounts</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Users Table */}
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Joined</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-750">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.displayName || user.email}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium">
                              {user.displayName || user.email.split('@')[0]}
                            </p>
                            {user.displayName && (
                              <p className="text-gray-400 text-sm">{user.email.split('@')[0]}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDeleteUser(user._id, user.email)}
                            disabled={deletingUserId === user._id || user.email === session?.user?.email}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={user.email === session?.user?.email ? "Cannot delete your own account" : "Delete user"}
                          >
                            {deletingUserId === user._id ? (
                              <div className="w-4 h-4 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {searchTerm ? 'No users found matching your search' : 'No users found'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>
    </div>
  );
}