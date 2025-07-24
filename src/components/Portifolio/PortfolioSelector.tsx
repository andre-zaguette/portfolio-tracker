"use client";

import { Portfolio, usePortfolio } from "@/context/PortfolioContext";
import { getPortfolios } from "@/services/portfolioService";
import { formatUSD } from "@/utils/masks";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PortfolioSelector() {
  const { activePortfolio, setActivePortfolio } = usePortfolio();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  useEffect(() => {
    getPortfolios()
      .then(setPortfolios)
      .catch((err) => {
        console.error("Error loading portfolios:", err);
        toast.error("Failed to load portfolios");
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = Number(e.target.value);
    const selected = portfolios.find((p) => p.id === selectedId);
    if (selected) setActivePortfolio(selected);
  }

  if (portfolios.length === 0) {
    return <div className="italic">Loading portfolios...</div>;
  }

  return (
    <div className="ml-auto">
      <label className="block text-sm font-medium mb-1">Portfolio</label>
      <select
        className="bg-neutral-800 text-white border rounded px-3 py-2"
        value={activePortfolio?.id || ""}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select a portfolio
        </option>
        {portfolios.map((portfolio) => (
          <option key={portfolio.id} value={portfolio.id}>
            {portfolio.name} - {formatUSD(portfolio.initialValue)}
          </option>
        ))}
      </select>
    </div>
  );
}
