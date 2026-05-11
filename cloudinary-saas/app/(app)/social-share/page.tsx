"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CldImage } from "next-cloudinary";
import {
  DownloadIcon,
  Share2Icon,
  ImageIcon,
  SparklesIcon,
} from "lucide-react";
import { Trash2Icon } from "lucide-react";

const socialFormats = {
  "Instagram Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },

  "Instagram Portrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },

  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },

  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },

  "Facebook Cover (205:78)": {
    width: 820,
    height: 312,
    aspectRatio: "205:78",
  },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [downloadUrl, setDownloadUrl] = useState("");

  const [shareUrl, setShareUrl] = useState("");

  const [selectedFormat, setSelectedFormat] =
    useState<SocialFormat>("Instagram Square (1:1)");

  const [isUploading, setIsUploading] = useState(false);

  const [isTransforming, setIsTransforming] = useState(false);

  const imageUrlRef = useRef<string>("");

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      setUploadedImage(data.publicId);

      setDownloadUrl(data.downloadUrl);

      setShareUrl(data.shareUrl);

    } catch (error) {
      console.log(error);

      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

const handleDownload = async () => {
  try {
    const imageUrl = imageUrlRef.current;

    if (!imageUrl) {
      alert("Image not ready yet");
      return;
    }

    const response = await fetch(imageUrl);

    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = blobUrl;

    link.download = `${selectedFormat
      .replace(/\s+/g, "-")
      .replace(/[()]/g, "")
      .toLowerCase()}.webp`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.log(error);

    alert("Download failed");
  }
};


const handleShare = async () => {
  try {
    const imageUrl = imageUrlRef.current;

    if (!imageUrl) {
      alert("Image not ready yet");
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: "Optimized Social Media Image",
        text: `Formatted for ${selectedFormat}`,
        url: imageUrl,
      });

      return;
    }

    await navigator.clipboard.writeText(imageUrl);

    alert("Image link copied!");
  } catch (error) {
    console.log(error);

    alert("Sharing failed");
  }
};

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-6">
      <div className="max-w-6xl mx-auto">

        {/* TOP */}
        <div className="mb-10">
          <div className="flex items-center gap-4">

            <div className="bg-primary/20 p-4 rounded-3xl">
              <SparklesIcon className="w-10 h-10 text-primary" />
            </div>

            <div>
              <h1 className="text-5xl font-black">
                Social Media Creator
              </h1>

              <p className="text-base-content/60 mt-2 text-lg">
                Upload, optimize, resize and share images instantly
              </p>
            </div>
          </div>
        </div>

        {/* CARD */}
        <div className="card bg-base-100 shadow-2xl border border-base-300">

          <div className="card-body p-8">

            {/* UPLOAD */}
            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-primary" />

                <h2 className="text-2xl font-bold">
                  Upload Image
                </h2>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="file-input file-input-primary w-full"
              />

              {isUploading && (
                <div className="space-y-3">
                  <progress className="progress progress-primary w-full"></progress>

                  <p className="text-sm opacity-70">
                    Uploading & compressing image...
                  </p>
                </div>
              )}
            </div>

            {/* IMAGE SECTION */}
            {uploadedImage && (
              <div className="mt-10 space-y-8">

                {/* SELECT */}
                <div>
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Select Format
                    </span>
                  </label>

                  <select
                    className="select select-bordered w-full"
                    value={selectedFormat}
                    onChange={(e) =>
                      setSelectedFormat(
                        e.target.value as SocialFormat
                      )
                    }
                  >
                    {Object.keys(socialFormats).map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PREVIEW */}
                <div className="mt-6 relative">
                  <h3 className="text-lg font-bold mb-4 text-base-content">
                    Live Preview
                  </h3>

                  <div className="flex justify-center">
                    {isTransforming && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                      </div>
                    )}

                    <div className="rounded-3xl overflow-hidden shadow-2xl border border-base-300 bg-base-100">
                      <CldImage
  width={socialFormats[selectedFormat].width}
  height={socialFormats[selectedFormat].height}
  src={uploadedImage}
  alt="Preview Image"
  crop="fill"
  gravity="auto"
  sizes="100vw"
  className="w-full h-auto object-cover rounded-3xl"
  onLoad={(e) => {
    setIsTransforming(false);

    imageUrlRef.current = e.currentTarget.currentSrc;
  }}
/>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-4 justify-end">

                  <button
                    className="btn btn-primary btn-lg rounded-2xl"
                    onClick={handleDownload}
                  >
                    <DownloadIcon className="w-5 h-5" />

                    Download
                  </button>

                  <button
                    className="btn btn-secondary btn-lg rounded-2xl"
                    onClick={handleShare}
                  >
                    <Share2Icon className="w-5 h-5" />

                    Share
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}