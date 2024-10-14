import React from "react";
import Image from "next/image";

interface ImageItemProps {
  src: string;
  onClick: () => void;
}

const ImageItem: React.FC<ImageItemProps> = ({ src, onClick }) => {
  return (
    <div
      className="cursor-pointer transform transition duration-300 hover:scale-105"
      onClick={onClick}
    >
      <Image
        src={src}
        alt="Gallery image"
        width={500}
        height={500}
        className="rounded-md object-cover"
      />
    </div>
  );
};

export default ImageItem;
