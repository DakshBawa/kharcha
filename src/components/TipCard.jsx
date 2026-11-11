import { fmt } from "../utils/money.js";

const TONE = { warn: "border-loss/40 bg-loss/5", tip: "border-ink/15 bg-white", good: "border-gain/40 bg-gain/5" };

export default function TipCard({ tip }) {
  return (
    <article className={`flex gap-4 rounded-2xl border p-4 ${TONE[tip.tone]}`}>
      <span className="text-2xl" aria-hidden>{tip.icon}</span>
      <div className="flex-1">
        <h3 className="font-serif text-xl leading-snug">{tip.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink/70">{tip.body}</p>
        {tip.save > 0 && <p className="mt-2 inline-block rounded-full bg-gain/10 px-3 py-1 text-xs font-bold text-gain">Could save about {fmt(tip.save)} a month</p>}
      </div>
    </article>
  );
}
