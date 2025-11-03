// src/app/api/esp32/relay1/route.js

import { db, ref, get, set } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const snapshot = await get(ref(db, "esp32/relay1"));
        if (!snapshot.exists()) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ relay1: snapshot.val() });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { value } = await req.json(); // true / false
        await set(ref(db, "esp32/relay1"), value);
        return NextResponse.json({ success: true, relay1: value });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

