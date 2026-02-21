import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAllUser, insertUser, editUser } from "@/lib/api/user";

function getVal(row: any, keys: string[]) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "")
      return String(row[k]).trim();
    // try case-insensitive
    const found = Object.keys(row).find(
      (rk) => rk.toLowerCase() === k.toLowerCase(),
    );
    if (
      found &&
      row[found] !== undefined &&
      row[found] !== null &&
      String(row[found]).trim() !== ""
    )
      return String(row[found]).trim();
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rows: any[] = body.rows ?? [];
    const sync: boolean = !!body.sync;

    // ambil semua user
    const { data: existingUsers, error } = await getAllUser();
    const users: any[] = existingUsers ?? [];

    // const byEmail = new Map<string, any>();
    const byUsername = new Map<string, any>();
    // index by email & username (case-insensitive)
    for (const u of users) {
      if (u.username) byUsername.set(String(u.username).toLowerCase(), u);
      // tidak ada record emial sbnrnya cmn jika mau tambah email, kode dibwh diisi
      // if (u.email) byEmail.set(String(u.email).toLowerCase(), u);
    }

    const notInserted: any[] = [];
    const changed: any[] = [];
    let insertedCount = 0;
    let updatedCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const email = getVal(row, ["email", "Email", "EMAIL"]);
      const username = getVal(row, ["NIPD", "NIS", "nis", "nipd"]);
      const name = getVal(row, ["name", "nama", "Nama", "NAMA"]);
      const role = getVal(row, ["role"]) ?? "pelajar";

      const ident = username ?? null;
      if (!ident) {
        notInserted.push({
          rowIndex: i,
          reason: "Tidak ada identifier (NIPD/username)",
          row,
        });
        continue;
      }

      // try find
      const found = username && byUsername.get(username.toLowerCase());

      if (!found) {
        // new user
        if (sync) {
          try {
            // default password 'password' (admin should force reset)
            await insertUser(
              name ?? username ?? email ?? "",
              username ?? email ?? "user_" + Date.now(),
              "password",
              role,
            );
            insertedCount++;
          } catch (e) {
            notInserted.push({
              rowIndex: i,
              reason: `Gagal memasukkan: ${e instanceof Error ? e.message : String(e)}`,
              row,
            });
          }
        } else {
          notInserted.push({
            rowIndex: i,
            reason: "Belum ada di DB (baru)",
            row,
          });
        }
      } else {
        // compare fields
        const diffs: any = {};
        if (name && String(name) !== String(found.name ?? ""))
          diffs.name = { before: found.name ?? "", after: name };
        if (username && String(username) !== String(found.username ?? ""))
          diffs.username = { before: found.username ?? "", after: username };
        if (role && String(role) !== String(found.role ?? "pelajar"))
          diffs.role = { before: found.role ?? "pelajar", after: role };

        if (Object.keys(diffs).length > 0) {
          if (sync) {
            try {
              await editUser(
                found.id,
                name ?? found.name,
                username ?? found.username,
                null,
                role ?? found.role,
              );
              updatedCount++;
            } catch (e) {
              notInserted.push({
                rowIndex: i,
                reason: `Gagal update: ${e instanceof Error ? e.message : String(e)}`,
                row,
              });
            }
          }
          changed.push({ ident: email ?? username, diffs });
        }
      }
    }

    return NextResponse.json({
      notInserted,
      changed,
      insertedCount,
      updatedCount,
    });
  } catch (e: any) {
    console.error(e);
    return new NextResponse(String(e?.message ?? "Server error"), {
      status: 500,
    });
  }
}
