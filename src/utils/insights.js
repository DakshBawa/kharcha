import { fmt } from "./money.js";
import { sum } from "./stats.js";

const r50 = (n) => Math.max(0, Math.round(n / 50) * 50);

/* Rule-based saving tips. Each tip has an estimated monthly saving. */
export function buildTips(S, prev) {
  const tips = [], b = S.budgets, scale = S.isCur && S.elapsed ? S.dim / S.elapsed : 1;

  if (S.isCur && S.elapsed > 3 && S.projected > S.budget)
    tips.push({ id: "pace", tone: "warn", icon: "⏱️", save: 0, title: `On track to overspend by ${fmt(S.projected - S.budget)}`, body: `At this pace you'll spend about ${fmt(S.projected)} against a ${fmt(S.budget)} budget. Keep daily spending under ${fmt(S.safePerDay)} to stay on target.` });

  ["food", "travel", "study", "fun", "shopping", "other"].forEach((id) => {
    const over = S.byCat[id] - (+b[id] || 0);
    if (over > 0) tips.push({ id: `over-${id}`, tone: "warn", icon: "🚨", save: r50(over), title: `${id[0].toUpperCase() + id.slice(1)} is ${fmt(over)} over budget`, body: `Try a weekly cap of ${fmt((+b[id] || 0) / 4)} and check the list before each purchase.` });
  });

  const foodProj = S.byCat.food * scale;
  if (foodProj > (+b.food || 0) * 0.8 && S.byCat.food > 0)
    tips.push({ id: "food", tone: "tip", icon: "🍛", save: r50(foodProj * 0.25), title: "Eat at the mess a little more", body: `You've already paid your mess fee, but snacks and cafes cost ${fmt(S.byCat.food)} so far. Swapping two outside meals a week for mess meals saves real money.` });

  const small = S.flex.filter((t) => t.amount <= 100);
  if (small.length >= 8) tips.push({ id: "small", tone: "tip", icon: "🪙", save: r50(sum(small) * scale * 0.25), title: `${small.length} small buys add up to ${fmt(sum(small))}`, body: "Chai, snacks and printouts feel tiny one at a time. Carrying a bottle and batching printouts can cut this by a quarter." });

  const cabs = S.exp.filter((t) => /cab|uber|ola|taxi/i.test(t.note));
  if (cabs.length) tips.push({ id: "cab", tone: "tip", icon: "🚕", save: r50(sum(cabs) * 0.5), title: `Cabs cost you ${fmt(sum(cabs))} this month`, body: "Share a ride with friends or take the bus or metro for the same route. Splitting a cab halves the cost." });

  const subs = S.exp.filter((t) => /spotify|netflix|prime|hotstar|subscription/i.test(t.note));
  if (subs.length) tips.push({ id: "subs", tone: "tip", icon: "📺", save: r50(sum(subs) * 0.4) || 50, title: `Subscriptions: ${fmt(sum(subs))} a month`, body: "Check for student plans or split family plans with friends. Cancel anything you haven't used this month." });

  const wk = S.flex.filter((t) => [0, 6].includes(new Date(`${t.date}T12:00:00`).getDay())), wd = S.flex.filter((t) => ![0, 6].includes(new Date(`${t.date}T12:00:00`).getDay()));
  if (sum(wk) > 0 && S.elapsed >= 7 && sum(wk) / 2 > (sum(wd) / 5) * 1.5)
    tips.push({ id: "weekend", tone: "tip", icon: "🎉", save: r50(sum(wk) * scale * 0.2), title: "Weekends cost you far more", body: `Your weekend days cost about ${fmt(sum(wk) / 2 / Math.max(1, Math.ceil(S.elapsed / 7)))} each versus weekdays. Set a fixed weekend budget and pay for it in cash.` });

  if (S.isCur && S.elapsed > 3 && S.projected < S.budget * 0.9)
    tips.push({ id: "good", tone: "good", icon: "🌱", save: 0, title: `You're about ${fmt(S.budget - S.projected)} under pace`, body: "Nice work. Move part of it into your savings goal now, before it gets spent." });

  return tips.sort((a, b) => (a.tone === "warn" ? 0 : 1) - (b.tone === "warn" ? 0 : 1) || b.save - a.save);
}

export function weekdaySpend(S) {
  const t = Array(7).fill(0);
  S.flex.forEach((x) => { t[new Date(`${x.date}T12:00:00`).getDay()] += x.amount; });
  return t;
}
