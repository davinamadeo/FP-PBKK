"use client";

import { useEffect, useState } from "react";

export default function FilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterFolder, setFilterFolder] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [folders, setFolders] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadToFolder, setUploadToFolder] = useState<string>("");

  useEffect(() => {
    fetchFiles();
    fetchFolders();
    fetchTags();
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        // Backend returns { files: [], pagination: {} }
        const filesList = data.files || data || [];
        setFiles(Array.isArray(filesList) ? filesList : []);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/folders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setFolders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
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
        setTags(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setShowUploadModal(true);
  };

  const confirmUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    if (uploadToFolder) {
      formData.append("folderId", uploadToFolder);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/files/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        await fetchFiles();
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadToFolder("");
        alert("File uploaded successfully!");
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/files/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchFiles();
        alert("File deleted successfully!");
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

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || file.type === filterType;
    const matchesFolder =
      filterFolder === "all" ||
      (filterFolder === "none" && !file.folderId) ||
      file.folderId === parseInt(filterFolder);
    const matchesTag =
      filterTag === "all" ||
      file.tags?.some((ft: any) => ft.tag.id === parseInt(filterTag));
    
    return matchesSearch && matchesType && matchesFolder && matchesTag;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "size":
        return b.size - a.size;
      case "date":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Files</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize your digital assets
          </p>
        </div>

        <label className="relative">
          <input
            type="file"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold cursor-pointer inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
            <span>📤</span>
            Upload File
          </div>
        </label>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filter by Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Types</option>
            <option value="image">🖼️ Images</option>
            <option value="pdf">📄 PDFs</option>
            <option value="video">🎥 Videos</option>
            <option value="audio">🎵 Audio</option>
            <option value="document">📝 Documents</option>
          </select>

          {/* Filter by Folder */}
          <select
            value={filterFolder}
            onChange={(e) => setFilterFolder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Folders</option>
            <option value="none">📭 No Folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                📁 {folder.name}
              </option>
            ))}
          </select>

          {/* Filter by Tag */}
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                🏷️ {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort and Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredFiles.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{files.length}</span> files
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || filterType !== "all" || filterFolder !== "all" || filterTag !== "all") && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="hover:text-blue-900">✕</button>
              </span>
            )}
            {filterType !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                Type: {filterType}
                <button onClick={() => setFilterType("all")} className="hover:text-purple-900">✕</button>
              </span>
            )}
            {filterFolder !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Folder: {filterFolder === "none" ? "No folder" : folders.find(f => f.id === parseInt(filterFolder))?.name}
                <button onClick={() => setFilterFolder("all")} className="hover:text-green-900">✕</button>
              </span>
            )}
            {filterTag !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                Tag: {tags.find(t => t.id === parseInt(filterTag))?.name}
                <button onClick={() => setFilterTag("all")} className="hover:text-orange-900">✕</button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
                setFilterFolder("all");
                setFilterTag("all");
              }}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Files Grid */}
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => window.location.href = `/dashboard/files/${file.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {getFileIcon(file.type)}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 truncate mb-1">
                {file.name}
              </h3>
              <p className="text-sm text-gray-500">
                {formatBytes(file.size)}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(file.createdAt).toLocaleDateString()}
              </p>

              {/* Tags */}
              {file.tags && file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
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

              {/* Folder */}
              {file.folder && (
                <div className="mt-2 text-xs text-gray-500">
                  📁 {file.folder.name}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No files found
          </h3>
          <p className="text-gray-600">
            {searchQuery || filterType !== "all" || filterFolder !== "all" || filterTag !== "all"
              ? "Try adjusting your search or filters"
              : "Upload your first file to get started"}
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload File</h2>

            <div className="mb-6">
              <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📄</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatBytes(selectedFile.size)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload to Folder (Optional)
              </label>
              <select
                value={uploadToFolder}
                onChange={(e) => setUploadToFolder(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">📭 No Folder (Root)</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    📁 {folder.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setUploadToFolder("");
                }}
                disabled={uploading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                disabled={uploading}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}