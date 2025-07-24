"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createPortfolio } from "@/services/portfolioService";
import { useState } from "react";
import { toast } from "sonner";
import Input from "../ui/Input";

export default function PortfolioFormModal({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [initialValue, setInitialValue] = useState<number>(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createPortfolio(name, initialValue);
      toast.success("Portfolio created successfully");
      onCreated?.();
      setOpen(false);
      setName("");
      setInitialValue(0);
    } catch (error: any) {
      console.error("Create portfolio error:", error);
      toast.error("Failed to create portfolio");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ New Portfolio</Button>
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 text-white rounded-xl shadow-xl">
        <DialogHeader>Create New Portfolio</DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Portfolio Name"
            type="text"
            placeholder="My Portfolio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Initial Value"
            type="number"
            placeholder="0.00"
            min={0}
            value={initialValue}
            onChange={(e) => setInitialValue(Number(e.target.value))}
            required
          />
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
