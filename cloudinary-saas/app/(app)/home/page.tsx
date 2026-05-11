"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";

import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";

import { Trash2Icon } from "lucide-react";

import {
  VideoIcon,
  UploadCloudIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");

      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback(
    (url: string, title: string) => {
      const link = document.createElement("a");

      link.href = url;
      link.download = `${title}.mp4`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    []
  );


  const handleDelete = async (id: string) => {
  try {
    const confirmDelete = confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmDelete) return;

    await axios.delete(`/api/videos/${id}`);

    // UI UPDATE
    setVideos((prev) =>
      prev.filter((video) => video.id !== id)
    );

  } catch (error) {
    console.log(error);

    alert("Failed to delete video");
  }
};

  // LOADING
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[2rem] bg-base-100 border border-base-300 shadow-2xl">
        {/* BG EFFECT */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            {/* LEFT */}
            <div className="max-w-2xl">
              <div className="badge badge-primary badge-outline gap-2 px-4 py-3 mb-5">
                <SparklesIcon className="w-4 h-4" />
                AI Powered Video Platform
              </div>

              <h1 className="text-4xl lg:text-6xl font-black leading-tight">
                Manage Your
                <span className="text-primary"> Videos </span>
                Like a Pro
              </h1>

              <p className="text-base-content/70 text-lg mt-6 leading-relaxed">
                Upload, compress, organize and download your
                videos with a modern Cloudinary powered SaaS
                dashboard.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/video-upload"
                  className="btn btn-primary rounded-2xl px-8"
                >
                  <UploadCloudIcon className="w-5 h-5" />
                  Upload Video
                </Link>

                <button className="btn btn-outline rounded-2xl px-8">
                  <VideoIcon className="w-5 h-5" />
                  Explore Videos
                </button>
              </div>
            </div>

            {/* RIGHT STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full lg:w-auto">
              {/* CARD */}
              <div className="bg-base-200 border border-base-300 rounded-3xl p-6 min-w-[220px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-70">
                      Total Videos
                    </p>

                    <h2 className="text-4xl font-black mt-2 text-primary">
                      {videos.length}
                    </h2>
                  </div>

                  <div className="bg-primary/20 p-4 rounded-2xl">
                    <VideoIcon className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>

              {/* CARD */}
              <div className="bg-base-200 border border-base-300 rounded-3xl p-6 min-w-[220px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-70">
                      Platform Status
                    </p>

                    <h2 className="text-3xl font-black mt-2 text-success">
                      Active
                    </h2>
                  </div>

                  <div className="bg-success/20 p-4 rounded-2xl">
                    <TrendingUpIcon className="w-8 h-8 text-success" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIDEOS SECTION */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black">
            Uploaded Videos
          </h2>

          <p className="text-base-content/60 mt-1">
            Browse and manage all uploaded content
          </p>
        </div>

        <div className="badge badge-primary badge-lg px-5 py-4">
          {videos.length} Videos
        </div>
      </div>

      {/* EMPTY */}
      {videos.length === 0 ? (
        <div className="hero bg-base-100 border border-dashed border-base-300 rounded-[2rem] py-24 shadow-xl">
          <div className="hero-content text-center">
            <div className="max-w-lg">
              <div className="flex justify-center mb-8">
                <div className="bg-primary/10 p-6 rounded-full">
                  <VideoIcon className="w-16 h-16 text-primary" />
                </div>
              </div>

              <h2 className="text-4xl font-black">
                No Videos Yet
              </h2>

              <p className="py-5 text-base-content/60 text-lg">
                Start by uploading your first video and manage
                everything from your dashboard.
              </p>

              <Link
                href="/video-upload"
                className="btn btn-primary rounded-2xl px-8"
              >
                <UploadCloudIcon className="w-5 h-5" />
                Upload First Video
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10">
          {videos.map((video) => (
            <div
  key={video.id}
  className="relative group transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
>
  {/* DELETE BUTTON */}
  <button
    onClick={() => handleDelete(video.id)}
    className="absolute top-4 right-4 z-20 btn btn-circle btn-sm btn-error shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
  >
    <Trash2Icon className="w-4 h-4 text-white" />
  </button>

  <VideoCard
    video={video}
    onDownload={handleDownload}
  />
</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;