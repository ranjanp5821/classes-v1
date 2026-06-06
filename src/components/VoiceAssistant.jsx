/**
 * VoiceAssistant.jsx — Anam.ai avatar voice assistant
 *
 * Floating widget pinned to the bottom-right of the landing page.
 * Click the bubble to open a panel that streams the Anam avatar and starts
 * a realtime voice conversation (mic in, avatar speaks back).
 *
 * Security: the Anam API key is NEVER used here. The client fetches a
 * short-lived session token from `/api/anam-session-token` (served by the
 * Vite middleware in vite.config.js, which holds the key server-side).
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@anam-ai/js-sdk";
import { Mic, MicOff, X, Phone, Loader2, Bot } from "lucide-react";

const VIDEO_ID = "anam-avatar-video";

// Anam event names (the SDK's AnamEvent enum values are these strings).
const EVT_VIDEO_PLAY_STARTED = "VIDEO_PLAY_STARTED";
const EVT_CONNECTION_CLOSED = "CONNECTION_CLOSED";

export default function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | connecting | live | error
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(null);

  const clientRef = useRef(null);

  // Tear down the session whenever the panel closes or the page unmounts.
  const stop = async () => {
    try {
      await clientRef.current?.stopStreaming();
    } catch {
      // ignore — already stopped
    }
    clientRef.current = null;
    setStatus("idle");
    setMuted(false);
  };

  useEffect(() => {
    return () => {
      clientRef.current?.stopStreaming().catch(() => {});
    };
  }, []);

  const start = async () => {
    setStatus("connecting");
    setError(null);
    try {
      const res = await fetch("/api/anam-session-token", { method: "POST" });
      if (!res.ok) throw new Error(`Token request failed (${res.status})`);
      const { sessionToken } = await res.json();
      if (!sessionToken) throw new Error("No session token returned");

      const client = createClient(sessionToken);
      clientRef.current = client;

      client.addListener(EVT_VIDEO_PLAY_STARTED, () => setStatus("live"));
      client.addListener(EVT_CONNECTION_CLOSED, () => stop());

      // streamToVideoElement plays audio through the same <video> and
      // automatically captures the user's microphone for the conversation.
      await client.streamToVideoElement(VIDEO_ID);
    } catch (err) {
      setError(err.message || "Could not start the assistant");
      setStatus("error");
      clientRef.current = null;
    }
  };

  const openPanel = () => {
    setOpen(true);
    start();
  };

  const closePanel = () => {
    setOpen(false);
    stop();
  };

  const toggleMute = () => {
    const client = clientRef.current;
    if (!client) return;
    if (muted) {
      client.unmuteInputAudio();
      setMuted(false);
    } else {
      client.muteInputAudio();
      setMuted(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="va-panel"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className="w-[320px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-neutral-100"
          >
            {/* Avatar video */}
            <div className="relative aspect-[3/4] bg-neutral-900">
              <video
                id={VIDEO_ID}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />

              {/* Connecting / error overlay */}
              {status !== "live" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/90 bg-neutral-900">
                  {status === "error" ? (
                    <>
                      <X size={28} className="text-red-400" />
                      <p className="px-6 text-center text-[13px] text-neutral-300">
                        {error}
                      </p>
                      <button
                        onClick={start}
                        className="mt-1 rounded-lg bg-white/10 px-3 py-1.5 text-[13px] font-medium hover:bg-white/20"
                      >
                        Retry
                      </button>
                    </>
                  ) : (
                    <>
                      <Loader2 size={28} className="animate-spin" />
                      <p className="text-[13px] text-neutral-300">Connecting…</p>
                    </>
                  )}
                </div>
              )}

              {/* Live badge */}
              {status === "live" && (
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-semibold text-white">Live</span>
                </div>
              )}

              <button
                onClick={closePanel}
                aria-label="Close assistant"
                className="absolute right-3 top-3 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <X size={16} />
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="leading-tight">
                <p className="text-[13.5px] font-bold text-neutral-900">
                  Classess Assistant
                </p>
                <p className="text-[11.5px] text-neutral-400">
                  {status === "live" ? "Listening — just speak" : "Voice assistant"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  disabled={status !== "live"}
                  aria-label={muted ? "Unmute microphone" : "Mute microphone"}
                  className="rounded-full border border-neutral-200 p-2 text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-40"
                >
                  {muted ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <button
                  onClick={closePanel}
                  aria-label="End conversation"
                  className="rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                >
                  <Phone size={16} className="rotate-[135deg]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher bubble */}
      {!open && (
        <motion.button
          onClick={openPanel}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open voice assistant"
          className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl"
          style={{ background: "linear-gradient(135deg, #6366f1, #0ea5e9)" }}
        >
          <Bot size={24} />
        </motion.button>
      )}
    </div>
  );
}
