import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useLiveDocScan — lightweight, OpenCV-free auto-capture.
 *
 * The camera shows instantly. Each tick it (1) checks a paper-like page actually
 * fills the frame, and (2) compares a tiny grayscale signature to the previous
 * frame. It only auto-captures when a PAGE IS PRESENT and the frame is held
 * STEADY for STABLE_MS — so it won't snap on an empty desk or mid-positioning.
 *
 * Returns { ready, pagePresent, progress, captureNow, resetCooldown }.
 */
const SIG_W = 32;
const SIG_H = 24;
const TICK_MS = 100;
const STEADY_DELTA = 7; // mean per-pixel grayscale diff below this = steady
const MIN_CENTER_BRIGHT = 122; // the centre of the frame must look like paper (bright)
const BRIGHT_LEVEL = 150; // luminance above this counts as "bright / paper"

function signature(video, canvas) {
  canvas.width = SIG_W;
  canvas.height = SIG_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(video, 0, 0, SIG_W, SIG_H);
  const { data } = ctx.getImageData(0, 0, SIG_W, SIG_H);
  const sig = new Uint8Array(SIG_W * SIG_H);
  for (let i = 0; i < SIG_W * SIG_H; i++) {
    sig[i] = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) | 0;
  }
  return sig;
}

function delta(a, b) {
  if (!a || !b) return 255;
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}

/**
 * Is a FULL page in view? Requires the centre to be paper-bright AND one large,
 * SOLID connected bright region (the page) to fill ≥ minPageFrac of the frame —
 * so scattered brightness, small bright objects or partial views won't trigger.
 */
function looksLikePage(sig, minPageFrac) {
  const N = sig.length;
  let cs = 0;
  let cn = 0;
  const cx0 = (SIG_W * 0.25) | 0;
  const cx1 = (SIG_W * 0.75) | 0;
  const cy0 = (SIG_H * 0.25) | 0;
  const cy1 = (SIG_H * 0.75) | 0;
  for (let y = cy0; y < cy1; y++) {
    for (let x = cx0; x < cx1; x++) {
      cs += sig[y * SIG_W + x];
      cn++;
    }
  }
  if (cs / cn < MIN_CENTER_BRIGHT) return false;

  const bright = new Uint8Array(N);
  let any = 0;
  for (let i = 0; i < N; i++) {
    if (sig[i] > BRIGHT_LEVEL) {
      bright[i] = 1;
      any++;
    }
  }
  if (any < N * minPageFrac) return false;

  const visited = new Uint8Array(N);
  const stack = [];
  let best = 0;
  for (let s = 0; s < N; s++) {
    if (!bright[s] || visited[s]) continue;
    stack.length = 0;
    stack.push(s);
    visited[s] = 1;
    let size = 0;
    while (stack.length) {
      const idx = stack.pop();
      size++;
      const x = idx % SIG_W;
      const y = (idx / SIG_W) | 0;
      if (x > 0 && bright[idx - 1] && !visited[idx - 1]) { visited[idx - 1] = 1; stack.push(idx - 1); }
      if (x < SIG_W - 1 && bright[idx + 1] && !visited[idx + 1]) { visited[idx + 1] = 1; stack.push(idx + 1); }
      if (y > 0 && bright[idx - SIG_W] && !visited[idx - SIG_W]) { visited[idx - SIG_W] = 1; stack.push(idx - SIG_W); }
      if (y < SIG_H - 1 && bright[idx + SIG_W] && !visited[idx + SIG_W]) { visited[idx + SIG_W] = 1; stack.push(idx + SIG_W); }
    }
    if (size > best) best = size;
  }
  return best / N >= minPageFrac;
}

export function useLiveDocScan({
  videoRef,
  active,
  onCapture,
  cooldownMs = 1300,
  stableMs = 600, // how long to hold steady before auto-capture
  minPageFrac = 0.34, // a solid page must fill ≥ this fraction of the frame to capture
}) {
  const [ready, setReady] = useState(false);
  const [pagePresent, setPagePresent] = useState(false);
  const [progress, setProgress] = useState(0);

  const sigCanvasRef = useRef(document.createElement("canvas"));
  const lastSigRef = useRef(null);
  const steadySinceRef = useRef(0);
  const cooldownUntilRef = useRef(0);
  const onCaptureRef = useRef(onCapture);
  useEffect(() => {
    onCaptureRef.current = onCapture;
  }, [onCapture]);

  const fire = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    cooldownUntilRef.current = Date.now() + cooldownMs;
    steadySinceRef.current = 0;
    lastSigRef.current = null;
    setProgress(0);
    onCaptureRef.current?.({
      dataUrl: c.toDataURL("image/jpeg", 0.92),
      cropped: false,
      w: c.width,
      h: c.height,
    });
  }, [videoRef, cooldownMs]);

  const captureNow = useCallback(() => fire(), [fire]);

  const resetCooldown = useCallback((ms = 0) => {
    cooldownUntilRef.current = Date.now() + ms;
    steadySinceRef.current = 0;
    lastSigRef.current = null;
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      const v = videoRef.current;
      if (!v || !v.videoWidth) return;
      if (!ready) setReady(true);
      if (Date.now() < cooldownUntilRef.current) return;

      const sig = signature(v, sigCanvasRef.current);
      const mv = delta(sig, lastSigRef.current);
      lastSigRef.current = sig;

      const onPage = looksLikePage(sig, minPageFrac);
      setPagePresent(onPage);

      // Only count steadiness while a page is actually in view.
      if (onPage && mv < STEADY_DELTA) {
        if (!steadySinceRef.current) steadySinceRef.current = Date.now();
        const held = Date.now() - steadySinceRef.current;
        setProgress(Math.min(1, held / stableMs));
        if (held >= stableMs) fire();
      } else {
        steadySinceRef.current = 0;
        setProgress(0);
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [active, ready, videoRef, fire, stableMs, minPageFrac]);

  return { ready, pagePresent, progress, captureNow, resetCooldown };
}
