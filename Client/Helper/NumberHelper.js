export function addDotsToNumber(number) {
  if (number.toString() === "0") return "0";
  if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
