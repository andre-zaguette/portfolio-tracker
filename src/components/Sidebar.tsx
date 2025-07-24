"use client";
import { usePortfolio } from "@/context/PortfolioContext";
import { useEffect, useState } from "react";

type Props = { refresh?: number };

type Portfolio = {
  id: number;
  name: string;
  initialValue: number;
  createdAt: string;
};

export default function Sidebar({ refresh }: Props) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const { activePortfolio, setActivePortfolio } = usePortfolio();

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => {
        if (!res.ok) throw new Error("API error: " + res.status);
        return res.json();
      })
      .then((data) => setPortfolios(Array.isArray(data) ? data : []))
      .catch((err) => {
        setPortfolios([]);
        console.error("Failed to fetch portfolios:", err);
      });
  }, [refresh]);

  return (
    <aside className="w-64 h-full p-4 border rounded-xl mr-4 bg-neutral-950">
      <div className="font-bold mb-2">Portfolios</div>
      <div className="space-y-2">
        {portfolios.map((portfolio) => (
          <button
            key={portfolio.id}
            className={`block w-full text-left px-3 py-2 rounded 
              ${
                activePortfolio?.id === portfolio.id
                  ? "bg-neutral-800 font-bold"
                  : "hover:bg-neutral-900"
              }
            `}
            onClick={() => setActivePortfolio(portfolio)}
          >
            {portfolio.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
