"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePortfolio } from "@/context/PortfolioContext";
import { saveTrade } from "@/services/tradeService";
import { Trade } from "@/types/trade";
import { useEffect, useReducer, useRef, useState } from "react";
import Input from "../ui/Input";

type Props = {
  onCreated?: () => void;
  onUpdated?: () => void;
  onTradeChanged?: () => void;
  tradeToEdit: Trade | null;

  openProp?: boolean;
  onOpenChangeProp?: (open: boolean) => void;
};

type FormState = {
  ticker: string;
  entryPrice: string;
  exitPrice: string;
  quantity: number;
  date: string;
};

const initialState: FormState = {
  ticker: "",
  entryPrice: "",
  exitPrice: "",
  quantity: 1,
  date: "",
};

function reducer(state: FormState, action: Partial<FormState>) {
  return { ...state, ...action };
}

export default function TradeFormModal({
  onCreated,
  onUpdated,
  onTradeChanged,
  tradeToEdit,
  openProp,
  onOpenChangeProp,
}: Props) {
  const { activePortfolio } = usePortfolio();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useReducer(reducer, initialState);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (tradeToEdit && !hasOpenedRef.current) {
      setForm({
        ticker: tradeToEdit.ticker || "",
        entryPrice: tradeToEdit.entryPrice?.toString() || "",
        exitPrice: tradeToEdit.exitPrice?.toString() || "",
        quantity: tradeToEdit.quantity || 1,
        date: tradeToEdit.date,
      });
      setOpen(true);
      hasOpenedRef.current = true;
    }
    if (!tradeToEdit) {
      resetForm();
    }
  }, [tradeToEdit]);

  useEffect(() => {
    if (typeof openProp === "boolean") setOpen(openProp);
  }, [openProp]);

  function resetForm() {
    setForm(initialState);
    hasOpenedRef.current = false;
  }

  function handleClose() {
    setOpen(false);
    resetForm();
    onOpenChangeProp?.(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activePortfolio && !tradeToEdit) return;

    const portfolioId = activePortfolio?.id ?? tradeToEdit?.portfolioId;

    if (!portfolioId) return;

    const body = {
      ...form,
      entryPrice: parseFloat(form.entryPrice) || 0,
      exitPrice: parseFloat(form.exitPrice) || 0,
      quantity: Number(form.quantity),
      portfolioId,
    };

    try {
      await saveTrade(body, tradeToEdit?.id);
      handleClose();
      tradeToEdit ? onUpdated?.() : onCreated?.();
      onTradeChanged?.();
    } catch (error: any) {
      console.error(error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        onOpenChangeProp?.(v);
      }}
    >
      {!tradeToEdit && (
        <DialogTrigger asChild>
          <Button variant="default" disabled={!activePortfolio}>
            + New Trade
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="bg-neutral-900 text-white rounded-xl shadow-xl">
        <DialogHeader>
          {tradeToEdit ? "Edit Trade" : "Create New Trade"}
        </DialogHeader>

        {!activePortfolio && !tradeToEdit ? (
          <div className="text-red-500">Select a portfolio first.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Ticker"
              type="text"
              value={form.ticker}
              onChange={(e) => setForm({ ticker: e.target.value })}
              required
            />
            <Input
              label="Entry"
              type="number"
              step="any"
              min={0}
              placeholder="0.00"
              value={form.entryPrice}
              onChange={(e) => setForm({ entryPrice: e.target.value })}
              required
            />
            <Input
              label="Exit"
              type="number"
              step="any"
              min={0}
              placeholder="0.00"
              value={form.exitPrice}
              onChange={(e) => setForm({ exitPrice: e.target.value })}
              required
            />
            <Input
              label="Quantity"
              type="number"
              min={1}
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => setForm({ quantity: Number(e.target.value) })}
              required
            />
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ date: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
              required
            />

            <DialogFooter>
              <Button type="submit">{tradeToEdit ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
