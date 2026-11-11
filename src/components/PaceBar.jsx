export default function PaceBar({ S }) {
  const spentPct = Math.min(100, (S.spent / S.budget) * 100), dayPct = (S.elapsed / S.dim) * 100;
  const hot = S.isCur && spentPct > dayPct + 8;
  return (
    <div>
      <div className="relative h-3 rounded-full bg-ink/10">
        <div className={`bar absolute inset-y-0 left-0 rounded-full ${S.spent > S.budget ? "bg-loss" : hot ? "bg-[#e9a23b]" : "bg-ink"}`} style={{ width: `${spentPct}%` }} />
        {S.isCur && <div className="absolute -inset-y-1.5 w-0.5 bg-loss" style={{ left: `${dayPct}%` }} title="Today" />}
      </div>
      <div className="mt-2 flex justify-between text-xs text-ink/60">
        <span>Spent {Math.round((S.spent / S.budget) * 100)}% of budget</span>
        {S.isCur && <span><span className="text-loss">▌</span> Day {S.elapsed} of {S.dim} ({Math.round(dayPct)}% of month)</span>}
      </div>
    </div>
  );
}
