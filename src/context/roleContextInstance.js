/**
 * roleContextInstance.js — Stable singleton context object.
 *
 * Kept in its own file so Vite HMR never re-evaluates it when
 * RoleContext.jsx (the provider/hook logic) is hot-reloaded.
 * This prevents the "must be inside RoleProvider" stale-context error.
 */
import { createContext } from "react";

// Single, stable context object shared by provider and all consumers.
export const RoleContext = createContext(null);
