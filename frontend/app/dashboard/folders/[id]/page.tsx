"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function FolderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const folderId = params.id as string;
  
  const [folder, setFolder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolderDetail();
  }, [folderId]);

  const fetchFolderDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/folders/${folderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setFolder(data);
      } else {
        router.push("/dashboard/folders");
      }
    } catch (error) {
      console.error("Error fetching folder:", error);
      router.push("/dashboard/folders");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchFolderDetail();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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

  if (!folder) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Folder not found</h2>
        <Link
          href="/dashboard/folders"
          className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
        >
          ← Back to Folders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/folders"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📁</span>
            <h1 className="text-3xl font-bold text-gray-900">{folder.name}</h1>
          </div>
          <p className="text-gray-600">
            {folder.files?.length || 0} files • Created {new Date(folder.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{folder.files?.length || 0}</div>
          <div className="text-sm text-gray-600">Total Files</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {formatBytes(folder.files?.reduce((acc: number, file: any) => acc + file.size, 0) || 0)}
          </div>
          <div className="text-sm text-gray-600">Total Size</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {new Set(folder.files?.map((f: any) => f.type)).size || 0}
          </div>
          <div className="text-sm text-gray-600">File Types</div>
        </div>
      </div>

      {/* Files */}
      {folder.files && folder.files.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {folder.files.map((file: any) => (
            <div
              key={file.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow group cursor-pointer"
              onClick={() => router.push(`/dashboard/files/${file.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {getFileIcon(file.type)}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 truncate mb-1">
                {file.name}
              </h3>
              <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
              
              {file.tags && file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {file.tags.slice(0, 2).map((ft: any) => (
                    <span
                      key={ft.tag.id}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                    >
                      {ft.tag.name}
                    </span>
                  ))}
                  {file.tags.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      +{file.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No files in this folder
          </h3>
          <p className="text-gray-600 mb-4">Upload files to this folder to see them here</p>
          <Link
            href="/dashboard/files"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            <span>📤</span>
            Upload Files
          </Link>
        </div>
      )}
    </div>
  );
}