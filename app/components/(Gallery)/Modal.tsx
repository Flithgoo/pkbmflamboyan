"use client";

import { useEffect } from "react";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  image: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, image, onClose }) => {
  // Close the modal when the "Escape" key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose} // Close the modal when clicking outside the modal content
    >
      <div
        className="relative w-full max-w-3xl max-h-screen p-4 bg-white rounded-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black bg-gray-200 p-2 rounded-full"
        >
          Close
        </button>

        <div className="relative w-full h-full">
          <Image
            src={image}
            alt="Selected"
            layout="responsive"
            width={700}
            height={500}
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
