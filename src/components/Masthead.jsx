const TABS = [["overview", "Overview"], ["transactions", "Transactions"], ["budgets", "Budgets"], ["insights", "Savings ideas"]];

export default function Masthead({ page, setPage, onAdd, onOpenBudget }) {
  const d = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <header className="border-b-[3px] border-double border-ink">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="flex items-center justify-between border-b border-ink/15 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">
          <span>{d}</span><span className="hidden sm:inline">All figures in Indian rupees</span>
        </div>
        <div className="py-5 text-center">
          <h1 className="font-serif text-6xl leading-none tracking-tight md:text-8xl">Kharcha</h1>
          <p className="mt-2 font-serif text-lg italic text-ink/60 md:text-xl">The student money ledger</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 py-3">
          <nav className="flex flex-wrap gap-x-6 gap-y-1" aria-label="Main">
            {TABS.map(([id, l]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPage(id)}
                aria-current={page === id ? "page" : undefined}
                className={`pb-1 text-sm font-semibold transition ${page === id ? "border-b-2 border-ink text-ink" : "border-b-2 border-transparent text-ink/55 hover:text-ink"}`}
              >
                {l}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-line"
              onClick={onOpenBudget}
              title="Set or adjust monthly budget"
            >
              ✎ Set budget
            </button>
            <button
              type="button"
              className="btn"
              onClick={onAdd}
            >
              ＋ Add entry
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
