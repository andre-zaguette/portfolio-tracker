"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { fetchTradesByPortfolio } from "@/services/tradeService";
import { Trade } from "@/types/trade";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PortfolioSummary({ refresh }: { refresh?: number }) {
  const { activePortfolio } = usePortfolio();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activePortfolio) {
      setTrades([]);
      return;
    }

    setLoading(true);
    fetchTradesByPortfolio(activePortfolio.id)
      .then(setTrades)
      .catch((err) => {
        console.error("Error loading trades:", err);
        toast.error("Failed to load portfolio summary");
      })
      .finally(() => setLoading(false));
  }, [activePortfolio, refresh]);

  if (!activePortfolio || trades.length === 0) {
    return (
      <div className="italic text-gray-500">No summary data available.</div>
    );
  }

  const invested = trades.reduce(
    (acc, t) => acc + Number(t.entryPrice) * Number(t.quantity),
    0
  );

  const currentValue = trades.reduce(
    (acc, t) => acc + Number(t.exitPrice) * Number(t.quantity),
    0
  );

  const pnl = currentValue - invested;

  return (
    <div className="bg-neutral-800 p-4 rounded-xl mt-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Portfolio Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-400">Invested</div>
          <div className="text-xl font-bold text-yellow-400">
            ${invested.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Current Value</div>
          <div className="text-xl font-bold text-blue-400">
            ${currentValue.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">PnL</div>
          <div
            className={`text-xl font-bold ${
              pnl >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            ${pnl.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
