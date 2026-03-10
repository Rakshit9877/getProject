# ProjectBuildr — Student Project Development Service

A full-stack MERN application for a student project development service. Students can order custom project builds, pay via Razorpay, and receive delivery through GitHub collaboration.

## Tech Stack

- **Frontend:** React (Vite), React Router v6, Tailwind CSS, Axios
- **Backend:** Node.js, Express, Mongoose, JWT
- **Payment:** Razorpay (test mode)
- **Database:** MongoDB Atlas
- **Email:** Nodemailer (Gmail SMTP)

## Project Structure

```
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       └── index.css       # Tailwind CSS
├── server/                 # Express backend
│   ├── config/             # Pricing configuration
│   ├── middleware/          # JWT auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── services/           # Email service
├── .env.example            # Environment variables template
└── README.md
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd new_project
```

### 2. Configure environment variables

Copy `.env.example` to `.env` at the project root and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random secret for JWT signing |
| `RAZORPAY_KEY_ID` | Razorpay test Key ID (from Dashboard → API Keys) |
| `RAZORPAY_KEY_SECRET` | Razorpay test Key Secret |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail App Password (not your regular password) |
| `ADMIN_EMAIL` | Email to receive admin notifications |
| `ADMIN_PASSWORD` | Password for the admin dashboard |
| `GITHUB_USERNAME` | Your GitHub username (displayed to customers) |
| `CLIENT_URL` | Frontend URL (default: `http://localhost:5173`) |

### 3. Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free cluster
2. Create a database user with read/write access
3. Whitelist your IP (or allow access from anywhere: `0.0.0.0/0`)
4. Copy the connection string and paste into `MONGODB_URI` in `.env`

### 4. Set up Razorpay (Test Mode)

1. Sign up at [Razorpay](https://dashboard.razorpay.com/signup)
2. Toggle to **Test Mode** in the dashboard
3. Go to **Settings → API Keys → Generate Test Key**
4. Copy the Key ID and Key Secret into `.env`
5. Test card number: `4111 1111 1111 1111`, any future expiry, any CVV

### 5. Set up Gmail App Password

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Copy the 16-character password into `EMAIL_PASS` in `.env`

### 6. Install dependencies

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 7. Run the development servers

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

The Vite dev server proxies `/api` requests to the backend automatically.

## API Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders/initiate` | Save partial order before payment | — |
| POST | `/api/payment/create-order` | Create Razorpay order | — |
| POST | `/api/payment/verify` | Verify payment & finalize order | — |
| GET | `/api/config` | Get pricing & GitHub username | — |
| POST | `/api/admin/login` | Admin login (returns JWT) | — |
| GET | `/api/admin/orders` | List all orders | Admin |
| GET | `/api/admin/orders/:id` | Get single order | Admin |
| PATCH | `/api/admin/orders/:id/status` | Update order status | Admin |

## Features

- 🏠 Landing page with pricing, FAQ, and year-level cards
- 📝 Multi-step order form with validation and progress indicator
- 💳 Razorpay payment integration (test mode)
- 📧 Automated email notifications (order confirmation, status updates)
- 🔐 Admin dashboard with order management and status updates
- 📱 Fully responsive design (mobile + desktop)
- 🌙 Dark theme with navy + indigo accent

## Pricing Configuration

Edit `server/config/pricing.js` to change prices:

```js
const pricing = {
  Basic: 499,
  Standard: 999,
  Advanced: 1799,
};
```
