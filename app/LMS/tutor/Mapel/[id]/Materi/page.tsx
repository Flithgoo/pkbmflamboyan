const page = () => {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-emerald-700 mb-4">
        Detail Materi
      </h1>
      <p className="text-gray-600 mb-6">
        Informasi lengkap tentang materi pembelajaran.
      </p>
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="mb-4">
          <strong className="text-gray-700">Judul:</strong>{" "}
          <span className="text-gray-800">Pengenalan Matematika</span>
        </div>
        <div className="mb-4">
          <strong className="text-gray-700">Mapel:</strong>{" "}
          <span className="text-gray-800">Matematika</span>
        </div>
        <div className="mb-4">
          <strong className="text-gray-700">Pengajar:</strong>{" "}
          <span className="text-gray-800">Bapak Andi</span>
        </div>
        <div className="mb-4">
          <strong className="text-gray-700">Tanggal:</strong>{" "}
          <span className="text-gray-800">1 Januari 2024</span>
        </div>
        <div className="mb-4">
          <strong className="text-gray-700">Deskripsi:</strong>
          <p className="mt-2 text-gray-800 whitespace-pre-line">
            Materi ini akan membahas dasar-dasar matematika, termasuk operasi
            dasar, bilangan, dan konsep-konsep penting lainnya.
          </p>
        </div>
      </section>
    </div>
  );
};
