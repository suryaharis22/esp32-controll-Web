import { db, ref, get } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const snapshot = await get(ref(db, "esp32"));
        if (!snapshot.exists()) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(snapshot.val());
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
