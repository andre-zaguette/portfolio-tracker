"use client";
import { format, parseISO } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/context/PortfolioContext";
import { deleteTrade, fetchTradesByPortfolio } from "@/services/tradeService";
import { Trade } from "@/types/trade";
import TradeFormModal from "./TradeFormModal";

type Props = {
  refresh?: number;
  onTradeChanged?: () => void;
};

export default function TradeList({ onTradeChanged }: Props) {
  const { activePortfolio } = usePortfolio();

  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null);

  const loadTrades = useCallback(async () => {
    if (!activePortfolio) {
      setTrades([]);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchTradesByPortfolio(activePortfolio.id);
      setTrades(data);
    } catch (err) {
      console.error("Failed to load trades:", err);
      toast.error("Failed to load trades");
    } finally {
      setLoading(false);
    }
  }, [activePortfolio]);

  const handleDeleteTrade = async (tradeId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trade?"
    );
    if (!confirmDelete) return;

    try {
      await deleteTrade(tradeId);
      toast.success("Trade deleted");
      await loadTrades();
      onTradeChanged?.();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete trade");
    }
  };

  const calculateProfit = (trade: Trade): string => {
    const { quantity, entryPrice, exitPrice } = trade;
    return (
      Number(quantity) *
      (Number(exitPrice) - Number(entryPrice))
    ).toFixed(2);
  };

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  if (!activePortfolio) {
    return <div className="italic text-gray-500">No portfolio selected.</div>;
  }

  return (
    <div>
      <TradeFormModal
        tradeToEdit={tradeToEdit}
        onTradeChanged={async () => {
          await loadTrades();
          setTradeToEdit(null);
          onTradeChanged?.();
        }}
      />

      <h2 className="text-lg font-bold mb-2">Trades</h2>

      {loading ? (
        <div>Loading trades...</div>
      ) : trades.length === 0 ? (
        <div className="italic text-gray-500">
          No trades found for this portfolio.
        </div>
      ) : (
        <div className="space-y-2">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between border rounded-lg px-4 py-2 bg-neutral-800"
            >
              <span>{trade.ticker}</span>
              <span>Qty: {trade.quantity}</span>
              <span>Entry: ${trade.entryPrice}</span>
              <span>Exit: ${trade.exitPrice}</span>
              <span>
                Profit: <b>${calculateProfit(trade)}</b>
              </span>
              <span>
                Date:{" "}
                <span className="text-xs text-gray-400">
                  {trade.date
                    ? format(parseISO(trade.date), "dd/MM/yyyy")
                    : "N/A"}
                </span>
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setTradeToEdit(trade)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteTrade(trade.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
