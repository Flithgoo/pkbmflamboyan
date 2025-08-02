/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gecdrsmwjaigsfyhisbm.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      // Jika Anda menggunakan custom domain untuk Supabase
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Atau menggunakan domains (deprecated tapi masih bisa digunakan)
    // domains: ['gecdrsmwjaigsfyhisbm.supabase.co'],
  },
};

export default nextConfig;
