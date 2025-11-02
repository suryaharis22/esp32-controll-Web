"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ControlPage() {
    const [relay1, setRelay1] = useState(false);
    const [relay2, setRelay2] = useState(false);
    const [status, setStatus] = useState(null);

    // 🔹 Ambil data dari API
    const fetchStatus = async () => {
        try {
            const res = await axios.get("/api/esp32/status");
            setRelay1(res.data.relay1);
            setRelay2(res.data.relay2);
            setStatus(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000); // refresh tiap 5 detik
        return () => clearInterval(interval);
    }, []);

    // 🔹 Toggle Relay
    const toggleRelay = async (relay, currentValue) => {
        try {
            await axios.put(`/api/esp32/${relay}`, { value: !currentValue });
            fetchStatus();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-8">
            <h1 className="text-2xl font-bold">🔥 Kontrol ESP32 via Firebase</h1>

            <div className="flex gap-6">
                <button
                    onClick={() => toggleRelay("relay1", relay1)}
                    className={`px-6 py-3 rounded-xl ${relay1 ? "bg-green-600" : "bg-gray-600"
                        }`}
                >
                    Relay 1: {relay1 ? "ON" : "OFF"}
                </button>

                <button
                    onClick={() => toggleRelay("relay2", relay2)}
                    className={`px-6 py-3 rounded-xl ${relay2 ? "bg-green-600" : "bg-gray-600"
                        }`}
                >
                    Relay 2: {relay2 ? "ON" : "OFF"}
                </button>
            </div>

            {status && (
                <div className="mt-6 text-sm text-gray-300">
                    <p>Wi-Fi: {status.status_wifi || "-"}</p>
                    <p>IP ESP32: {status.ip_address || "-"}</p>
                </div>
            )}
        </div>
    );
}
