export function difficultyClass(difficulty) {
  if (difficulty === "Easy") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (difficulty === "Hard") return "border-red-400/30 bg-red-400/10 text-red-200";
  return "border-yellow-400/30 bg-yellow-400/10 text-yellow-100";
}
