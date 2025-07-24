"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Portfolio = {
  id: number;
  name: string;
  initialValue: number;
  createdAt: string;
};

type PortfolioContextType = {
  activePortfolio: Portfolio | null;
  setActivePortfolio: (portfolio: Portfolio) => void;
};

const PortfolioContext = createContext<PortfolioContextType>({
  activePortfolio: null,
  setActivePortfolio: () => {},
});

export function usePortfolio() {
  return useContext(PortfolioContext);
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [activePortfolio, setActivePortfolioState] = useState<Portfolio | null>(
    null
  );

  function setActivePortfolio(portfolio: Portfolio) {
    localStorage.setItem("selectedPortfolio", JSON.stringify(portfolio));
    setActivePortfolioState(portfolio);
  }

  useEffect(() => {
    const stored = localStorage.getItem("selectedPortfolio");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setActivePortfolioState(parsed);
      } catch (err) {
        console.error("Erro ao carregar portfolio do localStorage:", err);
      }
    }
  }, []);

  return (
    <PortfolioContext.Provider value={{ activePortfolio, setActivePortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
}
