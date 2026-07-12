// @components/Profil/ChangePasswordForm.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/src/store/useUserStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { changePassword } from "@/lib/api/user";

interface ChangePasswordFormProps {
  onChangePassword?: (
    oldPassword: string,
    newPassword: string,
  ) => Promise<void>;
}

interface FormErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const MIN_PASSWORD_LENGTH = 6;

export function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUserStore();
  console.log("🚀 ~ ChangePasswordForm ~ user:", user);

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (!oldPassword) {
      nextErrors.oldPassword = "Password lama wajib diisi";
    }

    if (!newPassword) {
      nextErrors.newPassword = "Password baru wajib diisi";
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      nextErrors.newPassword = `Password minimal ${MIN_PASSWORD_LENGTH} karakter`;
    } else if (newPassword === oldPassword) {
      nextErrors.newPassword =
        "Password baru tidak boleh sama dengan password lama";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Konfirmasi password tidak sama";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function resetForm() {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      toast.error("Pengguna tidak terdeteksi. Silakan login kembali.");
      return;
    }

    if (!validate()) return;

    setIsLoading(true);
    try {
      const { error } = await changePassword(user.id, oldPassword, newPassword);
      toast.success("Password berhasil diubah");
      resetForm();
    } catch (error) {
      toast.error("Gagal mengubah password. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full rounded-xl shadow-sm border-emerald-100">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <KeyRound className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-lg">Ubah Password</CardTitle>
            <CardDescription>
              Perbarui password akun Anda secara berkala untuk keamanan
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Password Lama */}
          <div className="space-y-1.5">
            <Label htmlFor="oldPassword">Password Lama</Label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={isLoading}
                className={cn(
                  "pr-10 rounded-xl",
                  errors.oldPassword &&
                    "border-red-500 focus-visible:ring-red-500",
                )}
                aria-invalid={!!errors.oldPassword}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                disabled={isLoading}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                {showOldPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-red-500">{errors.oldPassword}</p>
            )}
          </div>
          {/* Password baru */}
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">Password Baru</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                className={cn(
                  "pr-10 rounded-xl",
                  errors.newPassword &&
                    "border-red-500 focus-visible:ring-red-500",
                )}
                aria-invalid={!!errors.newPassword}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                disabled={isLoading}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-500">{errors.newPassword}</p>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={cn(
                  "pr-10 rounded-xl",
                  errors.confirmPassword &&
                    "border-red-500 focus-visible:ring-red-500",
                )}
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isLoading}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
