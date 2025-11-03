import { db, ref, get, set, update } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const snapshot = await get(ref(db, "esp32/relay2"));
        if (!snapshot.exists()) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ relay2: snapshot.val() });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { value } = await req.json();

        // 🔹 Cek status kontak (relay1)
        const relay1Snap = await get(ref(db, "esp32/relay1"));
        const relay1On = relay1Snap.exists() ? relay1Snap.val() : false;

        // 🔹 Jika kontak OFF, tolak starter
        if (!relay1On) {
            return NextResponse.json(
                { success: false, message: "Kontak OFF, starter tidak bisa dinyalakan." },
                { status: 400 }
            );
        }

        // 🔹 Jika minta menyalakan starter
        if (value === true) {
            await set(ref(db, "esp32/relay2"), true);

            // Setelah 5 detik, auto OFF
            setTimeout(async () => {
                await set(ref(db, "esp32/relay2"), false);
            }, 5000);

            return NextResponse.json({
                success: true,
                relay2: true,
                message: "Starter ON (akan mati otomatis dalam 5 detik)",
            });
        }

        // 🔹 Jika minta mematikan starter
        await set(ref(db, "esp32/relay2"), false);
        return NextResponse.json({ success: true, relay2: false });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
