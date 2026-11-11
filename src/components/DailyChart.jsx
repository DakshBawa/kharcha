import { fmt } from "../utils/money.js";

export default function DailyChart({ S }) {
  const W = 620, H = 150, bw = W / S.dim;
  const max = Math.max(S.allowance * 1.6, ...S.byDay, 100);
  const y = (v) => H - 14 - (v / max) * (H - 24);
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Daily spending chart">
        {S.byDay.map((v, i) => {
          const future = S.isCur && i + 1 > S.elapsed, over = v > S.allowance;
          return <rect key={i} x={i * bw + 2} y={y(v)} width={bw - 4} height={Math.max(1, H - 14 - y(v))} rx="2" fill={future ? "#1c1b1912" : over ? "#d94f30" : "#1c1b19"}><title>{`Day ${i + 1}: ${fmt(v)}`}</title></rect>;
        })}
        <line x1="0" x2={W} y1={y(S.allowance)} y2={y(S.allowance)} stroke="#1f7a4d" strokeWidth="1.5" strokeDasharray="5 4" />
        {[1, 5, 10, 15, 20, 25, S.dim].map((d) => <text key={d} x={(d - 1) * bw + bw / 2} y={H - 1} textAnchor="middle" fontSize="9" fill="#1c1b1980">{d}</text>)}
      </svg>
      <figcaption className="mt-1 flex flex-wrap gap-x-4 text-xs text-ink/60"><span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-ink" />Daily spend</span><span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-loss" />Above allowance</span><span className="text-gain">- - Daily allowance {fmt(S.allowance)}</span></figcaption>
    </figure>
  );
}
