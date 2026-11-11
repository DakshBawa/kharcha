import { CATS } from "../data/categories.js";
import { fmt } from "../utils/money.js";

export default function Budgets({ S, prev, budgets, setBudgets, toast, onOpenBudget }) {
  const total = Object.values(budgets).reduce((a, b) => a + (+b || 0), 0);
  const fromLast = () => {
    setBudgets(Object.fromEntries(CATS.map((c) => [c.id, Math.max(100, Math.ceil((prev.byCat[c.id] * 1.05) / 100) * 100)])));
    toast("Budgets set from last month's spending, plus 5%");
  };

  const handleBudgetChange = (catId, val) => {
    const clean = val.replace(/[^0-9]/g, "");
    setBudgets({ ...budgets, [catId]: clean === "" ? 0 : +clean });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-5xl">Monthly budgets</h2>
          <p className="mt-1 text-ink/60">Set a limit for each category. Total: <b>{fmt(total)}</b></p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onOpenBudget && (
            <button className="btn" onClick={onOpenBudget}>
              ＋ Set monthly budget
            </button>
          )}
          <button className="btn-line" onClick={fromLast}>Base on last month</button>
        </div>
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-[11px] uppercase tracking-widest text-ink/55">
              <th className="pb-2 font-semibold">Category</th>
              <th className="pb-2 font-semibold">Budget (₹)</th>
              <th className="pb-2 font-semibold">Spent</th>
              <th className="pb-2 text-right font-semibold">Left</th>
            </tr>
          </thead>
          <tbody>
            {CATS.map((c) => {
              const bud = +budgets[c.id] || 0, left = bud - S.byCat[c.id];
              return (
                <tr key={c.id} className="border-b border-ink/10">
                  <td className="py-3 font-semibold"><span aria-hidden>{c.icon}</span> {c.name}</td>
                  <td>
                    <div className="flex items-center gap-1 font-mono">
                      <span>₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={budgets[c.id] ?? ""}
                        onChange={(e) => handleBudgetChange(c.id, e.target.value)}
                        className="w-24 border-b border-ink/30 bg-transparent py-1 font-mono focus:border-ink focus:outline-none"
                        aria-label={`${c.name} budget`}
                      />
                    </div>
                  </td>
                  <td className="font-mono">{fmt(S.byCat[c.id])}</td>
                  <td className={`text-right font-mono font-medium ${left < 0 ? "text-loss" : "text-gain"}`}>{fmt(left)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
