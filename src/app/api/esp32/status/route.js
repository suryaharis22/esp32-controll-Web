import { db, ref, get } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const relay1Snap = await get(ref(db, "esp32/relay1"));
        const relay2Snap = await get(ref(db, "esp32/relay2"));
        const wifiSnap = await get(ref(db, "esp32/status_wifi"));
        const ipSnap = await get(ref(db, "esp32/ip_address"));

        return NextResponse.json({
            relay1: relay1Snap.val(),
            relay2: relay2Snap.val(),
            status_wifi: wifiSnap.val(),
            ip_address: ipSnap.val(),
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
