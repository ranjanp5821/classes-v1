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
 */

import { useRole } from "../hooks/useRole";
import VoiceAssistant from "./VoiceAssistant";
import MiniAssistant from "./MiniAssistant";

export default function Assistant() {
  const { activeRoleId } = useRole();
  return activeRoleId ? <MiniAssistant /> : <VoiceAssistant />;
}
