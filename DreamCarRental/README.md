# DreamCar Rental - Premium Car Rental Platform

A modern, production-ready full-stack car rental application built with React, Node.js, Express, and MySQL.

![Design Preview](https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop)

## Features

- **Stunning Landing Page**: Glassmorphism UI, entrance animations, and responsive design.
- **Secure Authentication**: JWT-based login/register with password hashing and route protection.
- **Dynamic Dashboard**: Personalized welcome, quick statistics, and recommended vehicles.
- **Advanced Car Catalog**: Real-time filtering by price, type, and transmission.
- **Booking System**: Dynamic price calculation, availability validation, and pickup location selection.
- **Booking Management**: View history, check status, and cancel upcoming bookings.
- **User Profile**: Managed personal information and secure password updates.

## Tech Stack

- **Frontend**: React.js (functional components & hooks), Vite, Framer Motion (animations), Lucide React (icons), React Hot Toast.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL with Connection Pooling.
- **Security**: JWT (Authentication), Bcrypt (Password Hashing), CORS, Rate Limiting.

## Getting Started

### Prerequisites

- Node.js (v16+)
- MySQL Server

### Database Setup

1. Create a MySQL database named `car_rental`.
2. Import the schema:
   ```bash
   mysql -u root -p car_rental < database/schema.sql
   ```
3. (Optional) Seed the database with sample cars:
   ```bash
   mysql -u root -p car_rental < database/seed.sql
   ```

### Backend Installation

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=car_rental
   JWT_SECRET=your_super_secret_key
   PORT=5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Installation

1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

- **Frontend**: Can be deployed to Vercel or Netlify.
- **Backend**: Can be deployed to Heroku, Railway, or DigitalOcean.
- **Database**: Use PlanetScale or a managed MySQL instance from AWS/DigitalOcean.

## License

This project is licensed under the MIT License.
