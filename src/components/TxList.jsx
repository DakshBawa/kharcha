import { catOf } from "../data/categories.js";
import { fmt, fmtDay } from "../utils/money.js";

export default function TxList({ txs, onDelete, empty = "Nothing here yet." }) {
  if (!txs.length) return <p className="py-8 text-center font-serif text-xl italic text-ink/45">{empty}</p>;
  const days = [...new Set(txs.map((t) => t.date))].sort().reverse();
  return (
    <div className="space-y-6">
      {days.map((d) => {
        const list = txs.filter((t) => t.date === d), total = list.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
        return (
          <section key={d}>
            <h3 className="flex items-baseline justify-between border-b border-ink/80 pb-1"><span className="font-serif text-xl">{fmtDay(d)}</span>{total > 0 && <span className="font-mono text-xs text-ink/60">spent {fmt(total)}</span>}</h3>
            <ul>
              {list.map((t) => {
                const c = catOf(t.cat);
                return (
                  <li key={t.id} className="group flex items-center gap-3 border-b border-ink/10 py-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-base" style={{ background: `${c.color}22` }} aria-hidden>{t.type === "income" ? "💰" : c.icon}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{t.note || c.name}</span><span className="text-xs text-ink/55">{t.type === "income" ? "Income" : c.name} · {t.mode}</span></span>
                    <span className={`font-mono text-sm font-medium ${t.type === "income" ? "text-gain" : ""}`}>{t.type === "income" ? "+" : "−"}{fmt(t.amount).replace("−", "")}</span>
                    {onDelete && <button onClick={() => onDelete(t.id)} aria-label={`Delete ${t.note || c.name}`} className="w-6 text-lg text-ink/30 hover:text-loss sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100">×</button>}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
