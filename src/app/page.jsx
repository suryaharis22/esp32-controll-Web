"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Wifi, Cpu, Power, Loader2 } from "lucide-react";

export default function ControlPage() {
  const [relay1, setRelay1] = useState(false);
  const [relay2, setRelay2] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [starterCooldown, setStarterCooldown] = useState(false);

  // Ambil status ESP32
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
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  // Toggle Relay
  const toggleRelay = async (relay, currentValue) => {
    if (relay === "relay2" && !relay1) {
      alert("⚠️ Kontak belum ON! Nyalakan kontak dulu sebelum starter.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`/api/esp32/${relay}`, { value: !currentValue });
      if (relay === "relay2" && res.data.success && !currentValue) {
        setStarterCooldown(true);
        setTimeout(() => setStarterCooldown(false), 5000);
      }
      await fetchStatus();
    } catch (err) {
      console.error(`Gagal ubah status ${relay}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-6 py-12 text-white relative overflow-hidden">
      {/* Background animasi */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,135,0.08),transparent_70%)] blur-2xl"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-4 text-center drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⚡ Kontrol Sepeda Motor ESP32
      </motion.h1>

      <motion.p
        className="text-gray-400 text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Kontrol Kontak & Starter motor kamu secara realtime 🔧
      </motion.p>

      {/* Card Relay Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {[
          { name: "Kontak Motor", state: relay1, id: "relay1" },
          { name: "Starter Motor", state: relay2, id: "relay2" },
        ].map((relay) => (
          <motion.div
            key={relay.id}
            whileHover={{ scale: 1.05 }}
            className={`relative bg-gray-800/70 backdrop-blur-xl rounded-2xl p-8 border ${relay.state
                ? "border-green-400/40 shadow-lg shadow-green-400/10"
                : "border-gray-700"
              } transition-all duration-500`}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center"
            >
              <Power
                size={50}
                className={`mb-4 transition-all duration-500 ${relay.state ? "text-green-400 drop-shadow-md" : "text-gray-500"
                  }`}
              />
              <h2 className="text-2xl font-semibold mb-4">{relay.name}</h2>

              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={
                  loading ||
                  (relay.id === "relay2" && (!relay1 || starterCooldown))
                }
                onClick={() => toggleRelay(relay.id, relay.state)}
                className={`w-36 py-3 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all ${relay.state
                    ? "bg-green-600 hover:bg-green-700 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    : "bg-gray-700 hover:bg-gray-600"
                  } ${loading || (relay.id === "relay2" && (!relay1 || starterCooldown))
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Loading
                  </>
                ) : relay.state ? (
                  "ON"
                ) : (
                  "OFF"
                )}
              </motion.button>

              {/* Pesan kondisi */}
              {relay.id === "relay2" && !relay1 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm mt-3"
                >
                  ⚠️ Kontak harus ON dulu!
                </motion.p>
              )}
              {relay.id === "relay2" && starterCooldown && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-yellow-400 text-sm mt-3"
                >
                  ⏳ Starter cooldown 5 detik...
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Status Perangkat */}
      {status && (
        <motion.div
          className="mt-14 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 w-full max-w-md text-sm md:text-base shadow-xl"
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
