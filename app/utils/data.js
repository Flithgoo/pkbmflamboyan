import {
  Home,
  BookOpen,
  Users,
  Settings,
  BarChart2,
  UserPlus,
  ClipboardList,
  BellRing,
  ClipboardCheck,
  Info,
} from "lucide-react";

const imageData = [
  "/gallery/lab_komputer.jpg", // replace with your image paths
  "/gallery/foto bersama dinas.jpg",
  "/gallery/pelepasan_bersama.jpg",
  "/gallery/ujian_formulatif.jpg",
  "/gallery/UPK.jpg",
  "/gallery/pondok.jpg",
];

const listTestimoni = [
  {
    name: "Jauhar Effendi",
    image: "/assets/testimony/Jauhar_Effendi.jpg",
    email: "joeankkun@gmail.com",
    testimoni:
      "Tempat terbaik untuk belajar bagi yang sudah putus sekolah,memberikan kesetaraan pendidikan sebagai hak warga negara Indonesia",
  },
  {
    name: "Aprilia",
    image: "/assets/testimony/Aprilia.jpg",
    email: "rizhanfarazah93@gmail.com",
    testimoni:
      "Para guru²nya sangat ramah baik,sabar mengajarkan ilmu kepada kami, semoga pkbm sukses selalu tambah maju, makin ramai yg belajar, yg putus sekolah bisa sekolah lagi karna ada flamboyan",
  },
  {
    name: "Mega indriyani",
    image: "/assets/testimony/MegaIndriyani.jpg",
    email: "muhamadtayal@gmail.com",
    testimoni:
      "PKBM sangat membantu kita yg terlambat melanjutkan sekolah, gurunya sangat baik & ramah2 , pokoknya top markotop buat PKBM 👍🏻👍🏻👍🏻❤️❤️❤️",
  },
  {
    name: "Siti Romlah",
    image: "/assets/testimony/Siti_Romlah.jpg",
    email: "sitiromlah05781@gmail.com",
    testimoni:
      "Ajang pembelajaran yang sangat membantu dan bermanfaat sekali bagi saya yg putus sekolah",
  },
  {
    name: "Wartiah",
    image: "/assets/testimony/Wartiah.jpg",
    email: "wartiahpml07@gmail.com",
    testimoni:
      "Sangat mendukung kita yang sempat terhambat dengan pendidikan. Tutornya sangat ramah dan penjelasan materinya mudah dicerna.",
  },
  {
    name: "Liana Saputri ",
    image: "/assets/testimony/Liana_Saputri.jpg",
    email: "rizqyhafizhah56@gmail.com",
    testimoni:
      "Terima kasih... atas adanya PKBM.  Saya bisa melanjutkan sekolah 🙏 PKBM sukses dan tetap semangat ",
  },
];

const listFaq = [
  {
    question: "Apa itu PKBM?",
    response:
      "PKBM adalah lembaga pendidikan nonformal yang menyediakan pendidikan dasar, menengah, dan keterampilan vokasional bagi masyarakat yang tidak memiliki akses ke sekolah formal.",
  },
  {
    question: "Program apa saja yang tersedia di PKBM Flamboyan?",
    response:
      "PKBM Flamboyan menawarkan program Paket A (setara SD), Paket B (setara SMP), dan Paket C (setara SMA). Selain itu, ada juga program keterampilan dan pelatihan untuk membantu siswa meningkatkan keterampilan kerja.",
  },
  {
    question: "Apakah PKBM Flamboyan menerima siswa dari semua kalangan usia?",
    response:
      "Ya, PKBM Flamboyan terbuka untuk semua usia, termasuk anak-anak putus sekolah, remaja, dan orang dewasa yang ingin melanjutkan pendidikan atau mendapatkan ijazah yang diakui.",
  },
  {
    question: "Apakah ijazah dari PKBM Flamboyan diakui oleh pemerintah?",
    response:
      "Ya, ijazah yang diterima dari PKBM Flamboyan diakui oleh pemerintah dan setara dengan ijazah dari sekolah formal, sehingga dapat digunakan untuk melanjutkan pendidikan ke tingkat yang lebih tinggi atau untuk keperluan pekerjaan.",
  },
  {
    question: "Apakah PKBM Flamboyan menyediakan pembelajaran daring?",
    response:
      "PKBM Flamboyan berusaha fleksibel dalam metode pembelajaran, termasuk menyediakan opsi pembelajaran daring atau campuran untuk siswa yang memiliki kendala waktu atau akses.",
  },
  {
    question:
      "Apakah lulusan PKBM Flamboyan bisa melanjutkan ke perguruan tinggi?",
    response:
      "Lulusan Paket C dari PKBM Flamboyan dapat melanjutkan ke perguruan tinggi, asalkan memenuhi persyaratan pendaftaran di universitas atau akademi yang dituju.",
  },
];

const pelajarDashboardLinks = [
  { name: "Dashboard", href: "/LMS/pelajar", icon: Home },
  {
    name: "Mata Pelajaran",
    href: "/LMS/pelajar/Mapel",
    icon: BookOpen,
  },
  { name: "Tugas", href: "/LMS/pelajar/Tugas", icon: ClipboardList },
  { name: "Absensi", href: "/LMS/pelajar/Absensi", icon: Users },
  { name: "Pengumuman", href: "/LMS/pelajar/Pengumuman", icon: BellRing },
  { name: "Ujian", href: "/LMS/pelajar/Ujian", icon: ClipboardCheck },
  { name: "Bantuan", href: "/LMS/Bantuan", icon: Info },
];

const tutorDashboardLinks = [
  { name: "Dashboard", href: "/LMS/tutor", icon: Home },
  {
    name: "Mata Pelajaran",
    href: "/LMS/tutor/Mapel",
    icon: BookOpen,
  },
  { name: "Tugas", href: "/LMS//tutor/Tugas", icon: ClipboardList },
  { name: "Pengumuman", href: "/LMS/tutor/Pengumuman", icon: BellRing },
  { name: "Ujian", href: "/LMS/tutor/Ujian", icon: ClipboardCheck },
  { name: "Bantuan", href: "/LMS/Bantuan", icon: Info },
];

const adminDashboardLinks = [
  { name: "Dashboard", icon: Home, href: "/LMS/admin" },
  { name: "Pengguna", icon: Users, href: "/LMS/admin#daftar-pengguna" },
  {
    name: "Tambah Pengguna",
    icon: UserPlus,
    href: "/LMS/admin/TambahPengguna",
  },
  { name: "Mata Pelajaran", icon: BookOpen, href: "/LMS/admin/MataPelajaran" },
  { name: "Laporan", icon: BarChart2, href: "/LMS/admin/laporan" },
  { name: "Pengaturan", icon: Settings, href: "/LMS/admin/settings" },
];

export {
  imageData,
  listTestimoni,
  listFaq,
  tutorDashboardLinks,
  adminDashboardLinks,
  pelajarDashboardLinks,
};
