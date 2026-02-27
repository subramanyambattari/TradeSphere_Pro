# TradeSphere Pro

TradeSphere Pro is a full-stack stock trading dashboard web app where users can sign up, log in, search live stock prices, place buy/sell entries, manage a watchlist, view transaction insights, and export reports.

## Live Deployment

- Frontend (Vercel): `https://trade-sphere-pro.vercel.app`
- Backend (Render): `https://tradesphere-pro.onrender.com`

## Features

- Authentication (Signup / Login)
- Forgot Password and Reset Password
- Protected routes
- Stock search with live quote data
- Buy/Sell trade entry
- Transactions stored in MongoDB
- Watchlist (add/remove symbols)
- Insights (trade metrics)
- Market snapshot (popular symbols)
- Reports with CSV export
- Light/Dark theme toggle

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs

## Project Structure

```bash
TradeSphere-Pro/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    ├── vercel.json
    └── package.json

## Contact

- Name: Subramanyam Battari
- Email: subramanyambattari@gmail.com
