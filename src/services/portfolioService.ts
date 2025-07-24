export async function getPortfolios() {
  const res = await fetch("/api/portfolio");

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to fetch portfolios");
  }

  return res.json();
}

export async function fetchTradesByPortfolio(portfolioId: number) {
  const res = await fetch(`/api/trade?portfolioId=${portfolioId}`);

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to fetch trades");
  }

  return res.json();
}

export async function createPortfolio(name: string, initialValue: number) {
  const res = await fetch("/api/portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, initialValue }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to create portfolio");
  }

  return res.json();
}
