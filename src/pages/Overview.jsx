import PaceBar from "../components/PaceBar.jsx";
import DailyChart from "../components/DailyChart.jsx";
import CategoryBars from "../components/CategoryBars.jsx";
import TxList from "../components/TxList.jsx";
import TipCard from "../components/TipCard.jsx";
import { fmt } from "../utils/money.js";

const Figure = ({ label, value, note, tone = "", action = null }) => (
  <div className="px-4 py-5 text-center first:pl-0 last:pr-0">
    <p className="label">{label}</p>
    <p className={`mt-1 font-serif text-5xl leading-none md:text-7xl ${tone}`}>{value}</p>
    <p className="mt-2 text-xs text-ink/55">{note}</p>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default function Overview({ S, tips, recent, setPage, onOpenBudget }) {
  const diff = S.budget - S.projected;
  const headline = !S.isCur ? `You spent ${fmt(S.spent)} this month, ${S.spent > S.budget ? fmt(S.spent - S.budget) + " over" : fmt(S.budget - S.spent) + " under"} budget.`
    : S.elapsed < 3 ? "A fresh month. Log your first few expenses to see your pace."
    : diff >= 0 ? `At this pace you'll finish the month about ${fmt(diff)} under budget.` : `At this pace you'll overshoot your budget by about ${fmt(-diff)}.`;
  return (
    <div className="space-y-10">
      <section>
        <div className="grid grid-cols-1 divide-y divide-ink/15 border-y border-ink/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Figure
            label={S.left >= 0 ? "Left to spend" : "Over budget by"}
            value={fmt(Math.abs(S.left))}
            note={`of ${fmt(S.budget)} monthly budget`}
            tone={S.left < 0 ? "text-loss" : ""}
            action={
              <button
                type="button"
                onClick={onOpenBudget}
                className="inline-flex items-center gap-1 rounded-full border border-ink/25 px-2.5 py-0.5 text-xs font-semibold transition hover:border-ink hover:bg-ink/5"
              >
                ✎ Change budget
              </button>
            }
          />
          <Figure label="Spent so far" value={fmt(S.spent)} note={`${fmt(S.income)} came in this month`} />
          <Figure label={S.isCur ? "Safe to spend per day" : "Money saved"} value={S.isCur ? fmt(S.safePerDay) : fmt(Math.max(0, S.income - S.spent))} note={S.isCur ? `for the next ${S.daysLeft} days` : "income minus spending"} tone="text-gain" />
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center font-serif text-2xl italic leading-snug md:text-3xl">{headline}</p>
        <div className="mx-auto mt-6 max-w-2xl"><PaceBar S={S} /></div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
        <section><h2 className="mb-3 font-serif text-3xl">Day by day</h2><p className="mb-3 text-xs text-ink/55">Daily spending without hostel and mess fees.</p><DailyChart S={S} /></section>
        <section><h2 className="mb-4 font-serif text-3xl">Where it went</h2><CategoryBars S={S} /></section>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-end justify-between"><h2 className="font-serif text-3xl">Ways to save</h2><button className="text-sm font-semibold underline underline-offset-4" onClick={() => setPage("insights")}>All ideas</button></div>
          <div className="space-y-3">{tips.slice(0, 2).map((t) => <TipCard key={t.id} tip={t} />)}{tips.length === 0 && <p className="font-serif text-xl italic text-ink/45">Add more entries and ideas will appear here.</p>}</div>
        </section>
        <section>
          <div className="mb-3 flex items-end justify-between"><h2 className="font-serif text-3xl">Latest entries</h2><button className="text-sm font-semibold underline underline-offset-4" onClick={() => setPage("transactions")}>See all</button></div>
          <TxList txs={recent} empty="No entries this month." />
        </section>
      </div>
    </div>
  );
}
