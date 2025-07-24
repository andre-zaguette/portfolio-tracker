import { Trade } from "@/types/trade";
import { toast } from "sonner";

export async function saveTrade(trade: Partial<Trade>, id?: number) {
  try {
    const response = await fetch(`/api/trade${id ? `/${id}` : ""}`, {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trade),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    toast.success(`Trade ${id ? "updated" : "created"} successfully!`);
    return await response.json();
  } catch (error: any) {
    toast.error(
      `Failed to ${id ? "update" : "create"} trade: ${error.message}`
    );
    throw error;
  }
}

export async function deleteTrade(id: number) {
  try {
    const response = await fetch(`/api/trade/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    toast.success("Deleted with success");
  } catch (error: any) {
    toast.error("Failed to delete trade");
    throw error;
  }
}

export async function fetchTradesByPortfolio(portfolioId: number) {
  try {
    const response = await fetch(`/api/trade?portfolioId=${portfolioId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch trades");
    }

    return await response.json();
  } catch (error) {
    toast.error("Failed to load trades");
    throw error;
  }
}
