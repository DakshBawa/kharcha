import { useEffect, useRef, useState } from "react";
import { CATS, MODES } from "../data/categories.js";
import { todayIso } from "../utils/money.js";

const TEETH = Array.from({ length: 22 }, (_, i) => `L${i * 14 + 7} 10 L${(i + 1) * 14} 0`).join(" ");

export default function ReceiptDialog({ onSave, onClose }) {
  const [type, setType] = useState("expense"), [amount, setAmount] = useState(""), [cat, setCat] = useState("food"), [note, setNote] = useState("");
  const [date, setDate] = useState(todayIso()), [mode, setMode] = useState("UPI"), [err, setErr] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  useEffect(() => {
    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 15);
    return () => clearTimeout(t);
  }, []);

  const adjustAmount = (delta) => {
    setAmount((prev) => {
      const next = Math.max(0, (+prev || 0) + delta);
      return next > 0 ? String(next) : "";
    });
    if (err) setErr("");
  };

  const save = () => {
    if (!(+amount > 0)) return setErr("Enter an amount above zero.");
    onSave({ id: Date.now(), type, amount: Math.round(+amount), cat: type === "income" ? "other" : cat, note: note.trim(), date, mode });
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-label="Add entry">
      <div className="fixed inset-0 bg-ink/55" onClick={onClose} />
      <div className="slide-up relative my-auto w-full max-w-sm">
        <div className="receipt rounded-t-lg px-6 pb-4 pt-6 font-mono">
          <p className="text-center text-[11px] uppercase tracking-[0.3em] text-ink/50">— Kharcha receipt —</p>
          <div className="my-4 flex rounded-full bg-ink/5 p-1 font-sans" role="group" aria-label="Entry type">
            {[["expense", "I spent"], ["income", "I received"]].map(([k, l]) => (
              <button
                key={k}
                type="button"
                onClick={() => setType(k)}
                aria-pressed={type === k}
                className={`flex-1 rounded-full py-1.5 text-sm font-semibold transition ${type === k ? "bg-ink text-paper" : "text-ink/60"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <label className="block">
            <span className="label">Amount</span>
            <span className="flex items-center gap-1 border-b-2 border-ink pb-1">
              <span className="text-3xl font-serif">₹</span>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={amount}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9]/g, "");
                  setAmount(clean);
                  if (err) setErr("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    save();
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    adjustAmount(50);
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    adjustAmount(-50);
                  }
                }}
                className="w-full bg-transparent py-1 text-4xl font-mono focus:outline-none"
                placeholder="0"
                autoComplete="off"
              />
              <div className="flex items-center gap-1 font-sans">
                <button
                  type="button"
                  onClick={() => adjustAmount(-50)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/20 text-sm font-bold text-ink/70 hover:border-ink hover:bg-ink/5 active:scale-95"
                  title="Decrease ₹50 (or Down Arrow)"
                  aria-label="Decrease amount by 50"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => adjustAmount(50)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/20 text-sm font-bold text-ink/70 hover:border-ink hover:bg-ink/5 active:scale-95"
                  title="Increase ₹50 (or Up Arrow)"
                  aria-label="Increase amount by 50"
                >
                  +
                </button>
              </div>
            </span>
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 font-sans">
            {[50, 100, 200, 500].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => adjustAmount(v)}
                className="rounded-full border border-ink/20 bg-ink/5 px-2.5 py-0.5 text-xs font-medium text-ink hover:border-ink hover:bg-ink/10 active:scale-95"
              >
                +{v}
              </button>
            ))}
            {amount && (
              <button
                type="button"
                onClick={() => setAmount("")}
                className="ml-auto text-xs text-ink/50 underline hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>
          {type === "expense" && (
            <div className="mt-4">
              <span className="label">Category</span>
              <div className="mt-2 grid grid-cols-4 gap-1.5 font-sans">
                {CATS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCat(c.id)}
                    aria-pressed={cat === c.id}
                    title={c.name}
                    className={`rounded-xl border py-2 text-center text-[10px] font-semibold leading-tight transition ${cat === c.id ? "border-ink bg-ink/5 shadow-sm" : "border-ink/15 hover:border-ink/40"}`}
                  >
                    <span className="block text-lg">{c.icon}</span>
                    {c.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
          <label className="mt-4 block">
            <span className="label">{type === "income" ? "Source" : "Note"}</span>
            <input
              className="field font-sans"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={type === "income" ? "Pocket money, scholarship…" : "What was it for?"}
            />
          </label>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <label className="block">
              <span className="label">Date</span>
              <input type="date" max={todayIso()} className="field font-sans" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <div>
              <span className="label">Paid by</span>
              <div className="mt-2 flex gap-1 font-sans">
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    aria-pressed={mode === m}
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${mode === m ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink/50"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {err && <p role="alert" className="mt-3 font-sans text-sm font-semibold text-loss">{err}</p>}
          <div className="mt-5 flex gap-2 font-sans">
            <button type="button" className="btn flex-1" onClick={save}>Save entry</button>
            <button type="button" className="btn-line" onClick={onClose}>Cancel</button>
          </div>
        </div>
        <svg viewBox="0 0 308 10" preserveAspectRatio="none" className="receipt-edge" aria-hidden><path d={`M0 0 ${TEETH} Z`} fill="#fff" /></svg>
      </div>
    </div>
  );
}
