import { CATS } from "../data/categories.js";
import { fmt } from "../utils/money.js";

export default function CategoryBars({ S }) {
  const rows = [...CATS].sort((a, b) => S.byCat[b.id] - S.byCat[a.id]);
  return (
    <ul className="space-y-4">
      {rows.map((c) => {
        const spent = S.byCat[c.id], bud = +S.budgets[c.id] || 0, over = spent > bud, pct = bud ? Math.min(100, (spent / bud) * 100) : spent ? 100 : 0;
        return (
          <li key={c.id}>
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="font-semibold"><span aria-hidden>{c.icon}</span> {c.name}</span>
              <span className="font-mono text-xs"><b className={over ? "text-loss" : ""}>{fmt(spent)}</b> <span className="text-ink/50">/ {fmt(bud)}</span></span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-ink/10"><div className="bar h-full rounded-full" style={{ width: `${pct}%`, background: over ? "#d94f30" : c.color }} /></div>
            {over && <p className="mt-1 text-xs font-semibold text-loss">{fmt(spent - bud)} over budget</p>}
          </li>
        );
      })}
    </ul>
  );
}
