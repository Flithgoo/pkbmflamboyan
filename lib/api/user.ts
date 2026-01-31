"use server";

import { createSupabaseServerClient } from "@/app/utils/supabase-server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

const getAuthContext = async (): Promise<{
  token: string;
  supabase: ReturnType<typeof createSupabaseServerClient>;
}> => {
  const supabase = createSupabaseServerClient();
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new Error("No token found in cookies");
  }
  return { token, supabase };
};

export async function getUser() {
  const { token, supabase } = await getAuthContext();
  let user: any = null; // Initialize user as null
  if (token) {
    try {
      user = await verifyJwt(token); // user = { id, username, role }
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, name, username, role, profile_picture")
    .eq("id", user?.id)
    .single();

  return { data, error };
}

export async function getUserById(id: number) {
  const { token, supabase } = await getAuthContext();
  let user = null; // Initialize user as null
  if (token) {
    try {
      user = await verifyJwt(token); // user = { id, username, role }
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  if (!user || user.role !== "admin") {
    return { data: null, error: "Not authorized" };
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

export async function getAllUser() {
  const { token, supabase } = await getAuthContext();
  let user = null; // Initialize user as null
  if (token) {
    try {
      user = await verifyJwt(token); // user = { id, email, role }
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  if (!user || user.role !== "admin") {
    return { data: null, error: "Not authorized" };
  }

  const { data, error } = await supabase.from("users").select("*");
  return { data, error };
}

export async function logout() {
  // Hapus cookie token
  cookies().set("token", "", { path: "/", maxAge: 0 });
}

export async function insertUser(
  // tambahkan kondisional jika user.role == 'pelajar' maka insert ke tabel kelas dan lokasi
  name: string,
  username: string,
  password: string, // sudah dalam bentuk hash
  role: string,
  profile_picture?: string | null,
  studentClass?: number | null,
  location?: number | null,
) {
  const { token, supabase } = await getAuthContext();

  let user = null;
  if (token) {
    try {
      user = await verifyJwt(token); // user = { id, username, role }
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  const { data, error } = await supabase.rpc("insert_user", {
    p_name: name,
    p_username: username,
    p_password: password,
    p_role: role,
    p_profile_picture: profile_picture || undefined,
    p_class_id: studentClass || undefined,
    p_location_id: location || undefined,
  });

  if (error) {
    console.error(error.message);
  } else {
    console.log("User berhasil dibuat, ID:", data);
  }
  return { data, error };
}

export async function editUser(
  id: number,
  name: string,
  username: string,
  password: string | null, // sudah dalam bentuk hash
  role: string,
  profile_picture?: string | null,
) {
  const { token, supabase } = await getAuthContext();

  let user = null; // Initialize user as null
  if (token) {
    try {
      user = await verifyJwt(token); // user = { id, username, role }
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  const updateData: any = {
    name,
    username,
    role,
    profile_picture: profile_picture || null,
  };

  if (password) {
    updateData.password = password;
  }

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error editing user:", error);
    return { error };
  }
  return { data, error: null };
}

export async function deleteUser(id: number) {
  const { token, supabase } = await getAuthContext();

  let user = null; // Initialize user as null
  if (token) {
    try {
      user = await verifyJwt(token); // user = { id, username, role }
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  if (user?.role !== "admin") {
    throw new Error("Forbidden: Not authorized to delete this user.");
  }
  const { data: userData, error: userError } = await getUserById(id);
  const profile_picture = userData?.profile_picture;

  // Mendapatkan path dari URL profile_picture
  let profilePicturePath: string = "";
  if (profile_picture) {
    try {
      // Jika profile_picture sudah berupa path (bukan URL), gunakan langsung
      if (!profile_picture.startsWith("http")) {
        profilePicturePath = profile_picture;
      } else {
        // Jika profile_picture berupa URL, ambil path setelah domain bucket
        // Contoh: https://xxxx.supabase.co/storage/v1/object/public/profile-picture/folder/file.jpg
        // Ambil bagian setelah "/profile-picture/"
        const match = profile_picture.match(/\/profile-picture\/(.+)$/);
        profilePicturePath = match ? match[1] : "";
      }
    } catch (e) {
      console.error("Gagal mendapatkan path dari profile_picture:", e);
      profilePicturePath = "";
    }
  }

  const { data, error } = await supabase.rpc("delete_user", {
    p_user_id: id,
  });

  if (profile_picture) {
    const { error: errorDeleteBucket } = await supabase.storage
      .from("profile-picture")
      .remove([profilePicturePath]);

    if (errorDeleteBucket) console.error("Gagal hapus file:", error);
  }

  if (error) {
    console.error("Error deleting user:", error);
    return { error };
  }
  return { data, error: null };
}
