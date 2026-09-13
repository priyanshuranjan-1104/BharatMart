// Indian number formatting: ₹1,29,999
export function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "₹0";
  const num = Number(amount);
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return formatter.format(num);
}

export function formatCount(n) {
  if (!n && n !== 0) return "0";
  if (n >= 100000) return (n / 100000).toFixed(1) + "L";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}
