"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { User, Mail, Shield, Edit3, Camera, Trash2, X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChangePasswordModal from "../components/ChangePasswordModal";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      const user = session.user as any; // Type assertion to access custom fields
      setDisplayName(user.displayName || user.email?.split("@")[0] || "");
      setProfileImage(user.profileImage || "");
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // COMMENTED OUT: Image upload functionality
  /*
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setUpdateError("Image size must be less than 5MB");
    return;
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    setUpdateError("Please upload an image file");
    return;
  }

  try {
    setIsUpdating(true);
    setUpdateError("");

    // Convert file to base64 or use a simple file upload approach
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        // For now, we'll use a simple approach - you can integrate with your preferred image service later
        const imageUrl = reader.result as string;
        
        // Update profile with new image
        const updateResponse = await fetch('/api/profile/update', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileImage: imageUrl }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update profile');
        }

        const data = await updateResponse.json();
        setProfileImage(imageUrl);
        
        // Update session
        await update({
          ...session,
          user: { ...session.user, profileImage: imageUrl } as any
        });

      } catch (error) {
        setUpdateError("Failed to upload image. Please try again.");
        console.error('Image upload error:', error);
      } finally {
        setIsUpdating(false);
      }
    };
    
    reader.readAsDataURL(file);

  } catch (error) {
    setUpdateError("Failed to process image. Please try again.");
    console.error('Image processing error:', error);
    setIsUpdating(false);
  }
};
  */

  // COMMENTED OUT: Save profile functionality
  /*
  const handleSave = async () => {
  console.log('=== HANDLE SAVE DEBUG START ===');
  console.log('Display name to save:', displayName);
  
  setIsUpdating(true);
  setUpdateError("");

  try {
    const response = await fetch('/api/profile/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ displayName }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    // Update session
    await update({
      ...session,
      user: { ...session.user, displayName } as any
    });

    console.log('Session updated, setting editing to false');
    setIsEditing(false);
    console.log('=== HANDLE SAVE DEBUG END ===');
  } catch (error) {
    console.error('Save error:', error);
    setUpdateError("Failed to update display name. Please try again.");
    console.log('=== HANDLE SAVE DEBUG END (ERROR) ===');
  } finally {
    setIsUpdating(false);
  }
};
  */

  const handleCancel = () => {
    const user = session.user as any;
    setDisplayName(user.displayName || user.email?.split("@")[0] || "");
    setIsEditing(false);
    setUpdateError("");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.error || 'Failed to delete account');
        return;
      }

      // Sign out and redirect
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      setDeleteError('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const user = session.user as any; // Type assertion for custom fields

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-8 mt-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <User className="w-8 h-8 text-blue-500" />
            Profile
          </h1>
          <p className="text-gray-400">Manage your account information and settings</p>
        </div>

        {/* Update Error */}
        {updateError && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-sm text-red-300">{updateError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
                    {/* COMMENTED OUT: Dynamic profile image display */}
                    {/*
                    {profileImage && !profileImage.includes('placeholder') ? (
  <img
    src={profileImage}
    alt="Profile"
    className="w-full h-full object-cover"
    onError={(e) => {
      (e.target as HTMLImageElement).style.display = 'none';
      (e.target as HTMLImageElement).nextElementSibling?.setAttribute('style', 'display: flex');
    }}
  />
) : null}
                    */}
<div 
  className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
  // COMMENTED OUT: Dynamic display control
  // style={{ display: profileImage && !profileImage.includes('placeholder') ? 'none' : 'flex' }}
>
  <User className="w-12 h-12 text-white" />
</div>
                  </div>
                  {/* COMMENTED OUT: Camera upload button */}
                  {/*
                  <label className="absolute bottom-0 right-0 bg-gray-700 hover:bg-gray-600 p-2 rounded-full border-2 border-gray-800 transition-colors duration-200 cursor-pointer">
                    <Camera className="w-4 h-4 text-gray-300" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUpdating}
                    />
                  </label>
                  */}
                  {/* COMMENTED OUT: Upload loading indicator */}
                  {/*
                  {isUpdating && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  */}
                </div>

                {/* Display Name */}
                <div className="mb-2">
                  {/* COMMENTED OUT: Editable display name */}
                  {/*
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-gray-700 text-white text-xl font-semibold text-center rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-white">{displayName}</h2>
                  )}
                  */}
                  {/* Static display name */}
                  <h2 className="text-xl font-semibold text-white">{displayName}</h2>
                </div>

                <p className="text-gray-400 text-sm mb-4">{session.user?.email}</p>

                {/* COMMENTED OUT: Edit functionality */}
                {/* Edit Button */}
                {/*
                {isEditing ? (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200"
                    >
                      {isUpdating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200 mx-auto"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                */}
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Account Information */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email Address</p>
                      <p className="text-white font-medium">{session.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Account Status</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-white font-medium">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowChangePasswordModal(true)}
                    className="cursor-pointer w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    <p className="text-white font-medium">Change Password</p>
                    <p className="text-sm text-gray-400">Update your account password</p>
                  </button>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="cursor-pointer w-full text-left p-3 bg-red-900 hover:bg-red-800 rounded-lg transition-colors duration-200"
                  >
                    <p className="text-white font-medium">Delete Account</p>
                    <p className="text-sm text-red-300">Permanently delete your account</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-900 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Account</h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteError("");
                }}
                className="cursor-pointer text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-400 mb-4">
              This action cannot be undone. This will permanently delete your account and all associated data.
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-sm text-red-300">{deleteError}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteError("");
                }}
                className="cursor-pointer flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!deletePassword || isDeleting}
                className="cursor-pointer flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
}