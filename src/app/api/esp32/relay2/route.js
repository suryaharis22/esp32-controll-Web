import { db, ref, get, set } from "@/lib/firebase";
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
        await set(ref(db, "esp32/relay2"), value);
        return NextResponse.json({ success: true, relay2: value });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
