export type UserRole = string;

export interface UserProfile {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  profile_picture?: string;
  // Hanya relevan untuk role pelajar
  kelas?: string;
  lokasi?: string;
}
