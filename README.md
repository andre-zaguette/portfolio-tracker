# 💸 Financial Portfolio Tracker

A simple full-stack web application to track stock portfolios and calculate cumulative Profit and Loss (PnL) over time.

Built using **Next.js (App Router)**, **React**, **TailwindCSS**, **ShadCN UI**, **PostgreSQL**, and **Drizzle ORM**.

---

## 🧱 Features

- Create and manage multiple portfolios
- Add, edit, and delete trades (ticker, price, quantity, date)
- Switch between portfolios
- Calculate cumulative PnL
- Responsive dashboard UI
- Toast notifications on actions
- Clean modular service architecture

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/andre-zaguette/portfolio-tracker.git
cd portfolio-tracker
```

### 2. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_db
```

---

### 3. Start PostgreSQL with Docker

```bash
docker run --name portfolio-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=portfolio_db -p 5432:5432 -d postgres
```

> You can also use Docker Compose if preferred.

```bash
docker compose up -d
```

---

### 4. Install dependencies

```bash
npm install
```

---

### 5. Apply Drizzle migrations

```bash
npm run generate:migrations
npm run migrate
```

_Or manually using the CLI:_

```bash
npx drizzle-kit push:pg
```

---

### 6. Start the app

```bash
npm run dev
```

> App will be available at: http://localhost:3000

---

## 🧪 Example CURL Commands

### ✅ Create a Portfolio

```bash
curl -X POST http://localhost:3000/api/portfolio \
  -H "Content-Type: application/json" \
  -d '{"name": "Tech Portfolio", "initialValue": 50000}'
```

### 📈 Create a Trade

```bash
curl -X POST http://localhost:3000/api/trade \
  -H "Content-Type: application/json" \
  -d '{
    "portfolioId": 1,
    "ticker": "AAPL",
    "entryPrice": 150,
    "exitPrice": 160,
    "quantity": 10,
    "date": "2024-01-01"
  }'
```

### 🧾 Get Portfolios

```bash
curl http://localhost:3000/api/portfolio
```

---

## 🏗️ Architecture Overview

- **Frontend**: Built with Next.js App Router, TailwindCSS and ShadCN components for consistent UI.
- **State Management**: Local state and `useContext` used to manage the active portfolio.
- **Backend**: Routes under `/api/` handle all data operations via Drizzle.
- **Services**: API calls are wrapped in service modules for better abstraction and reuse.
- **Database**: PostgreSQL schema managed with Drizzle ORM.

---

## 📊 Bonus Features

- Modular file structure
- Type safety with TypeScript
- Trade editing and deletion with confirmation

---

## 📝 License

MIT — feel free to use and adapt!
