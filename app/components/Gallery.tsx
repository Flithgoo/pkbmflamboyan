"use client";

import { useState } from "react";
import ImageItem from "./(Gallery)/ImageItem";
import Modal from "./(Gallery)/Modal";
import { imageData } from "../utils/data";

const Gallery = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="container mx-auto pt-32 p-4">
      <h1 className="text-center font-semibold text-slate-800 text-4xl mb-7">
        Galeri
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {imageData.map((image, index) => (
          <ImageItem key={index} src={image} onClick={() => openModal(image)} />
        ))}
      </div>

      {selectedImage && (
        <Modal
          isOpen={modalIsOpen}
          image={selectedImage}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default Gallery;
