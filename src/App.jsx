import { useEffect, useMemo, useRef, useState } from "react";
import Masthead from "./components/Masthead.jsx";
import ReceiptDialog from "./components/ReceiptDialog.jsx";
import BudgetDialog from "./components/BudgetDialog.jsx";
import Overview from "./pages/Overview.jsx";
import Transactions from "./pages/Transactions.jsx";
import Budgets from "./pages/Budgets.jsx";
import Insights from "./pages/Insights.jsx";
import usePersistentState from "./hooks/usePersistentState.js";
import { seedData } from "./data/seed.js";
import { DEFAULT_BUDGETS } from "./data/categories.js";
import { summarize } from "./utils/stats.js";
import { buildTips } from "./utils/insights.js";
import { fmt } from "./utils/money.js";

export default function App() {
  const [page, setPage] = useState("overview");
  const [txs, setTxs] = usePersistentState("kharcha.txs", seedData);
  const [budgets, setBudgets] = usePersistentState("kharcha.budgets", DEFAULT_BUDGETS);
  const [goal, setGoal] = usePersistentState("kharcha.goal", { name: "New laptop", target: 40000, saved: 6500 });
  const [ref, setRef] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [adding, setAdding] = useState(false);
  const [settingBudget, setSettingBudget] = useState(false);
  const [msg, setMsg] = useState("");
  const timer = useRef();

  const toast = (t) => { setMsg(t); clearTimeout(timer.current); timer.current = setTimeout(() => setMsg(""), 3000); };
  useEffect(() => () => clearTimeout(timer.current), []);

  const S = useMemo(() => summarize(txs, ref, budgets), [txs, ref, budgets]);
  const prev = useMemo(() => summarize(txs, new Date(ref.getFullYear(), ref.getMonth() - 1, 1), budgets), [txs, ref, budgets]);
  const tips = useMemo(() => buildTips(S, prev), [S, prev]);
  const recent = [...S.m].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 6);
  const isNow = ref.getMonth() === new Date().getMonth() && ref.getFullYear() === new Date().getFullYear();
  const shift = (n) => setRef(new Date(ref.getFullYear(), ref.getMonth() + n, 1));

  const save = (t) => { setTxs((x) => [t, ...x]); setAdding(false); toast(`${t.type === "income" ? "Added" : "Logged"} ${fmt(t.amount)}`); };
  const reset = () => { if (window.confirm("Remove all entries and start fresh?")) { setTxs([]); toast("All entries cleared"); } };

  return (
    <div className="min-h-screen">
      <Masthead
        page={page}
        setPage={setPage}
        onAdd={() => setAdding(true)}
        onOpenBudget={() => setSettingBudget(true)}
      />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:px-8">
        <div className="mb-6 flex items-center justify-center gap-4">
          <button className="btn-line !px-3 !py-1" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
          <h2 className="min-w-44 text-center font-serif text-2xl">{ref.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</h2>
          <button className="btn-line !px-3 !py-1" onClick={() => shift(1)} disabled={isNow} aria-label="Next month">›</button>
        </div>
        {page === "overview" && (
          <Overview
            S={S}
            tips={tips}
            recent={recent}
            setPage={setPage}
            onOpenBudget={() => setSettingBudget(true)}
          />
        )}
        {page === "transactions" && (
          <Transactions
            S={S}
            onDelete={(id) => { setTxs((x) => x.filter((t) => t.id !== id)); toast("Entry deleted"); }}
          />
        )}
        {page === "budgets" && (
          <Budgets
            S={S}
            prev={prev}
            budgets={budgets}
            setBudgets={setBudgets}
            toast={toast}
            onOpenBudget={() => setSettingBudget(true)}
          />
        )}
        {page === "insights" && (
          <Insights
            S={S}
            tips={tips}
            goal={goal}
            setGoal={setGoal}
            toast={toast}
          />
        )}
        <footer className="mt-16 border-t border-ink/15 pt-4 text-center text-xs text-ink/45">
          Saved on this device only. <button className="underline underline-offset-2" onClick={reset}>Clear all entries</button>
        </footer>
      </main>
      {adding && <ReceiptDialog onSave={save} onClose={() => setAdding(false)} />}
      {settingBudget && (
        <BudgetDialog
          budgets={budgets}
          setBudgets={setBudgets}
          onClose={() => setSettingBudget(false)}
          toast={toast}
        />
      )}
      {msg && (
        <div role="status" className="slide-up fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper shadow-2xl">
          {msg}
        </div>
      )}
    </div>
  );
}
