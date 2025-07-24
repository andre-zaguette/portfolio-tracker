export const formatUSD = (value: string | number) => {
  const number =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.-]+/g, ""))
      : value;
  if (isNaN(number)) return "";
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
};

export const parseUSD = (value: string) => {
  return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
};
