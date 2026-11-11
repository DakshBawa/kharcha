import { useEffect, useState } from "react";

/* Like useState, but remembers the value in the browser (localStorage) */
export default function usePersistentState(key, init) {
  const [v, setV] = useState(() => {
    try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch { /* ignore */ }
    return typeof init === "function" ? init() : init;
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ } }, [key, v]);
  return [v, setV];
}
