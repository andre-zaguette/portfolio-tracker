export type Trade = {
  id: number;
  ticker: string;
  entryPrice: number | string;
  exitPrice: number | string;
  quantity: number;
  date: string;
  portfolioId: number;
  createdAt?: string;
};
