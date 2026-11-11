import { CATS } from "../data/categories.js";

export const sum = (xs) => xs.reduce((a, t) => a + t.amount, 0);
export const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const FIXED = CATS.filter((c) => c.fixed).map((c) => c.id);

/* Everything the dashboard needs for one month */
export function summarize(txs, ref, budgets) {
  const now = new Date(), key = monthKey(ref), isCur = key === monthKey(now);
  const dim = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();
  const elapsed = isCur ? now.getDate() : ref < now ? dim : 0;
  const m = txs.filter((t) => t.date.startsWith(key));
  const exp = m.filter((t) => t.type === "expense"), inc = m.filter((t) => t.type === "income");
  const flex = exp.filter((t) => !FIXED.includes(t.cat));
  const spent = sum(exp), flexSpent = sum(flex), income = sum(inc);
  const budget = Object.values(budgets).reduce((a, b) => a + (+b || 0), 0);
  const byDay = Array(dim).fill(0);
  flex.forEach((t) => { byDay[+t.date.slice(8) - 1] += t.amount; });
  const daysLeft = isCur ? dim - now.getDate() + 1 : 0;
  const left = budget - spent;
  return {
    m, exp, inc, flex, spent, income, flexSpent, budget, left, byDay, dim, elapsed, daysLeft, isCur, budgets,
    byCat: Object.fromEntries(CATS.map((c) => [c.id, sum(exp.filter((t) => t.cat === c.id))])),
    safePerDay: daysLeft ? Math.max(0, left) / daysLeft : 0,
    projected: isCur && elapsed > 0 ? spent - flexSpent + (flexSpent / elapsed) * dim : spent,
    allowance: (budget - Object.entries(budgets).filter(([k]) => FIXED.includes(k)).reduce((a, [, v]) => a + (+v || 0), 0)) / dim,
  };
}
