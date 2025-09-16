// components/ConfirmDeleteModal.tsx
"use client";
import { FaTrashAlt } from "react-icons/fa";

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  subject,
}: any) {
  // ubah menjadi type data yang benar
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
        <FaTrashAlt className="text-4xl text-red-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-red-700 mb-2">
          Konfirmasi Hapus
        </h2>
        <p className="mb-4 text-gray-700">
          Apakah Anda yakin ingin menghapus Mata Pelajaran{" "}
          <span className="font-semibold">{subject.name}</span>?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <form action={onConfirm}>
            <input type="hidden" name="id" value={subject.id} />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Hapus
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
