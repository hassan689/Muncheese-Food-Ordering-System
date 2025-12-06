# Muncheese Frontend

Frontend application for Muncheese Food Ordering System built with React and Vite.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory:
```
VITE_API_BASE_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components
│   │   ├── admin/   # Admin components
│   │   ├── common/  # Common components (Navbar, Footer)
│   │   ├── landing/ # Landing components (Navbar, Footer)
│   │   └── ui/      # UI components (Button, Input, Card)
│   ├── pages/       # Page components
│   │   └── admin/   # Admin pages
│   ├── styles/      # CSS styles
│   │   └── admin/   # Admin pages styles
│   ├── services/    # API services
│   ├── hooks/       # Custom React hooks
│   ├── context/     # React Context providers
│   ├── utils/       # Utility functions
│   ├── layouts/     # Layout components
│   ├── App.jsx      # Main App component
│   └── main.jsx     # Entry point
├── package.json
└── vite.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- User registration and authentication
- Customer dashboard
- Admin dashboard
- Order management (to be implemented)
- Responsive design

## Tech Stack

- React 18
- React Router DOM
- Axios
- Vite
- CSS3

