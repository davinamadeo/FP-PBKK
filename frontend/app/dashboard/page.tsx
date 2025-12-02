"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalFolders: 0,
    totalTags: 0,
    storageUsed: "0 MB",
  });
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch files
      const filesRes = await fetch("http://localhost:3001/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (filesRes.ok) {
        const data = await filesRes.json();
        console.log("Files response from backend:", data);
        
        // Backend returns { files: [], pagination: {} }
        const filesList = data.files || data || [];
        console.log("Processed files list:", filesList);
        
        setStats((prev) => ({
          ...prev,
          totalFiles: Array.isArray(filesList) ? filesList.length : 0,
          storageUsed: formatBytes(
            Array.isArray(filesList) 
              ? filesList.reduce((acc: number, file: any) => acc + (file.size || 0), 0)
              : 0
          ),
        }));
        setRecentFiles(Array.isArray(filesList) ? filesList.slice(0, 5) : []);
      }

      // Fetch folders
      const foldersRes = await fetch("http://localhost:3001/folders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (foldersRes.ok) {
        const folders = await foldersRes.json();
        setStats((prev) => ({ ...prev, totalFolders: folders.length }));
      }

      // Fetch tags
      const tagsRes = await fetch("http://localhost:3001/tags", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (tagsRes.ok) {
        const tags = await tagsRes.json();
        setStats((prev) => ({ ...prev, totalTags: tags.length }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    const icons: any = {
      image: "🖼️",
      pdf: "📄",
      video: "🎥",
      audio: "🎵",
      document: "📝",
    };
    return icons[type] || "📎";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-blue-100">
          Here's what's happening with your digital assets today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              📄
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.totalFiles}
          </h3>
          <p className="text-gray-600 text-sm">Total Files</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">
              📁
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.totalFolders}
          </h3>
          <p className="text-gray-600 text-sm">Folders</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
              🏷️
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalTags}</h3>
          <p className="text-gray-600 text-sm">Tags</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
              💾
            </div>
            <span className="text-sm text-gray-500">of 10 GB</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.storageUsed}
          </h3>
          <p className="text-gray-600 text-sm">Storage Used</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/files"
            className="flex flex-col items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📤
            </div>
            <span className="text-sm font-semibold text-gray-900">
              Upload File
            </span>
          </Link>

          <Link
            href="/dashboard/folders"
            className="flex flex-col items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors group"
          >
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ➕
            </div>
            <span className="text-sm font-semibold text-gray-900">
              New Folder
            </span>
          </Link>

          <Link
            href="/dashboard/tags"
            className="flex flex-col items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🏷️
            </div>
            <span className="text-sm font-semibold text-gray-900">
              Create Tag
            </span>
          </Link>

          <Link
            href="/dashboard/files"
            className="flex flex-col items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
          >
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🔍
            </div>
            <span className="text-sm font-semibold text-gray-900">
              Search Files
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Files</h2>
          <Link
            href="/dashboard/files"
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
          >
            View All →
          </Link>
        </div>

        {recentFiles.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentFiles.map((file: any) => (
              <div
                key={file.id}
                className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {file.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatBytes(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No files yet
            </h3>
            <p className="text-gray-600 mb-4">
              Upload your first file to get started
            </p>
            <Link
              href="/dashboard/files"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              Upload File
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}