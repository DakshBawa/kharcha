import { useState } from "react";
import TipCard from "../components/TipCard.jsx";
import { fmt } from "../utils/money.js";
import { weekdaySpend } from "../utils/insights.js";

export default function Insights({ S, tips, goal, setGoal, toast }) {
  const [add, setAdd] = useState("");
  const potential = tips.reduce((a, t) => a + t.save, 0), wd = weekdaySpend(S), max = Math.max(...wd, 1);
  const pct = Math.min(100, (goal.saved / goal.target) * 100), months = potential > 0 ? Math.ceil((goal.target - goal.saved) / potential) : null;
  const put = () => { if (+add > 0) { setGoal({ ...goal, saved: goal.saved + Math.round(+add) }); setAdd(""); toast(`${fmt(+add)} added to your goal`); } };
  return (
    <div>
      <h2 className="font-serif text-5xl">Ways to save</h2>
      <p className="mb-8 mt-1 text-ink/60">{potential > 0 ? <>Following these could free up about <b className="text-gain">{fmt(potential)}</b> a month.</> : "Based on your spending this month."}</p>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">{tips.map((t) => <TipCard key={t.id} tip={t} />)}{tips.length === 0 && <p className="font-serif text-2xl italic text-ink/45">No ideas yet. Log a few more days of spending.</p>}</div>
        <div className="space-y-8">
          <section className="rounded-2xl border border-ink/15 bg-white p-5">
            <p className="label">Savings goal</p>
            <h3 className="font-serif text-3xl">{goal.name}</h3>
            <p className="mt-1 font-mono text-sm">{fmt(goal.saved)} <span className="text-ink/50">of {fmt(goal.target)}</span></p>
            <div className="mt-3 h-2.5 rounded-full bg-ink/10"><div className="bar h-full rounded-full bg-gain" style={{ width: `${pct}%` }} /></div>
            <p className="mt-2 text-xs text-ink/60">{pct >= 100 ? "Goal reached. Well done!" : months ? `About ${months} month${months > 1 ? "s" : ""} to go if you follow the ideas.` : "Add savings to get closer."}</p>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="field font-mono"
                placeholder="₹ to add"
                value={add}
                onChange={(e) => setAdd(e.target.value.replace(/[^0-9]/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && put()}
                aria-label="Amount to add"
              />
              <button className="btn" onClick={put}>Add</button>
            </div>
            <div className="mt-3 flex gap-2">
              <input className="field" value={goal.name} onChange={(e) => setGoal({ ...goal, name: e.target.value })} aria-label="Goal name" />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="field w-28 font-mono"
                value={goal.target}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9]/g, "");
                  setGoal({ ...goal, target: Math.max(1, +clean || 1) });
                }}
                aria-label="Goal amount"
              />
            </div>
          </section>
          <section>
            <h3 className="mb-3 font-serif text-2xl">Spending by weekday</h3>
            <div className="flex h-32 items-end gap-2">{wd.map((v, i) => <div key={i} className="flex flex-1 flex-col items-center gap-1"><div className="w-full rounded-t bg-ink" style={{ height: `${(v / max) * 100}%`, minHeight: 2, opacity: i === 0 || i === 6 ? 1 : 0.55 }} title={fmt(v)} /><span className="text-[10px] font-semibold text-ink/55">{"SMTWTFS"[i]}</span></div>)}</div>
            <p className="mt-2 text-xs text-ink/55">Darker bars are weekends. Excludes hostel and mess fees.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
