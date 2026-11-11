/* Demo data for this month and last month. Clear it from the footer to start fresh. */
const rng = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export function seedData() {
  const r = rng(42), now = new Date(), out = [];
  let id = 1;
  const pick = (a) => a[Math.floor(r() * a.length)];
  const rs = (lo, span) => Math.round((lo + r() * span) / 10) * 10;
  const add = (date, cat, amount, note, type = "expense", mode = "UPI") => out.push({ id: id++, date, cat, amount, note, mode, type });

  [-1, 0].forEach((off) => {
    const y = new Date(now.getFullYear(), now.getMonth() + off, 1).getFullYear(), m = new Date(now.getFullYear(), now.getMonth() + off, 1).getMonth();
    const last = off === 0 ? now.getDate() : new Date(y, m + 1, 0).getDate();
    add(iso(y, m, 1), "other", 12000, "Pocket money", "income");
    if (last >= 9) add(iso(y, m, 9), "other", 1500, "Tutoring", "income");
    add(iso(y, m, 1), "hostel", 4500, "Hostel rent");
    add(iso(y, m, 1), "mess", 3000, "Mess fee");
    if (last >= 5) { add(iso(y, m, 5), "fun", 59, "Spotify student"); add(iso(y, m, 5), "fun", 150, "Netflix share"); }
    for (let d = 1; d <= last; d++) {
      const wd = new Date(y, m, d).getDay(), weekend = wd === 0 || wd === 6, date = iso(y, m, d);
      if (r() < 0.8) add(date, "food", rs(40, 90), pick(["Canteen lunch", "Chai & samosa", "Maggi", "Fresh juice"]), "expense", "Cash");
      if (weekend && r() < 0.6) add(date, "food", rs(180, 220), pick(["Cafe with friends", "Pizza night", "Biryani"]));
      if (r() < 0.6) add(date, "travel", rs(20, 80), pick(["Auto", "City bus", "Metro"]));
      if (r() < 0.12) add(date, "travel", rs(160, 150), "Cab to station");
      if (r() < 0.25) add(date, "study", rs(20, 80), pick(["Printouts", "Stationery", "Xerox"]), "expense", "Cash");
      if (r() < 0.04) add(date, "study", rs(300, 400), "Reference book");
      if (weekend && r() < 0.35) add(date, "fun", rs(150, 300), pick(["Movie", "Gaming cafe", "Bowling"]));
      if (r() < 0.05) add(date, "shopping", rs(200, 600), pick(["T-shirt", "Phone cover", "Shoes"]), "expense", "Card");
    }
  });
  return out;
}
