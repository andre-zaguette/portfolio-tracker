import {
  date,
  doublePrecision,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  initialValue: doublePrecision("initial_value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id")
    .references(() => portfolios.id)
    .notNull(),
  ticker: varchar("ticker", { length: 16 }).notNull(),
  entryPrice: doublePrecision("entry_price").notNull(),
  exitPrice: doublePrecision("exit_price").notNull(),
  quantity: integer("quantity").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
