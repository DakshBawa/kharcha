export const CATS = [
  { id: "hostel", name: "Hostel & Rent", icon: "🏠", color: "#264653", fixed: true },
  { id: "mess", name: "Mess", icon: "🍛", color: "#e76f51", fixed: true },
  { id: "food", name: "Food & Snacks", icon: "🍜", color: "#e9a23b" },
  { id: "travel", name: "Travel", icon: "🚌", color: "#2a9d8f" },
  { id: "study", name: "Study", icon: "📚", color: "#3d5a80" },
  { id: "fun", name: "Fun", icon: "🎬", color: "#b5446e" },
  { id: "shopping", name: "Shopping", icon: "🛍️", color: "#8d6e63" },
  { id: "other", name: "Other", icon: "✨", color: "#6b705c" },
];
export const catOf = (id) => CATS.find((c) => c.id === id) || CATS[CATS.length - 1];
export const DEFAULT_BUDGETS = { hostel: 4500, mess: 3000, food: 2500, travel: 1500, study: 1000, fun: 1200, shopping: 800, other: 500 };
export const MODES = ["UPI", "Cash", "Card"];
