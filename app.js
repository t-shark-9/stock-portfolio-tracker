// Stock Portfolio Tracker Application

// Yahoo Finance API Configuration (using CORS proxy for browser)
const YAHOO_PROXY = 'https://corsproxy.io/?';
const YAHOO_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/';

// WKN to Yahoo Finance Ticker mapping
// Format: US stocks = ticker, German stocks = ticker.DE, etc.
const WKN_TO_TICKER = {
    // Tjark's stocks
    'A4AFDY': '21XB.DE',       // 21Shares Bitcoin Core ETP
    'PG0Q56': 'WBIT.DE',       // WisdomTree Bitcoin
    'GJ860K': null,            // Derivative/Warrant - manual only
    'GV3XWF': null,            // Derivative/Warrant - manual only
    'A14Y6F': 'SHOP',          // Shopify
    'A0YJQ2': 'ISRG',          // Intuitive Surgical
    'A1KWPQ': 'V',             // Visa
    'A2T0VU': 'CRWD',          // CrowdStrike
    'A2AT0H': 'SNAP',          // Snap Inc
    '871970': 'TUI1.DE',       // TUI AG
    'A143D6': 'ETSY',          // Etsy
    'A3DQXS': 'SNOW',          // Snowflake
    'A3C4QT': 'PLTR',          // Palantir
    '602224': 'IPGP',          // IPG Photonics
    'A3C7R6': 'DDOG',          // Datadog
    'A12B6J': 'PYPL',          // PayPal
    '908063': 'NKE',           // Nike
    'A41FLM': 'IONQ',          // IonQ
    'A3EU6F': 'NET',           // Cloudflare
    'PAG911': 'P911.DE',       // Porsche AG Vz
    'A3C47B': 'SOFI',          // SoFi Technologies
    
    // Matthias's stocks
    'A0F5DE': 'AMA.DE',        // Altech Advanced Materials
    'A2JG9Z': 'MELI',          // MercadoLibre
    'A0M4W9': 'S2F.DE',        // Sandfire Resources
    '694482': 'HDB',           // HDFC Bank
    '851399': 'IBM',           // IBM
    '936793': 'IBN',           // ICICI Bank
    'A1H5UP': 'IQP4.DE',       // iShares MSCI Poland
    'A0YERL': 'LEA',           // Lear Corp
    'A14WK0': 'LITE',          // Lumentum
    'A0ETBQ': 'MBB.DE',        // MBB SE
    'A2N5NR': '22UA.DE',       // BioNTech
    'A0DLEV': 'BC8.DE',        // Bechtle
    'A4009U': '9880.HK',       // Ubtech Robotics (HK)
    'A2JNY1': '3CP.DE',        // Xiaomi (German ticker)
    'A2QBX7': 'XPEV',          // XPeng
    'DBX1DA': 'DBX1.DE',       // Xtrackers DAX
    'DBX0SV': 'DBXW.DE',       // Xtrackers MSCI World Swap
};

// Initial data from the CSV (pre-populated)
const initialStocks = [
    // Tjark's stocks
    { id: 1, owner: 'tjark', wkn: 'A4AfDY', name: '21Shares Bitcoin Core ETP', amount: 102.06, buyPrice: 31.65, currentPrice: 31.65, category: 'growth', sector: 'crypto' },
    { id: 2, owner: 'tjark', wkn: 'PG0Q56', name: 'WisdomTree Bitcoin', amount: 344, buyPrice: 0.29, currentPrice: 0.29, category: 'growth', sector: 'crypto' },
    { id: 3, owner: 'tjark', wkn: 'GJ860K', name: 'Warrant/Derivative', amount: 30, buyPrice: 1.63, currentPrice: 1.63, category: 'growth', sector: 'other' },
    { id: 4, owner: 'tjark', wkn: 'GV3XwF', name: 'Warrant/Derivative', amount: 235, buyPrice: 0.21, currentPrice: 0.21, category: 'growth', sector: 'other' },
    { id: 5, owner: 'tjark', wkn: 'A14Y6F', name: 'Shopify Inc.', amount: 3, buyPrice: 169.04, currentPrice: 169.04, category: 'value', sector: 'technology' },
    { id: 6, owner: 'tjark', wkn: 'A0YJQ2', name: 'Intuitive Surgical Inc.', amount: 3, buyPrice: 409.70, currentPrice: 409.70, category: 'growth', sector: 'technology' },
    { id: 7, owner: 'tjark', wkn: 'A1KWPQ', name: 'VISA Inc.', amount: 8, buyPrice: 55.41, currentPrice: 55.41, category: 'value', sector: 'finance' },
    { id: 8, owner: 'tjark', wkn: 'A2T0VU', name: 'CrowdStrike Holdings, Inc.', amount: 6, buyPrice: 54.20, currentPrice: 54.20, category: 'growth', sector: 'technology' },
    { id: 9, owner: 'tjark', wkn: 'A2AT0H', name: 'Snap Inc.', amount: 2, buyPrice: 18.00, currentPrice: 18.00, category: 'value', sector: 'consumer' },
    { id: 10, owner: 'tjark', wkn: '871970', name: 'TUI AG', amount: 30, buyPrice: 1.64, currentPrice: 1.64, category: 'value', sector: 'industrial' },
    { id: 11, owner: 'tjark', wkn: 'A143D6', name: 'Etsy, Inc.', amount: 1, buyPrice: 55.00, currentPrice: 55.00, category: 'growth', sector: 'technology' },
    { id: 12, owner: 'tjark', wkn: 'A3DQXS', name: 'Snowflake Inc.', amount: 1, buyPrice: 167.50, currentPrice: 167.50, category: 'growth', sector: 'technology' },
    { id: 13, owner: 'tjark', wkn: 'A3C4QT', name: 'Palantir Technologies Inc.', amount: 1, buyPrice: 40.20, currentPrice: 40.20, category: 'growth', sector: 'technology' },
    { id: 14, owner: 'tjark', wkn: '602224', name: 'IPG Photonics', amount: 1, buyPrice: 77.12, currentPrice: 77.12, category: 'value', sector: 'technology' },
    { id: 15, owner: 'tjark', wkn: 'A3C7R6', name: 'Datadog, Inc.', amount: 1, buyPrice: 46.85, currentPrice: 46.85, category: 'growth', sector: 'technology' },
    { id: 16, owner: 'tjark', wkn: 'A12B6J', name: 'PayPal Holdings, Inc.', amount: 1, buyPrice: 180.14, currentPrice: 180.14, category: 'growth', sector: 'finance' },
    { id: 17, owner: 'tjark', wkn: '908063', name: 'Nike, Inc.', amount: 6, buyPrice: 77.42, currentPrice: 77.42, category: 'value', sector: 'consumer' },
    { id: 18, owner: 'tjark', wkn: 'A41FLM', name: 'IonQ, Inc.', amount: 5, buyPrice: 9.35, currentPrice: 9.35, category: 'growth', sector: 'technology' },
    { id: 19, owner: 'tjark', wkn: 'A3EU6F', name: 'Cloudflare, Inc.', amount: 1, buyPrice: 53.19, currentPrice: 53.19, category: 'growth', sector: 'technology' },
    { id: 20, owner: 'tjark', wkn: 'PAG911', name: 'Porsche AG', amount: 1, buyPrice: 42.43, currentPrice: 42.43, category: 'value', sector: 'industrial' },
    { id: 21, owner: 'tjark', wkn: 'A3C47B', name: 'SoFi Technologies, Inc.', amount: 3, buyPrice: 13.36, currentPrice: 13.36, category: 'growth', sector: 'technology' },
    
    // Matthias's stocks
    { id: 22, owner: 'matthias', wkn: 'A0F5DE', name: 'Altech Advanced Materials', amount: 2, buyPrice: 119.80, currentPrice: 119.80, category: 'value', sector: 'materials' },
    { id: 23, owner: 'matthias', wkn: 'A2JG9Z', name: 'Mercado Libre, Inc.', amount: 4, buyPrice: 280.00, currentPrice: 280.00, category: 'growth', sector: 'technology' },
    { id: 24, owner: 'matthias', wkn: 'A0M4W9', name: 'Sandfire Resources', amount: 26, buyPrice: 9.71, currentPrice: 9.71, category: 'value', sector: 'materials' },
    { id: 25, owner: 'matthias', wkn: '694482', name: 'HDFC Bank', amount: 9, buyPrice: 28.60, currentPrice: 28.60, category: 'value', sector: 'finance' },
    { id: 26, owner: 'matthias', wkn: '851399', name: "IBM", amount: 4, buyPrice: 250.00, currentPrice: 250.00, category: 'value', sector: 'technology' },
    { id: 27, owner: 'matthias', wkn: '936793', name: 'ICICI Bank', amount: 10, buyPrice: 26.10, currentPrice: 26.10, category: 'value', sector: 'finance' },
    { id: 28, owner: 'matthias', wkn: 'A1H5UP', name: 'iShares MSCI Poland', amount: 8, buyPrice: 30.56, currentPrice: 30.56, category: 'growth', sector: 'etf' },
    { id: 29, owner: 'matthias', wkn: 'A0YERL', name: 'Lear Corp', amount: 3, buyPrice: 101.00, currentPrice: 101.00, category: 'value', sector: 'consumer' },
    { id: 30, owner: 'matthias', wkn: 'A14WK0', name: 'Lumentum', amount: 1, buyPrice: 374.30, currentPrice: 374.30, category: 'growth', sector: 'technology' },
    { id: 31, owner: 'matthias', wkn: 'A0ETBQ', name: 'MBB SE', amount: 10, buyPrice: 216.75, currentPrice: 216.75, category: 'growth', sector: 'industrial' },
    { id: 32, owner: 'matthias', wkn: 'A2N5NR', name: 'BioNTech SE', amount: 25, buyPrice: 10.08, currentPrice: 10.08, category: 'value', sector: 'healthcare' },
    { id: 33, owner: 'matthias', wkn: 'A0DLEV', name: 'Bechtle AG', amount: 11, buyPrice: 23.26, currentPrice: 23.26, category: 'value', sector: 'technology' },
    { id: 34, owner: 'matthias', wkn: 'A4009U', name: 'Ubtech Robotics', amount: 18, buyPrice: 14.70, currentPrice: 14.70, category: 'growth', sector: 'technology' },
    { id: 35, owner: 'matthias', wkn: 'A2JNY1', name: 'Xiaomi', amount: 67, buyPrice: 3.75, currentPrice: 3.75, category: 'growth', sector: 'technology' },
    { id: 36, owner: 'matthias', wkn: 'A2QBX7', name: 'XPeng', amount: 18, buyPrice: 14.25, currentPrice: 14.25, category: 'growth', sector: 'consumer' },
    { id: 37, owner: 'matthias', wkn: 'DBX1DA', name: 'Xtrackers DAX', amount: 8, buyPrice: 232.70, currentPrice: 232.70, category: 'value', sector: 'etf' },
    { id: 38, owner: 'matthias', wkn: 'DBX0SV', name: 'Xtrackers MSCI World Swap', amount: 707, buyPrice: 11.29, currentPrice: 11.29, category: 'value', sector: 'etf' },
];

// State management
let stocks = [];
let nextId = 100;
let priceHistory = [];
let charts = {};

// DOM Elements
const tjarkTableBody = document.querySelector('#tjarkTable tbody');
const matthiasTableBody = document.querySelector('#matthiasTable tbody');
const valueTableBody = document.querySelector('#valueTable tbody');
const growthTableBody = document.querySelector('#growthTable tbody');
const sectorTablesContainer = document.getElementById('sectorTables');

const stockModal = document.getElementById('stockModal');
const deleteModal = document.getElementById('deleteModal');
const stockForm = document.getElementById('stockForm');
const modalTitle = document.getElementById('modalTitle');

const filterOwner = document.getElementById('filterOwner');
const filterCategory = document.getElementById('filterCategory');
const filterSector = document.getElementById('filterSector');

let stockToDelete = null;

// Initialize the application
function init() {
    loadStocks();
    loadPriceHistory();
    renderAll();
    setupEventListeners();
    updateLastUpdate();
    initCharts();
    
    // Fetch live prices on load
    fetchAllPrices();
    
    // Auto-refresh prices every 5 minutes
    setInterval(fetchAllPrices, 5 * 60 * 1000);
}

// Load stocks from localStorage or use initial data
function loadStocks() {
    const savedStocks = localStorage.getItem('stockPortfolio');
    if (savedStocks) {
        stocks = JSON.parse(savedStocks);
        nextId = Math.max(...stocks.map(s => s.id)) + 1;
    } else {
        stocks = [...initialStocks];
        saveStocks();
    }
}

// Save stocks to localStorage
function saveStocks() {
    localStorage.setItem('stockPortfolio', JSON.stringify(stocks));
}

// Load price history from localStorage
function loadPriceHistory() {
    const saved = localStorage.getItem('priceHistory');
    if (saved) {
        priceHistory = JSON.parse(saved);
    } else {
        recordPriceSnapshot();
    }
}

// Save price history
function savePriceHistory() {
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    priceHistory = priceHistory.filter(p => p.timestamp > ninetyDaysAgo);
    localStorage.setItem('priceHistory', JSON.stringify(priceHistory));
}

// Record a price snapshot for historical tracking
function recordPriceSnapshot() {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = priceHistory.findIndex(p => p.date === today);
    
    const snapshot = {
        date: today,
        timestamp: Date.now(),
        tjarkTotal: calculateTotals(stocks.filter(s => s.owner === 'tjark')).totalValue,
        matthiasTotal: calculateTotals(stocks.filter(s => s.owner === 'matthias')).totalValue,
        valueTotal: calculateTotals(stocks.filter(s => s.category === 'value')).totalValue,
        growthTotal: calculateTotals(stocks.filter(s => s.category === 'growth')).totalValue,
        combinedTotal: calculateTotals(stocks).totalValue,
        bySector: {}
    };
    
    const sectors = [...new Set(stocks.map(s => s.sector))];
    sectors.forEach(sector => {
        snapshot.bySector[sector] = calculateTotals(stocks.filter(s => s.sector === sector)).totalValue;
    });
    
    if (existingIndex >= 0) {
        priceHistory[existingIndex] = snapshot;
    } else {
        priceHistory.push(snapshot);
    }
    
    savePriceHistory();
}

// Fetch stock price from Yahoo Finance API
async function fetchStockPrice(ticker) {
    try {
        // Use a CORS proxy to access Yahoo Finance
        const url = `${YAHOO_PROXY}${encodeURIComponent(YAHOO_BASE_URL + ticker + '?interval=1d&range=1d')}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.chart && data.chart.result && data.chart.result[0]) {
            const result = data.chart.result[0];
            const meta = result.meta;
            // Get the regular market price
            if (meta.regularMarketPrice) {
                return meta.regularMarketPrice;
            }
            // Fallback to previous close
            if (meta.previousClose) {
                return meta.previousClose;
            }
        }
        return null;
    } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error);
        return null;
    }
}

// Fetch stock info (name) from Yahoo Finance
async function fetchStockInfo(ticker) {
    try {
        const url = `${YAHOO_PROXY}${encodeURIComponent(YAHOO_BASE_URL + ticker + '?interval=1d&range=1d')}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.chart && data.chart.result && data.chart.result[0]) {
            const meta = data.chart.result[0].meta;
            return {
                name: meta.shortName || meta.longName || ticker,
                price: meta.regularMarketPrice || meta.previousClose,
                currency: meta.currency
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching info for ${ticker}:`, error);
        return null;
    }
}

// Fetch all stock prices
async function fetchAllPrices() {
    const refreshBtn = document.getElementById('refreshPrices');
    refreshBtn.innerHTML = '<span class="loading"></span> Updating...';
    refreshBtn.disabled = true;
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const stock of stocks) {
        const ticker = WKN_TO_TICKER[stock.wkn.toUpperCase()];
        if (ticker) {
            try {
                const info = await fetchStockInfo(ticker);
                if (info && info.price !== null) {
                    stock.currentPrice = info.price;
                    // Update name if empty
                    if (!stock.name && info.name) {
                        stock.name = info.name;
                    }
                    updatedCount++;
                }
            } catch (error) {
                errorCount++;
                console.error(`Failed to fetch ${ticker}:`, error);
            }
            // Delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }
    
    saveStocks();
    recordPriceSnapshot();
    renderAll();
    updateCharts();
    updateLastUpdate();
    
    refreshBtn.innerHTML = '🔄 Refresh Prices';
    refreshBtn.disabled = false;
    
    if (updatedCount > 0) {
        showNotification(`Updated ${updatedCount} stock prices`, 'success');
    }
    if (errorCount > 0) {
        showNotification(`Failed to update ${errorCount} stocks`, 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: rgba(56, 239, 125, 0.9); color: #000;' : ''}
        ${type === 'error' ? 'background: rgba(245, 87, 108, 0.9); color: #fff;' : ''}
        ${type === 'info' ? 'background: rgba(102, 126, 234, 0.9); color: #fff;' : ''}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('addStockBtn').addEventListener('click', () => openModal());
    document.querySelector('.close').addEventListener('click', () => closeModal());
    document.getElementById('cancelBtn').addEventListener('click', () => closeModal());
    stockForm.addEventListener('submit', handleFormSubmit);
    document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
    document.getElementById('cancelDelete').addEventListener('click', () => deleteModal.classList.remove('show'));
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    filterOwner.addEventListener('change', renderAll);
    filterCategory.addEventListener('change', renderAll);
    filterSector.addEventListener('change', renderAll);
    document.getElementById('refreshPrices').addEventListener('click', fetchAllPrices);
    
    window.addEventListener('click', (e) => {
        if (e.target === stockModal) closeModal();
        if (e.target === deleteModal) deleteModal.classList.remove('show');
    });
}

// Initialize Charts
function initCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: { color: '#e0e0e0' }
            }
        }
    };
    
    // Owner Chart (Doughnut)
    charts.owner = new Chart(document.getElementById('ownerChart'), {
        type: 'doughnut',
        data: {
            labels: ['Tjark', 'Matthias'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#667eea', '#38ef7d'],
                borderWidth: 0
            }]
        },
        options: { ...chartOptions, cutout: '60%' }
    });
    
    // Category Chart (Doughnut)
    charts.category = new Chart(document.getElementById('categoryChart'), {
        type: 'doughnut',
        data: {
            labels: ['Value', 'Growth'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#667eea', '#38ef7d'],
                borderWidth: 0
            }]
        },
        options: { ...chartOptions, cutout: '60%' }
    });
    
    // Sector Chart (Doughnut)
    charts.sector = new Chart(document.getElementById('sectorChart'), {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#667eea', '#38ef7d', '#f5576c', '#f093fb', '#00d4ff',
                    '#ffd93d', '#6bcb77', '#ff6b6b', '#4ecdc4', '#a55eea',
                    '#fd79a8', '#74b9ff', '#00cec9'
                ],
                borderWidth: 0
            }]
        },
        options: { ...chartOptions, cutout: '60%' }
    });
    
    // Gain/Loss Chart (Bar)
    charts.gainLoss = new Chart(document.getElementById('gainLossChart'), {
        type: 'bar',
        data: {
            labels: ['Value', 'Growth'],
            datasets: [{
                label: 'Gain/Loss (€)',
                data: [0, 0],
                backgroundColor: ['#667eea', '#38ef7d']
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    ticks: { color: '#e0e0e0' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    ticks: { color: '#e0e0e0' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
    
    // Performance Chart (Line)
    charts.performance = new Chart(document.getElementById('performanceChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Combined Total',
                    data: [],
                    borderColor: '#f093fb',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Tjark',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Matthias',
                    data: [],
                    borderColor: '#38ef7d',
                    backgroundColor: 'rgba(56, 239, 125, 0.1)',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    ticks: { 
                        color: '#e0e0e0',
                        callback: (value) => '€' + value.toLocaleString()
                    },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    ticks: { color: '#e0e0e0' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
    
    // Tjark Sector Chart
    charts.tjarkSector = new Chart(document.getElementById('tjarkSectorChart'), {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#667eea', '#764ba2', '#f5576c', '#f093fb', '#00d4ff',
                    '#ffd93d', '#6bcb77', '#ff6b6b', '#4ecdc4', '#a55eea'
                ],
                borderWidth: 0
            }]
        },
        options: { ...chartOptions, cutout: '60%' }
    });
    
    // Matthias Sector Chart
    charts.matthiasSector = new Chart(document.getElementById('matthiasSectorChart'), {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#38ef7d', '#11998e', '#f5576c', '#f093fb', '#00d4ff',
                    '#ffd93d', '#6bcb77', '#ff6b6b', '#4ecdc4', '#a55eea'
                ],
                borderWidth: 0
            }]
        },
        options: { ...chartOptions, cutout: '60%' }
    });
    
    updateCharts();
}

// Update all charts
function updateCharts() {
    if (!charts.owner) return;
    
    // Owner totals
    const tjarkTotal = calculateTotals(stocks.filter(s => s.owner === 'tjark')).totalValue;
    const matthiasTotal = calculateTotals(stocks.filter(s => s.owner === 'matthias')).totalValue;
    charts.owner.data.datasets[0].data = [tjarkTotal, matthiasTotal];
    charts.owner.update();
    
    // Category totals
    const valueTotal = calculateTotals(stocks.filter(s => s.category === 'value')).totalValue;
    const growthTotal = calculateTotals(stocks.filter(s => s.category === 'growth')).totalValue;
    charts.category.data.datasets[0].data = [valueTotal, growthTotal];
    charts.category.update();
    
    // Sector totals
    const sectors = [...new Set(stocks.map(s => s.sector))].sort();
    const sectorData = sectors.map(sector => 
        calculateTotals(stocks.filter(s => s.sector === sector)).totalValue
    );
    charts.sector.data.labels = sectors.map(s => formatSector(s));
    charts.sector.data.datasets[0].data = sectorData;
    charts.sector.update();
    
    // Gain/Loss by category
    const valueTotals = calculateTotals(stocks.filter(s => s.category === 'value'));
    const growthTotals = calculateTotals(stocks.filter(s => s.category === 'growth'));
    charts.gainLoss.data.datasets[0].data = [valueTotals.gain, growthTotals.gain];
    charts.gainLoss.data.datasets[0].backgroundColor = [
        valueTotals.gain >= 0 ? '#667eea' : '#f5576c',
        growthTotals.gain >= 0 ? '#38ef7d' : '#f5576c'
    ];
    charts.gainLoss.update();
    
    // Performance over time
    const sortedHistory = [...priceHistory].sort((a, b) => a.timestamp - b.timestamp);
    charts.performance.data.labels = sortedHistory.map(p => p.date);
    charts.performance.data.datasets[0].data = sortedHistory.map(p => p.combinedTotal);
    charts.performance.data.datasets[1].data = sortedHistory.map(p => p.tjarkTotal);
    charts.performance.data.datasets[2].data = sortedHistory.map(p => p.matthiasTotal);
    charts.performance.update();
    
    // Tjark sector distribution
    const tjarkStocks = stocks.filter(s => s.owner === 'tjark');
    const tjarkSectors = [...new Set(tjarkStocks.map(s => s.sector))].sort();
    const tjarkSectorData = tjarkSectors.map(sector => 
        calculateTotals(tjarkStocks.filter(s => s.sector === sector)).totalValue
    );
    charts.tjarkSector.data.labels = tjarkSectors.map(s => formatSector(s));
    charts.tjarkSector.data.datasets[0].data = tjarkSectorData;
    charts.tjarkSector.update();
    
    // Matthias sector distribution
    const matthiasStocks = stocks.filter(s => s.owner === 'matthias');
    const matthiasSectors = [...new Set(matthiasStocks.map(s => s.sector))].sort();
    const matthiasSectorData = matthiasSectors.map(sector => 
        calculateTotals(matthiasStocks.filter(s => s.sector === sector)).totalValue
    );
    charts.matthiasSector.data.labels = matthiasSectors.map(s => formatSector(s));
    charts.matthiasSector.data.datasets[0].data = matthiasSectorData;
    charts.matthiasSector.update();
}

// Open modal for adding/editing stock
function openModal(stock = null) {
    if (stock) {
        modalTitle.textContent = 'Edit Investment';
        document.getElementById('stockId').value = stock.id;
        document.getElementById('owner').value = stock.owner;
        document.getElementById('wkn').value = stock.wkn;
        document.getElementById('stockName').value = stock.name || '';
        document.getElementById('amount').value = stock.amount;
        document.getElementById('buyPrice').value = stock.buyPrice;
        document.getElementById('currentPrice').value = stock.currentPrice || '';
        document.getElementById('category').value = stock.category;
        document.getElementById('sector').value = stock.sector;
    } else {
        modalTitle.textContent = 'Add New Investment';
        stockForm.reset();
        document.getElementById('stockId').value = '';
    }
    stockModal.classList.add('show');
}

// Close modal
function closeModal() {
    stockModal.classList.remove('show');
    stockForm.reset();
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();

    const stockId = document.getElementById('stockId').value;
    const stockData = {
        owner: document.getElementById('owner').value,
        wkn: document.getElementById('wkn').value.toUpperCase(),
        name: document.getElementById('stockName').value,
        amount: parseFloat(document.getElementById('amount').value),
        buyPrice: parseFloat(document.getElementById('buyPrice').value),
        currentPrice: parseFloat(document.getElementById('currentPrice').value) || parseFloat(document.getElementById('buyPrice').value),
        category: document.getElementById('category').value,
        sector: document.getElementById('sector').value
    };

    if (stockId) {
        const index = stocks.findIndex(s => s.id === parseInt(stockId));
        if (index !== -1) {
            stocks[index] = { ...stocks[index], ...stockData };
        }
    } else {
        stockData.id = nextId++;
        stocks.push(stockData);
    }

    saveStocks();
    recordPriceSnapshot();
    closeModal();
    renderAll();
    updateCharts();
    updateLastUpdate();
}

// Delete stock
function deleteStock(id) {
    stockToDelete = id;
    deleteModal.classList.add('show');
}

function confirmDelete() {
    if (stockToDelete) {
        stocks = stocks.filter(s => s.id !== stockToDelete);
        saveStocks();
        renderAll();
        updateCharts();
        stockToDelete = null;
    }
    deleteModal.classList.remove('show');
}

// Edit stock
function editStock(id) {
    const stock = stocks.find(s => s.id === id);
    if (stock) {
        openModal(stock);
    }
}

// Switch tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}View`).classList.add('active');
    
    if (tabName === 'charts') {
        setTimeout(() => {
            Object.values(charts).forEach(chart => chart.resize());
        }, 100);
    }
}

// Filter stocks
function getFilteredStocks() {
    let filtered = [...stocks];
    
    const ownerFilter = filterOwner.value;
    const categoryFilter = filterCategory.value;
    const sectorFilter = filterSector.value;

    if (ownerFilter !== 'all') {
        filtered = filtered.filter(s => s.owner === ownerFilter);
    }
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(s => s.category === categoryFilter);
    }
    if (sectorFilter !== 'all') {
        filtered = filtered.filter(s => s.sector === sectorFilter);
    }

    return filtered;
}

// Update sector filter options
function updateSectorFilter() {
    const sectors = [...new Set(stocks.map(s => s.sector))].sort();
    filterSector.innerHTML = '<option value="all">All</option>';
    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector;
        option.textContent = formatSector(sector);
        filterSector.appendChild(option);
    });
}

// Format sector name
function formatSector(sector) {
    return sector.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Calculate totals
function calculateTotals(stockList) {
    let totalValue = 0;
    let totalCost = 0;
    
    stockList.forEach(stock => {
        totalValue += stock.amount * stock.currentPrice;
        totalCost += stock.amount * stock.buyPrice;
    });
    
    const gain = totalValue - totalCost;
    const gainPercent = totalCost > 0 ? ((gain / totalCost) * 100) : 0;
    
    return { totalValue, totalCost, gain, gainPercent };
}

// Render all views
function renderAll() {
    updateSectorFilter();
    renderPortfolioView();
    renderCategoryView();
    renderSectorView();
    renderSummary();
}

// Render summary cards
function renderSummary() {
    const tjarkStocks = stocks.filter(s => s.owner === 'tjark');
    const matthiasStocks = stocks.filter(s => s.owner === 'matthias');
    
    const tjarkTotals = calculateTotals(tjarkStocks);
    const matthiasTotals = calculateTotals(matthiasStocks);
    const combinedTotals = calculateTotals(stocks);
    
    document.getElementById('tjarkTotal').textContent = formatCurrency(tjarkTotals.totalValue);
    document.getElementById('tjarkGain').textContent = formatGain(tjarkTotals.gain, tjarkTotals.gainPercent);
    document.getElementById('tjarkGain').className = `summary-gain ${tjarkTotals.gain >= 0 ? 'positive' : 'negative'}`;
    
    document.getElementById('matthiasTotal').textContent = formatCurrency(matthiasTotals.totalValue);
    document.getElementById('matthiasGain').textContent = formatGain(matthiasTotals.gain, matthiasTotals.gainPercent);
    document.getElementById('matthiasGain').className = `summary-gain ${matthiasTotals.gain >= 0 ? 'positive' : 'negative'}`;
    
    document.getElementById('combinedTotal').textContent = formatCurrency(combinedTotals.totalValue);
    document.getElementById('combinedGain').textContent = formatGain(combinedTotals.gain, combinedTotals.gainPercent);
    document.getElementById('combinedGain').className = `summary-gain ${combinedTotals.gain >= 0 ? 'positive' : 'negative'}`;
}

// Render portfolio view (by owner)
function renderPortfolioView() {
    const filtered = getFilteredStocks();
    const tjarkStocks = filtered.filter(s => s.owner === 'tjark');
    const matthiasStocks = filtered.filter(s => s.owner === 'matthias');
    
    renderStockTable(tjarkTableBody, tjarkStocks, true);
    renderStockTable(matthiasTableBody, matthiasStocks, true);
}

// Render category view
function renderCategoryView() {
    const filtered = getFilteredStocks();
    const valueStocks = filtered.filter(s => s.category === 'value');
    const growthStocks = filtered.filter(s => s.category === 'growth');
    
    renderCategoryTable(valueTableBody, valueStocks);
    renderCategoryTable(growthTableBody, growthStocks);
}

// Render sector view
function renderSectorView() {
    const filtered = getFilteredStocks();
    const sectors = [...new Set(filtered.map(s => s.sector))].sort();
    
    sectorTablesContainer.innerHTML = '';
    
    sectors.forEach(sector => {
        const sectorStocks = filtered.filter(s => s.sector === sector);
        const totals = calculateTotals(sectorStocks);
        
        const section = document.createElement('div');
        section.className = 'sector-section';
        section.innerHTML = `
            <h2>${getSectorEmoji(sector)} ${formatSector(sector)} <small>(${formatCurrency(totals.totalValue)})</small></h2>
            <table class="stock-table">
                <thead>
                    <tr>
                        <th>Owner</th>
                        <th>WKN/Symbol</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Total Value</th>
                        <th>Gain/Loss</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
        
        const tbody = section.querySelector('tbody');
        sectorStocks.forEach(stock => {
            const totalValue = stock.amount * stock.currentPrice;
            const totalCost = stock.amount * stock.buyPrice;
            const gain = totalValue - totalCost;
            const gainPercent = ((gain / totalCost) * 100);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="owner-badge owner-${stock.owner}">${stock.owner}</span></td>
                <td>${stock.wkn}</td>
                <td>${stock.name || '-'}</td>
                <td>${stock.amount}</td>
                <td>${formatCurrency(totalValue)}</td>
                <td class="${gain >= 0 ? 'positive' : 'negative'}">${formatGain(gain, gainPercent)}</td>
                <td><span class="category-badge category-${stock.category}">${stock.category}</span></td>
            `;
            tbody.appendChild(row);
        });
        
        sectorTablesContainer.appendChild(section);
    });
}

// Render stock table
function renderStockTable(tbody, stockList, showActions = false) {
    tbody.innerHTML = '';
    
    if (stockList.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="10" class="empty-state">No stocks found</td>`;
        tbody.appendChild(row);
        return;
    }
    
    stockList.forEach(stock => {
        const totalValue = stock.amount * stock.currentPrice;
        const totalCost = stock.amount * stock.buyPrice;
        const gain = totalValue - totalCost;
        const gainPercent = totalCost > 0 ? ((gain / totalCost) * 100) : 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stock.wkn}</td>
            <td>${stock.name || '-'}</td>
            <td>${stock.amount}</td>
            <td>${formatCurrency(stock.buyPrice)}</td>
            <td>${formatCurrency(stock.currentPrice)}</td>
            <td>${formatCurrency(totalValue)}</td>
            <td class="${gain >= 0 ? 'positive' : 'negative'}">${formatGain(gain, gainPercent)}</td>
            <td><span class="category-badge category-${stock.category}">${stock.category}</span></td>
            <td><span class="sector-badge">${formatSector(stock.sector)}</span></td>
            <td class="action-buttons">
                <button class="btn btn-small btn-primary" onclick="editStock(${stock.id})">✏️</button>
                <button class="btn btn-small btn-danger" onclick="deleteStock(${stock.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render category table
function renderCategoryTable(tbody, stockList) {
    tbody.innerHTML = '';
    
    if (stockList.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="empty-state">No stocks found</td>`;
        tbody.appendChild(row);
        return;
    }
    
    stockList.forEach(stock => {
        const totalValue = stock.amount * stock.currentPrice;
        const totalCost = stock.amount * stock.buyPrice;
        const gain = totalValue - totalCost;
        const gainPercent = totalCost > 0 ? ((gain / totalCost) * 100) : 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="owner-badge owner-${stock.owner}">${stock.owner}</span></td>
            <td>${stock.wkn}</td>
            <td>${stock.name || '-'}</td>
            <td>${stock.amount}</td>
            <td>${formatCurrency(totalValue)}</td>
            <td class="${gain >= 0 ? 'positive' : 'negative'}">${formatGain(gain, gainPercent)}</td>
            <td><span class="sector-badge">${formatSector(stock.sector)}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
}

// Format gain
function formatGain(gain, percent) {
    const sign = gain >= 0 ? '+' : '';
    return `${sign}${formatCurrency(gain)} (${sign}${percent.toFixed(2)}%)`;
}

// Get sector emoji
function getSectorEmoji(sector) {
    const emojis = {
        'technology': '💻',
        'healthcare': '🏥',
        'finance': '🏦',
        'energy': '⚡',
        'consumer': '🛒',
        'industrial': '🏭',
        'materials': '🧱',
        'utilities': '💡',
        'real-estate': '🏠',
        'communications': '📡',
        'etf': '📊',
        'crypto': '₿',
        'other': '📦'
    };
    return emojis[sector] || '📦';
}

// Update last update timestamp
function updateLastUpdate() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = now.toLocaleString('de-DE');
}

// Make functions available globally for onclick handlers
window.editStock = editStock;
window.deleteStock = deleteStock;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
