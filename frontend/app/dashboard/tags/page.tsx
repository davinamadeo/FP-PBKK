"use client";

import { useEffect, useState } from "react";

export default function TagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tagName, setTagName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: tagName }),
      });

      if (res.ok) {
        await fetchTags();
        setShowCreateModal(false);
        setTagName("");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create tag");
      }
    } catch (error) {
      console.error("Create tag error:", error);
      setError("Failed to create tag");
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/tags/${tagId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchTags();
      }
    } catch (error) {
      console.error("Delete tag error:", error);
    }
  };

  const tagColors = [
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-yellow-100 text-yellow-700 border-yellow-200",
    "bg-indigo-100 text-indigo-700 border-indigo-200",
    "bg-red-100 text-red-700 border-red-200",
    "bg-orange-100 text-orange-700 border-orange-200",
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
          <p className="text-gray-600 mt-1">Organize files with custom tags</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <span>🏷️</span>
          New Tag
        </button>
      </div>

      {/* Tags List */}
      {tags.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, index) => (
                <div
                  key={tag.id}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${
                    tagColors[index % tagColors.length]
                  } transition-all hover:scale-105`}
                >
                  <span>🏷️</span>
                  <span>{tag.name}</span>
                  <span className="text-xs opacity-75">
                    ({tag._count?.files || 0})
                  </span>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                    title="Delete"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{tags.length}</div>
                <div className="text-sm text-gray-600">Total Tags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {tags.reduce((acc, tag) => acc + (tag._count?.files || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Tagged Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    tags.reduce((acc, tag) => acc + (tag._count?.files || 0), 0) / (tags.length || 1)
                  )}
                </div>
                <div className="text-sm text-gray-600">Avg per Tag</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🏷️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tags yet</h3>
          <p className="text-gray-600 mb-4">Create tags to organize your files</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            <span>🏷️</span>
            Create Tag
          </button>
        </div>
      )}

      {/* Popular Tag Suggestions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-bold text-gray-900 mb-3">💡 Popular Tag Ideas</h3>
        <div className="flex flex-wrap gap-2">
          {["Work", "Personal", "Important", "Archive", "Draft", "Review", "Client", "Project"].map(
            (suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setTagName(suggestion);
                  setShowCreateModal(true);
                }}
                className="px-3 py-1 bg-white hover:bg-blue-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:border-blue-300 transition-colors"
              >
                + {suggestion}
              </button>
            )
          )}
        </div>
      </div>

      {/* Create Tag Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Tag</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateTag}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="e.g., Important"
                  required
                  maxLength={50}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max 50 characters. Use descriptive names.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setTagName("");
                    setError("");
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}