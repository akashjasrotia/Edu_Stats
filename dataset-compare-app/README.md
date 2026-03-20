# Dataset Compare App

## Overview
The Dataset Compare App is a web application that allows users to compare two different data sets visually. It consists of a client-side application built with React and a server-side application using Express. The app fetches data from the server based on a provided ID and displays the comparison in a user-friendly format.

## Project Structure
```
dataset-compare-app
├── client
│   ├── index.html          # Main HTML entry point for the client application
│   ├── package.json        # Client-side application configuration
│   ├── vite.config.js      # Vite configuration for the client application
│   └── src
│       ├── main.jsx        # Entry point for the React application
│       ├── App.jsx         # Main App component with routing
│       ├── pages
│       │   └── ComparePage.jsx  # Component for comparing two data sets
│       ├── components
│       │   └── CompareView.jsx   # Component for visual comparison of data sets
│       └── styles
│           └── index.css   # Global styles for the client application
├── server
│   ├── package.json        # Server-side application configuration
│   ├── .env.example        # Example environment variables for the server
│   └── src
│       ├── index.js        # Entry point for the server application
│       ├── routes
│       │   └── data.js     # Routes for data fetching
│       └── controllers
│           └── dataController.js  # Logic for fetching data based on ID
├── package.json             # Overall project configuration
└── README.md                # Documentation for the project
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd dataset-compare-app
   ```

2. Install dependencies for the client:
   ```
   cd client
   npm install
   ```

3. Install dependencies for the server:
   ```
   cd ../server
   npm install
   ```

4. Create a `.env` file in the `server` directory based on the `.env.example` file and fill in the required values.

### Running the Application
1. Start the server:
   ```
   cd server
   npm start
   ```

2. In a new terminal, start the client:
   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage
- Use the ComparePage to input the IDs of the data sets you want to compare.
- The CompareView component will display the visual comparison of the two data sets.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License
This project is licensed under the MIT License.