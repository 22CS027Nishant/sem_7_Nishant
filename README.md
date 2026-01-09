# sem_7_Nishant
# CryptoSim Pro

CryptoSim Pro is a cryptocurrency and stock trading simulation web application designed to provide users with a risk-free environment to practice trading strategies. The application features real-time data integration, virtual portfolio management, user authentication, and a global leaderboard.

## Features

- **Real-time Cryptocurrency Data**: Integrates with CoinGecko API for live market data.
- **Simulated Stock Trading**: Allows users to trade stocks with mock price fluctuations.
- **Virtual Portfolio Management**: Users can manage their portfolios, track performance, and execute buy/sell orders.
- **User Authentication**: Secure login and registration system using Supabase.
- **Global Leaderboard**: Ranks users based on portfolio performance.
- **Interactive Trading Dashboard**: Multiple views for trading, portfolio management, and market analysis.

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Supabase
- **API Integration**: CoinGecko API

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Supabase account

### Installation

1. Navigate to the client directory and install dependencies:
   ```
   cd cryptosim-pro/client
   npm install
   ```

2. Navigate to the server directory and install dependencies:
   ```
   cd ../server
   npm install
   ```

3. Set up your environment variables in the `.env` file.

4. Start the client and server:
   ```
   cd cryptosim-pro/client
   npm start
   ```
   ```
   cd ../server
   npm start
   ```

## Usage

- Users can register and log in to access their virtual portfolios.
- The trading interface allows users to select assets and execute trades.
- Users can view their portfolio performance and trade history.
- The leaderboard displays the top-performing users.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
