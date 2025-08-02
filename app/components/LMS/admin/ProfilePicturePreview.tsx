"use client";

import Image from "next/image";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

interface ProfilePicturePreviewProps {
  profilePictureUrl?: string;
  altText?: string;
  size?: number;
  className?: string;
}

export default function ProfilePicturePreview({
  profilePictureUrl,
  altText = "Foto Profil",
  size = 96,
  className = "",
}: ProfilePicturePreviewProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const containerSize = `w-${size / 4} h-${size / 4}`; // Tailwind size conversion

  return (
    <div
      className={`w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-200 mb-2 ${className}`}
    >
      {profilePictureUrl && !imageError ? (
        <Image
          src={profilePictureUrl}
          alt={altText}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={handleImageError}
          priority={false}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <FaUser className="text-gray-400 text-2xl" />
        </div>
      )}
    </div>
  );
}
