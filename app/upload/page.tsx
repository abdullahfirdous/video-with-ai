"use client";

import VideoUploadForm from "../components/VideoUploadForm";
import { Upload } from "lucide-react";

export default function VideoUploadPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl text-white font-bold">Upload New Reel</h1>
            <p className="text-gray-400">Share your amazing content with the community</p>
          </div>
        </div>
        <VideoUploadForm />
      </div>
    </div>
  );
}