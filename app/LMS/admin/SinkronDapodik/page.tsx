"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type RowObject = Record<string, any>;

export default function SinkronDapodikPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<RowObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    setAnalyzeResult(null);

    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      // dynamic import so project still builds if xlsx not installed
      const XLSX = await import("xlsx").catch(() => null);
      if (!XLSX) {
        setError(
          "Package 'xlsx' tidak ditemukan. Jalankan: pnpm add xlsx (atau npm i xlsx) lalu coba lagi.",
        );
        return;
      }

      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: RowObject[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      setParsedRows(rows);
      if (rows.length === 0) {
        setError(
          "File kosong atau tidak dapat dibaca. Pastikan format Excel benar.",
        );
      } else {
        setSuccess(
          `Berhasil membaca ${rows.length} baris dari sheet '${sheetName}'.`,
        );
      }
    } catch (e: any) {
      console.error(e);
      setError("Gagal membaca file. Pastikan file Excel valid.");
    }
  };

  const handleAnalyze = async () => {
    setError(null);
    setSuccess(null);
    setAnalyzeResult(null);
    if (!parsedRows.length) {
      setError("Belum ada file yang dipilih atau file belum diparse.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sinkron-dapodik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: parsedRows, sync: false }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Server error saat menganalisa");
      }
      const data = await res.json();
      setAnalyzeResult(data);
      setSuccess("Analisa selesai. Lihat hasil dibawah.");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Gagal menganalisa data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!parsedRows.length)
      return setError("Belum ada data untuk disinkronkan.");
    if (
      !confirm(
        "Yakin ingin melakukan sinkronisasi? perubahan akan diterapkan ke database.",
      )
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/sinkron-dapodik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: parsedRows, sync: true }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server gagal saat sinkron.");
      }
      const data = await res.json();
      setAnalyzeResult(data);
      setSuccess(
        `Sinkronisasi selesai. Dimasukkan: ${data.insertedCount ?? 0}, diubah: ${data.updatedCount ?? 0}.`,
      );
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Gagal melakukan sinkronisasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 pt-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="pb-1">Sinkronisasi Data Dapodik</CardTitle>
          <CardDescription>
            Unggah file Excel (.xlsx) dari Dapodik. Sistem akan menganalisa dan
            menampilkan siapa yang belum dimasukkan, serta perubahan data yang
            terdeteksi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Pilih file Excel (.xlsx)
              </label>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              {fileName && (
                <div className="mt-2 text-sm text-muted-foreground">
                  File: {fileName}
                </div>
              )}
              {error && (
                <div className="mt-2 text-sm text-destructive">⚠️ {error}</div>
              )}
              {success && (
                <div className="mt-2 text-sm text-emerald-600">
                  ✅ {success}
                </div>
              )}
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant="secondary"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? "Memproses..." : "Analisa"}
              </Button>
              <Button onClick={handleSync} disabled={loading || !analyzeResult}>
                {loading ? "Sedang sinkron..." : "Sinkronkan ke DB"}
              </Button>
            </div>
          </div>

          {/* Preview table */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              Preview data ({parsedRows.length})
            </h3>
            <div className="rounded-lg border bg-background p-2">
              {parsedRows.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Belum ada data yang diparse.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(parsedRows[0])
                        .slice(0, parsedRows[0].length)
                        .map((h) => (
                          <TableHead key={h}>{h}</TableHead>
                        ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedRows.slice(0, parsedRows[0].length).map((r, i) => (
                      <TableRow key={i}>
                        {Object.values(r)
                          .slice(0, parsedRows[0].length)
                          .map((v, j) => (
                            <TableCell key={j}>{String(v)}</TableCell>
                          ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          {/* Analyze results */}
          {analyzeResult && (
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-semibold">Ringkasan Hasil Analisa</h3>
                <div className="mt-1 text-sm text-muted-foreground">
                  Tidak dimasukkan: {analyzeResult.notInserted?.length ?? 0}{" "}
                  &middot; Perubahan: {analyzeResult.changed?.length ?? 0}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Tidak dimasukkan</h4>
                  <div className="rounded-lg border bg-background p-2">
                    {analyzeResult.notInserted?.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        Semua baris dapat diproses.
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Baris</TableHead>
                            <TableHead>Alasan</TableHead>
                            <TableHead>Data</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analyzeResult.notInserted.map(
                            (it: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell>{it.rowIndex + 1}</TableCell>
                                <TableCell>{it.reason}</TableCell>
                                <TableCell>{JSON.stringify(it.row)}</TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    Perubahan yang terdeteksi
                  </h4>
                  <div className="rounded-lg border bg-background p-2">
                    {analyzeResult.changed?.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        Tidak ada perubahan.
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email/Username</TableHead>
                            <TableHead>Field</TableHead>
                            <TableHead>Sebelum → Sesudah</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analyzeResult.changed.map((c: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell>{c.ident}</TableCell>
                              <TableCell>
                                {Object.keys(c.diffs).join(", ")}
                              </TableCell>
                              <TableCell>
                                <div className="text-xs">
                                  {Object.entries(c.diffs).map(
                                    ([k, v]: any) => (
                                      <div key={k}>
                                        <strong>{k}</strong>: {String(v.before)}{" "}
                                        → {String(v.after)}
                                      </div>
                                    ),
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter />
      </Card>

      <div className="text-sm text-muted-foreground">
        Catatan: sistem akan mencocokkan entri berdasarkan{" "}
        <strong>email</strong> atau <strong>username</strong> jika tersedia.
      </div>
    </div>
  );
}
