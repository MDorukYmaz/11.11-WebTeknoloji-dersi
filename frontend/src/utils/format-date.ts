export const toIso = (date: string) => date.split("-").reverse().join("-");

export const fromIso = (date: string) => date.split("-").reverse().join("-");

export function formatDate(date: string) {
  return new Date(`${toIso(date)}T00:00`).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}
