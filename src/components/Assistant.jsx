/**
 * Assistant.jsx — Chooses which assistant to show.
 *
 * Starting phase (no role chosen yet): the full Anam avatar (<VoiceAssistant />)
 * greets the visitor and helps them pick student / teacher / institution.
 *
 * After a role is chosen: we stop using Anam (it's costly to run continuously)
 * and switch to the lightweight GIF circle (<MiniAssistant />) powered by our
 * own AI model.
 *
 * The starting experience is intentionally left untouched — only the
 * post-selection assistant changes.
 *
 * Auto-start rule: the GIF circle only starts listening on its own if the
 * visitor actually used Vidya (started an Anam session) during selection. If
 * they picked a role without ever engaging Vidya, the circle waits for a tap.
 */

import { useState } from "react";
import { useRole } from "../hooks/useRole";
import VoiceAssistant from "./VoiceAssistant";
import MiniAssistant from "./MiniAssistant";

export default function Assistant() {
  const { activeRoleId } = useRole();
  // Persists across the VoiceAssistant → MiniAssistant swap (Assistant stays mounted).
  const [vidyaUsed, setVidyaUsed] = useState(false);

  return activeRoleId
    ? <MiniAssistant autoStart={vidyaUsed} />
    : <VoiceAssistant onStarted={() => setVidyaUsed(true)} />;
}
