# Stock Portfolio Tracker 📈

A modern web-based stock portfolio tracker for managing investments by multiple owners.

## Features

- **Multi-Owner Support**: Track stocks for Tjark and Matthias separately
- **Real-time Prices**: Integration with Polygon API for live stock prices
- **Category Classification**: Organize stocks by Value or Growth investing style
- **Sector Analysis**: Group investments by industry sectors
- **Interactive Charts**: Visualize portfolio distribution and performance
- **Historical Tracking**: Track portfolio value over time (up to 90 days)
- **Responsive Design**: Works on desktop and mobile devices

## Charts Available

- Portfolio Value by Owner (Doughnut)
- Portfolio Value by Category (Doughnut)
- Portfolio Value by Sector (Doughnut)
- Gain/Loss by Category (Bar)
- Portfolio Performance Over Time (Line)
- Individual Sector Distribution per Owner

## Setup

1. Clone this repository
2. Open `index.html` in your browser
3. Your data is stored locally in the browser's localStorage

## API Configuration

The app uses the Polygon.io API for live stock prices. The API key is configured in `app.js`.

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `app.js` - Application logic, API integration, and charts

## Technologies

- HTML5 / CSS3 / JavaScript (ES6+)
- Chart.js for data visualization
- Polygon.io API for stock data
- localStorage for data persistence

## License

Private project for personal use.
