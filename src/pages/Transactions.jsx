import { useState } from "react";
import TxList from "../components/TxList.jsx";
import { CATS } from "../data/categories.js";
import { fmt } from "../utils/money.js";

export default function Transactions({ S, onDelete }) {
  const [q, setQ] = useState(""), [cat, setCat] = useState(""), [type, setType] = useState("");
  const list = S.m.filter((t) => (!q || `${t.note} ${t.mode}`.toLowerCase().includes(q.toLowerCase())) && (!cat || t.cat === cat) && (!type || t.type === type));
  return (
    <div>
      <h2 className="font-serif text-5xl">Every entry</h2>
      <p className="mb-6 mt-1 text-ink/60">{list.length} entries · {fmt(list.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0))} spent</p>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <input className="field" placeholder="Search notes" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <select className="field" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category"><option value="">All categories</option>{CATS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select className="field" value={type} onChange={(e) => setType(e.target.value)} aria-label="Type"><option value="">Spending and income</option><option value="expense">Spending only</option><option value="income">Income only</option></select>
      </div>
      <TxList txs={list} onDelete={onDelete} empty="No entries match." />
    </div>
  );
}
