/**
 * RoleContext.jsx — Global Role State
 *
 * Provides the active role and actions to the entire app via React Context.
 * Persists the selected role in localStorage so it survives page refreshes.
 *
 * Exports:
 *   - <RoleProvider />  — wrap the app (or LandingPage) with this
 *   - useRoleContext()  — consume role state anywhere inside the provider
 */

import { useContext, useState, useCallback } from "react";
import { ROLES_CONFIG } from "../config/roles";
import { RoleContext } from "./roleContextInstance";

const STORAGE_KEY = "classess_active_role";

// ─── Provider ─────────────────────────────────────────────────────────────────


export function RoleProvider({ children }) {
  const [config, setConfig] = useState(ROLES_CONFIG);

  // Always start with no role selected — the default Navbar + Hero are shown
  // on every fresh load (no restore from a previous session).
  const [activeRoleId, setActiveRoleId] = useState(null);

  const [activeTab, setActiveTab] = useState(null);

  // Derived: full config object for the active role (or null)
  const activeRoleConfig = activeRoleId ? (config[activeRoleId] ?? null) : null;

  /**
   * Select a role by ID.
   * Validates the ID against the config before committing.
   */
  const selectRole = useCallback((roleId) => {
    if (!ROLES_CONFIG[roleId]) {
      console.warn(`[RoleContext] selectRole: unknown role id "${roleId}". Ignoring.`);
      return;
    }
    setActiveRoleId(roleId);
    setActiveTab(null);
    try {
      localStorage.setItem(STORAGE_KEY, roleId);
    } catch {
      // localStorage unavailable — state still works in-memory
    }
  }, []);

  /**
   * Clear the active role — returns user to the selection screen.
   */
  const clearRole = useCallback(() => {
    setActiveRoleId(null);
    setActiveTab(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  /**
   * Update the active role's branding assets dynamically.
   */
  const updateRoleBrandColors = useCallback((roleId, colors) => {
    setConfig((prev) => {
      if (!prev[roleId]) return prev;
      return {
        ...prev,
        [roleId]: {
          ...prev[roleId],
          ...colors,
        },
      };
    });
  }, []);

  const value = {
    /** ID of the currently active role, or null if none selected */
    activeRoleId,
    /** Full role configuration object, or null */
    activeRoleConfig,
    /** Select a role by ID (validates against ROLES_CONFIG) */
    selectRole,
    /** Clear active role — returns to selection view */
    clearRole,
    /** Active tab/page within the role view */
    activeTab,
    /** Set active tab/page */
    setActiveTab,
    /** Dynamic configurations state */
    config,
    /** Function to update branding theme assets */
    updateRoleBrandColors,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useRoleContext — consume role state and actions.
 * Must be called within a <RoleProvider />.
 */
export function useRoleContext() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error(
      "useRoleContext must be used inside a <RoleProvider>. " +
      "Make sure LandingPage (or App) is wrapped with <RoleProvider>."
    );
  }
  return ctx;
}
