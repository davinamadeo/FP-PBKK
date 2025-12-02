"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function FilePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params.id as string;

  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<any[]>([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState("");

  useEffect(() => {
    fetchFileDetail();
    fetchTags();
  }, [fileId]);

  const fetchFileDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setFile(data);
      } else {
        router.push("/dashboard/files");
      }
    } catch (error) {
      console.error("Error fetching file:", error);
      router.push("/dashboard/files");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/tags", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTags(data);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleAddTag = async () => {
    if (!selectedTagId) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/files/${fileId}/tags/${selectedTagId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        await fetchFileDetail();
        setShowTagModal(false);
        setSelectedTagId("");
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const handleRemoveTag = async (tagId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/files/${fileId}/tags/${tagId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        await fetchFileDetail();
      }
    } catch (error) {
      console.error("Error removing tag:", error);
    }
  };

  const handleDelete = async () => {
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
        router.push("/dashboard/files");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
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

  const renderPreview = () => {
    if (!file) return null;

    const token = localStorage.getItem("token");
    const fileUrl = `http://localhost:3001/files/${file.id}/view`;
    const authHeader = `Bearer ${token}`;

    switch (file.type) {
      case "image":
        return (
          <div className="bg-gray-900 rounded-xl p-8 flex items-center justify-center min-h-[400px]">
            <img
              src={fileUrl}
              alt={file.name}
              className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                console.error("Image load error");
              }}
            />
          </div>
        );

      case "pdf":
        return (
          <div className="bg-gray-100 rounded-xl overflow-hidden">
            <iframe
              src={fileUrl}
              className="w-full h-[600px] border-0"
              title={file.name}
            />
          </div>
        );

      case "video":
        return (
          <div className="bg-black rounded-xl overflow-hidden">
            <video controls className="w-full max-h-[600px]">
              <source src={fileUrl} type={`video/${file.name.split(".").pop()}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "audio":
        return (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-12 text-center">
            <div className="text-6xl mb-6">🎵</div>
            <audio controls className="w-full max-w-md mx-auto">
              <source src={fileUrl} type={`audio/${file.name.split(".").pop()}`} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      default:
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">{getFileIcon(file.type)}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Preview not available</h3>
            <p className="text-gray-600 mb-6">This file type cannot be previewed</p>
            <a
              href={`http://localhost:3001/files/${file.id}/download`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download File
            </a>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">File not found</h2>
        <Link
          href="/dashboard/files"
          className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
        >
          ← Back to Files
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Link
            href="/dashboard/files"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl shrink-0">{getFileIcon(file.type)}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
                {file.name}
              </h1>
            </div>
            <p className="text-gray-600">
              {formatBytes(file.size)} • Uploaded {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-2 shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
            {renderPreview()}
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="space-y-6">
          {/* File Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">File Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-semibold text-gray-600">Owner</dt>
                <dd className="text-gray-900">{file.owner?.name || "Unknown"}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-600">Type</dt>
                <dd className="text-gray-900 capitalize">{file.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-600">Size</dt>
                <dd className="text-gray-900">{formatBytes(file.size)}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-600">Folder</dt>
                <dd className="text-gray-900">
                  {file.folder ? (
                    <Link
                      href={`/dashboard/folders/${file.folder.id}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      📁 {file.folder.name}
                    </Link>
                  ) : (
                    "No folder"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-600">Uploaded</dt>
                <dd className="text-gray-900">
                  {new Date(file.createdAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Tags</h3>
              <button
                onClick={() => setShowTagModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                + Add Tag
              </button>
            </div>

            {file.tags && file.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {file.tags.map((ft: any) => (
                  <span
                    key={ft.tag.id}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold group"
                  >
                    <span>🏷️ {ft.tag.name}</span>
                    <button
                      onClick={() => handleRemoveTag(ft.tag.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No tags yet</p>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <a
                href={`http://localhost:3001/files/${file.id}/download`}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Tag</h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Tag
              </label>
              <select
                value={selectedTagId}
                onChange={(e) => setSelectedTagId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Choose a tag...</option>
                {tags
                  .filter(
                    (tag) =>
                      !file.tags?.some((ft: any) => ft.tag.id === tag.id)
                  )
                  .map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTagModal(false);
                  setSelectedTagId("");
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTag}
                disabled={!selectedTagId}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}