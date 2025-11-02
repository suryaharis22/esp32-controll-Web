"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Wifi, Cpu, Power } from "lucide-react";

export default function ControlPage() {
  const [relay1, setRelay1] = useState(false);
  const [relay2, setRelay2] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Ambil status dari API
  const fetchStatus = async () => {
    try {
      const res = await axios.get("/api/esp32/status");
      setRelay1(res.data.relay1);
      setRelay2(res.data.relay2);
      setStatus(res.data);
    } catch (err) {
      console.error("Gagal ambil status ESP32:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Toggle Relay
  const toggleRelay = async (relay, currentValue) => {
    setLoading(true);
    try {
      await axios.put(`/api/esp32/${relay}`, { value: !currentValue });
      await fetchStatus();
    } catch (err) {
      console.error(`Gagal ubah status ${relay}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-6 py-12 text-white">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🔥 Kontrol Lampu ESP32
      </motion.h1>

      <motion.p
        className="text-gray-400 text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Monitor & kontrol relay kamu secara realtime
      </motion.p>

      {/* 🔹 Card Relay Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {[{ name: "Relay 1", state: relay1 }, { name: "Relay 2", state: relay2 }].map(
          (relay, index) => (
            <motion.div
              key={relay.name}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/60 backdrop-blur-xl shadow-lg rounded-2xl p-6 flex flex-col items-center border border-gray-700 transition-all"
            >
              <Power
                size={42}
                className={`mb-4 drop-shadow-lg ${relay.state ? "text-green-400" : "text-gray-500"
                  }`}
              />
              <h2 className="text-xl font-semibold mb-3">{relay.name}</h2>
              <button
                disabled={loading}
                onClick={() =>
                  toggleRelay(`relay${index + 1}`, relay.state)
                }
                className={`w-32 py-2 rounded-xl text-lg font-bold transition-all duration-300 ${relay.state
                    ? "bg-green-600 hover:bg-green-700 shadow-green-500/30"
                    : "bg-gray-700 hover:bg-gray-600"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "..." : relay.state ? "ON" : "OFF"}
              </button>
            </motion.div>
          )
        )}
      </div>

      {/* 🔹 Status Section */}
      {status && (
        <motion.div
          className="mt-12 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 w-full max-w-md text-sm md:text-base shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="flex items-center gap-2 text-gray-300 font-semibold mb-3">
            <Cpu size={18} /> Status Perangkat
          </h3>
          <div className="space-y-2 text-gray-400">
            <p className="flex items-center gap-2">
              <Wifi size={16} className="text-blue-400" />{" "}
              <span>{status.status_wifi || "Tidak terhubung"}</span>
            </p>
            <p>
              IP ESP32:{" "}
              <span className="text-white font-medium">
                {status.ip_address || "-"}
              </span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
