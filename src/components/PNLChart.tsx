"use client";
import { usePortfolio } from "@/context/PortfolioContext";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Trade = {
  id: number;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: string;
};

export default function PNLChart({ refresh }: { refresh?: number }) {
  const { activePortfolio } = usePortfolio();
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!activePortfolio) {
      setTrades([]);
      return;
    }
    fetch(`/api/trade?portfolioId=${activePortfolio.id}`)
      .then((res) => res.json())
      .then((data) => setTrades(data));
  }, [activePortfolio, refresh]);

  const pnlByDate: { date: string; pnl: number }[] = [];
  let cumulative = 0;
  [...trades]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((trade) => {
      cumulative += (trade.exitPrice - trade.entryPrice) * trade.quantity;
      pnlByDate.push({
        date: new Date(trade.date).toLocaleDateString(),
        pnl: cumulative,
      });
    });

  if (!activePortfolio || trades.length === 0) {
    return <div className="italic text-gray-500">No PnL data to display.</div>;
  }

  return (
    <div className="w-full h-64 mt-8 mb-6">
      <h3 className="font-semibold mb-2">Cumulative PnL Chart</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={pnlByDate}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="pnl"
            stroke="#4ade80"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
