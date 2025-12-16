# Quick Start Guide

Get the Magnificent 7 Dashboard running in 3 minutes!

## Prerequisites

- Node.js 18+ installed
- A free Polygon.io API key ([get one here](https://polygon.io/))

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API key
# VITE_MASSIVE_API_KEY=your_actual_api_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run format` | Format code with Prettier |

## What You'll See

- **7 Stock Cards**: Real-time data for AAPL, MSFT, GOOGL, AMZN, META, NVDA, TSLA
- **Market Overview**: Best/worst performers, average moves, sentiment
- **Interactive Chart**: 90-day price history with raw/indexed views

## Need Help?

- Check [README.md](./README.md) for full documentation
- See [SETUP.md](./SETUP.md) for implementation details
- Review error messages in the browser console

## Common Issues

**"API Key Required" message?**
- Ensure `.env` file exists in project root
- Verify `VITE_MASSIVE_API_KEY=` has your actual key
- Restart the dev server after adding `.env`

**Styles not loading?**
- Clear cache: `rm -rf node_modules/.vite`
- Restart dev server

**TypeScript errors?**
- Run `npm install` to ensure all types are installed
- Check that TypeScript version is ~5.9.3

---

Built with React + TypeScript + TailwindCSS + Vite
