"use client";

import HeaderExchanges from "@/components/HeaderExchanges";
import PNLChart from "@/components/PNLChart";
import PortfolioFormModal from "@/components/Portifolio/PortfolioFormModal";
import PortfolioSelector from "@/components/Portifolio/PortfolioSelector";
import PortfolioSummary from "@/components/Portifolio/PortfolioSummary";
import Sidebar from "@/components/Sidebar";
import TradeFormModal from "@/components/Trade/TradeFormModal";
import TradeList from "@/components/Trade/TradeList";
import { useState } from "react";

export default function HomePage() {
  const [portfolioRefresh, setPortfolioRefresh] = useState(0);
  const [tradeRefresh, setTradeRefresh] = useState(0);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="w-64 border rounded-xl m-4 flex-shrink-0">
        <Sidebar refresh={portfolioRefresh} />
      </div>

      <div className="flex-1 flex flex-col m-4 border rounded-xl p-6 bg-neutral-900">
        <HeaderExchanges />

        <div className="flex items-center gap-4 mb-6">
          <TradeFormModal
            onCreated={() => setTradeRefresh((r) => r + 1)}
            tradeToEdit={null}
          />
          <PortfolioFormModal
            onCreated={() => setPortfolioRefresh((r) => r + 1)}
          />
          <PortfolioSelector />
        </div>

        <TradeList
          refresh={tradeRefresh}
          onTradeChanged={() => setTradeRefresh((r) => r + 1)}
        />

        <PNLChart refresh={tradeRefresh} />

        <PortfolioSummary refresh={tradeRefresh} />
      </div>
    </div>
  );
}
