import { useEffect, useRef, useState } from "react";
import { CATS, DEFAULT_BUDGETS } from "../data/categories.js";
import { fmt } from "../utils/money.js";

const TEETH = Array.from({ length: 22 }, (_, i) => `L${i * 14 + 7} 10 L${(i + 1) * 14} 0`).join(" ");

export default function BudgetDialog({ budgets, setBudgets, onClose, toast }) {
  const currentTotal = Object.values(budgets).reduce((a, b) => a + (+b || 0), 0);
  const [totalInput, setTotalInput] = useState(String(currentTotal));
  const [catBudgets, setCatBudgets] = useState({ ...budgets });
  const [mode, setMode] = useState("total"); // "total" | "category"
  const [err, setErr] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 15);
    return () => clearTimeout(t);
  }, [mode]);

  // Distribute total proportionally across categories
  const distributeTotal = (newTotal) => {
    const clean = String(newTotal).replace(/[^0-9]/g, "");
    setTotalInput(clean);
    const t = +clean || 0;
    if (t <= 0) return;

    const refBudgets = currentTotal > 0 ? budgets : DEFAULT_BUDGETS;
    const refTotal = Object.values(refBudgets).reduce((a, b) => a + (+b || 0), 0) || 1;

    const updated = {};
    let allocated = 0;
    CATS.forEach((c, idx) => {
      if (idx === CATS.length - 1) {
        updated[c.id] = Math.max(0, t - allocated);
      } else {
        const ratio = (+refBudgets[c.id] || 0) / refTotal;
        const share = Math.round((ratio * t) / 50) * 50;
        updated[c.id] = share;
        allocated += share;
      }
    });
    setCatBudgets(updated);
    if (err) setErr("");
  };

  const addAmount = (amountToAdd) => {
    const current = +totalInput || 0;
    const next = Math.max(0, current + amountToAdd);
    distributeTotal(next);
  };

  const handleCatChange = (catId, val) => {
    const clean = val.replace(/[^0-9]/g, "");
    const num = clean === "" ? 0 : +clean;
    const updated = { ...catBudgets, [catId]: num };
    setCatBudgets(updated);
    const sumTotal = Object.values(updated).reduce((a, b) => a + (+b || 0), 0);
    setTotalInput(String(sumTotal));
    if (err) setErr("");
  };

  const liveTotal = Object.values(catBudgets).reduce((a, b) => a + (+b || 0), 0);

  const save = () => {
    if (!(liveTotal > 0)) {
      return setErr("Please set a monthly budget greater than ₹0.");
    }
    setBudgets(catBudgets);
    if (toast) toast(`Monthly budget set to ${fmt(liveTotal)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-label="Set budget">
      <div className="fixed inset-0 bg-ink/55" onClick={onClose} />
      <div className="slide-up relative my-auto w-full max-w-sm">
        <div className="receipt rounded-t-lg px-6 pb-4 pt-6 font-mono">
          <p className="text-center text-[11px] uppercase tracking-[0.3em] text-ink/50">— Kharcha budget —</p>
          <h3 className="mt-1 text-center font-serif text-3xl">Set monthly budget</h3>

          <div className="my-4 flex rounded-full bg-ink/5 p-1 font-sans" role="group" aria-label="Budget mode">
            <button
              type="button"
              onClick={() => setMode("total")}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold ${mode === "total" ? "bg-ink text-paper" : "text-ink/60"}`}
            >
              Overall total
            </button>
            <button
              type="button"
              onClick={() => setMode("category")}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold ${mode === "category" ? "bg-ink text-paper" : "text-ink/60"}`}
            >
              Category breakdown
            </button>
          </div>

          {mode === "total" ? (
            <div>
              <label className="block">
                <span className="label">Total Budget</span>
                <span className="flex items-center gap-1 border-b-2 border-ink pb-1">
                  <span className="text-3xl font-serif">₹</span>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={totalInput}
                    onChange={(e) => distributeTotal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        save();
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        addAmount(500);
                      } else if (e.key === "ArrowDown") {
                        e.preventDefault();
                        addAmount(-500);
                      }
                    }}
                    className="w-full bg-transparent py-1 text-4xl font-mono focus:outline-none"
                    placeholder="0"
                    autoComplete="off"
                  />
                  <div className="flex items-center gap-1 font-sans">
                    <button
                      type="button"
                      onClick={() => addAmount(-500)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/20 text-sm font-bold text-ink/70 hover:border-ink hover:bg-ink/5 active:scale-95"
                      title="Decrease ₹500"
                      aria-label="Decrease budget"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => addAmount(500)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/20 text-sm font-bold text-ink/70 hover:border-ink hover:bg-ink/5 active:scale-95"
                      title="Increase ₹500"
                      aria-label="Increase budget"
                    >
                      +
                    </button>
                  </div>
                </span>
              </label>

              {/* Quick Add Buttons */}
              <div className="mt-3">
                <span className="label text-[10px]">Add to budget</span>
                <div className="mt-1 flex flex-wrap gap-1.5 font-sans">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => addAmount(amt)}
                      className="rounded-full border border-ink/20 bg-ink/5 px-2.5 py-0.5 text-xs font-medium text-ink hover:border-ink hover:bg-ink/10 active:scale-95"
                    >
                      +{fmt(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div className="mt-3">
                <span className="label text-[10px]">Presets</span>
                <div className="mt-1 flex flex-wrap gap-1.5 font-sans">
                  {[8000, 10000, 15000, 20000, 25000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => distributeTotal(amt)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition ${+totalInput === amt ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink/50"}`}
                    >
                      {fmt(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-3 font-sans text-xs text-ink/55">
                Automatically adjusts all categories proportionally. Switch to breakdown above to tweak individual limits.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-2 flex items-center justify-between font-sans">
                <span className="label">Categories</span>
                <span className="font-mono text-xs font-semibold">Total: {fmt(liveTotal)}</span>
              </div>
              <div className="max-h-56 space-y-2 overflow-y-auto pr-1 font-sans">
                {CATS.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-2 border-b border-ink/10 pb-1 text-sm">
                    <span className="flex items-center gap-1.5 text-xs font-medium">
                      <span>{c.icon}</span> {c.name}
                    </span>
                    <div className="flex items-center gap-0.5 font-mono text-xs">
                      <span>₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={catBudgets[c.id] ?? ""}
                        onChange={(e) => handleCatChange(c.id, e.target.value)}
                        className="w-16 border-b border-ink/30 bg-transparent py-0.5 text-right font-mono focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {err && <p role="alert" className="mt-3 font-sans text-sm font-semibold text-loss">{err}</p>}

          <div className="mt-5 flex gap-2 font-sans">
            <button type="button" className="btn flex-1" onClick={save}>
              Save budget
            </button>
            <button type="button" className="btn-line" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
        <svg viewBox="0 0 308 10" preserveAspectRatio="none" className="receipt-edge" aria-hidden>
          <path d={`M0 0 ${TEETH} Z`} fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

