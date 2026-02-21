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

type RowObject = Record<string, string | number | null>;

export default function SinkronDapodikPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<RowObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // tambahan untuk pencarian dan pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number | "Semua">(10);
  const rowsPerPageOptions = [10, 25, 50, 100, "Semua"];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    setAnalyzeResult(null);

    // ambil file pertama dari input semisal user input lebih dari 1 file
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      // dynamic import agar tidak error di lingkungan yang tidak support (misal build tanpa xlsx)
      const XLSX = await import("xlsx").catch(() => null);
      if (!XLSX) {
        setError(
          "Package 'xlsx' tidak ditemukan. Jalankan: pnpm add xlsx (atau npm i xlsx) lalu coba lagi.",
        );
        return;
      }

      const workbook = XLSX.read(buffer, { type: "array" });
      if (!workbook.SheetNames.length) {
        throw new Error("Sheet tidak ditemukan");
      }

      // ambil sheet pertama untuk diparse, (bisa ditambah opsi pilih sheet jika diperlukan)
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Ambil sebagai array 2D (bukan langsung object)
      const raw: any[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
      });
      // Validasi minimal struktur file
      if (raw.length < 7) {
        throw new Error("Format file tidak sesuai (header tidak ditemukan).");
      }
      // Baris 5 & 6 Excel (index 4 dan 5), karena dapodik ada metadata spt nama pengunduh, tgl dll
      const headerMainRaw = raw[4] ?? [];
      const headerChild = raw[5] ?? [];

      // STEP 1: forward fill parent header (untuk merge cell), intine kalau ada cell kosong, isi dengan value parent sebelumnya
      const headerMain: string[] = [];
      let lastParent = "";

      for (let i = 0; i < headerMainRaw.length; i++) {
        const current = String(headerMainRaw[i] ?? "").trim();

        if (current !== "") {
          lastParent = current;
          headerMain.push(current);
        } else {
          headerMain.push(lastParent);
        }
      }

      // STEP 2: gabungkan parent + child
      const usedKeys = new Set<string>();

      const mergedHeaders: string[] = headerMain.map((main, i) => {
        const child = String(headerChild[i] ?? "").trim();

        let key = child !== "" ? `${main}_${child}` : main;

        key = key.replace(/\s+/g, "_").toLowerCase();

        let finalKey = key;
        let counter = 1;

        while (usedKeys.has(finalKey)) {
          finalKey = `${key}_${counter++}`;
        }

        usedKeys.add(finalKey);
        return finalKey;
      });

      // Data mulai baris ke-7 (index 6)
      const dataRows = raw.slice(6);
      // Konversi ke object
      const rows: RowObject[] = dataRows.map((row) => {
        const obj: RowObject = {};
        mergedHeaders.forEach((key, i) => {
          obj[key] = row[i] ?? "";
        });
        return obj;
      });
      setParsedRows(rows);
      console.log("Parsed rows:", parsedRows);

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
          <div className="space-y-4">
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
            {parsedRows.length > 0 && (
              <div className="mb-2">
                <Input
                  placeholder="Cari nama (PD, ortu, wali), nisn atau nipd..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}
            <div className="rounded-lg border bg-background p-2 overflow-x-auto">
              {parsedRows.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Belum ada data yang diparse.
                </div>
              ) : (
                (() => {
                  // cari field yang relevan
                  const lower = searchQuery.toLowerCase();
                  const filtered = parsedRows.filter((row) => {
                    if (!lower) return true; // show all when query empty
                    return Object.entries(row).some(([k, v]) => {
                      const key = k.toLowerCase();
                      if (
                        key.includes("nama") ||
                        key.includes("nisn") ||
                        key.includes("nipd")
                      ) {
                        return String(v).toLowerCase().includes(lower);
                      }
                      return false;
                    });
                  });

                  const total = filtered.length;
                  let pageCount = 1;
                  if (rowsPerPage !== "Semua") {
                    pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
                  }

                  const displayRows = (() => {
                    if (rowsPerPage === "Semua") return filtered;
                    const start = (currentPage - 1) * rowsPerPage;
                    return filtered.slice(start, start + rowsPerPage);
                  })();

                  return (
                    <div className="max-w-screen-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(parsedRows[0]).map((h) => (
                              <TableHead className="font-semibold" key={h}>
                                {h}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayRows.map((r, i) => (
                            <TableRow
                              className={i % 2 === 0 ? "bg-muted" : ""}
                              key={i}
                            >
                              {Object.values(r).map((v, j) => (
                                <TableCell key={j}>{String(v)}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* pagination controls */}
                      <div className="flex items-center justify-end gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <span>Rows per page:</span>
                          <select
                            className="border rounded p-1"
                            value={rowsPerPage}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRowsPerPage(
                                val === "Semua" ? "Semua" : parseInt(val, 10),
                              );
                              setCurrentPage(1);
                            }}
                          >
                            {rowsPerPageOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                        {rowsPerPage !== "Semua" && (
                          <div className="flex items-center gap-2">
                            <button
                              disabled={currentPage === 1}
                              onClick={() => setCurrentPage((p) => p - 1)}
                            >
                              ‹
                            </button>
                            <span>
                              {currentPage} of {pageCount}
                            </span>
                            <button
                              disabled={currentPage === pageCount}
                              onClick={() => setCurrentPage((p) => p + 1)}
                            >
                              ›
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
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
                  <div className="rounded-lg border bg-background p-2 overflow-x-auto">
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
                  <div className="rounded-lg border bg-background p-2 overflow-x-auto">
                    {analyzeResult.changed?.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        Tidak ada perubahan.
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>NIPD/Username</TableHead>
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
        Catatan: sistem akan mencocokkan entri berdasarkan <strong>NIPD</strong>
        atau <strong>username</strong> jika tersedia.
      </div>
    </div>
  );
}
