// "primary key" is symbol in this mockdata
export const currencies = [
  { name: 'Bitcoin', symbol: 'BTC', fiatSymbol: null, convertUSD: "64251.80", enabled: true, buUsingCurrency: [1, 2, 4, 5], is_blockchain: true,  networks: ["Bitcoin", "Lightning"], icon: '/asset_icons/BTC.svg'},
  { name: 'Ethereum', symbol: 'ETH', fiatSymbol: null, convertUSD: "2661.75", enabled: true, buUsingCurrency: [1, 2, 3, 4, 5], is_blockchain: true, networks: ["ERC-20"], icon: '/asset_icons/ETH.svg'},
  { name: 'USD Tether', symbol: 'USDT', fiatSymbol: null, convertUSD: "0.9994", enabled: true, buUsingCurrency: [1, 2, 4, 5], is_blockchain: true, networks: ["ERC-20", "TRC-20", "POL"], icon: '/asset_icons/USDT.svg'},
  { name: 'Cardano', symbol: 'ADA', fiatSymbol: null, convertUSD: "0.3969", enabled: true, buUsingCurrency: [1, 3], is_blockchain: true, networks: ["Cardano"], icon: '/asset_icons/ADA.svg'},
  { name: 'BNB', symbol: 'BNB', fiatSymbol: null, convertUSD: "595.88", enabled: false, is_blockchain: true, networks: ["BEP-2", "BEP-20"]},
  { name: 'Solana', symbol: 'SOL', fiatSymbol: null, convertUSD: "150.08", enabled: false, is_blockchain: true, networks: ["Solana"]},
  { name: 'Binance USD', symbol: 'BUSD', fiatSymbol: null, convertUSD: "0.9854", enabled: false, is_blockchain: true, networks: ["ERC-20", "BEP-20"]},
  { name: 'Ripple', symbol: 'XRP', fiatSymbol: null, convertUSD: "0.5879", enabled: false, is_blockchain: true, networks: ["XRP Ledger"]},
  { name: 'Dogecoin', symbol: 'DOGE', fiatSymbol: null, convertUSD: "0.1089", enabled: false, is_blockchain: true, networks: ["Doge"]},
  { name: 'TRON', symbol: 'TRX', fiatSymbol: null, convertUSD: "0.1504", enabled: false, is_blockchain: true, networks: ["TRC-20"]},
  { name: 'Avalanche', symbol: 'AVAX', fiatSymbol: null, convertUSD: "27.67", enabled: false, is_blockchain: true, networks: ["Avalanche"]},
  { name: 'Polkadot', symbol: 'DOT', fiatSymbol: null, convertUSD: "4.611", enabled: false, is_blockchain: true, networks: ["Polkadot"]},
  { name: 'Chainlink', symbol: 'LINK', fiatSymbol: null, convertUSD: "12.27", enabled: false, is_blockchain: true, networks: ["ERC-20"]},
  { name: 'Uniswap', symbol: 'UNI', fiatSymbol: null, convertUSD: "6.901", enabled: false, is_blockchain: true, networks: ["ERC-20"]},
  { name: 'Monero', symbol: 'XMR', fiatSymbol: null, convertUSD: "169.26", enabled: false, is_blockchain: true, networks: ["Monero"]},
  { name: 'POL', symbol: 'POL', fiatSymbol: null, convertUSD: "0.4081", enabled: false, is_blockchain: true, networks: ["POL", "EVM"]},
  { name: "Indonesian Rupiah", symbol: "IDR", fiatSymbol: "Rp", convertUSD: "0.00006589", enabled: true, buUsingCurrency: [5], is_blockchain: false, networks: [] },
  { name: "Indian Rupee", symbol: "INR", fiatSymbol: "₹", convertUSD: "0.01198178", enabled: true, is_blockchain: false, networks: [] },
  { name: "United States Dollar", symbol: "USD", fiatSymbol: "$", convertUSD: "1", enabled: true, buUsingCurrency: [5], is_blockchain: false, networks: [] },
  { name: "Euro", symbol: "EUR", fiatSymbol: "€", convertUSD: "1.123", enabled: false, is_blockchain: false, networks: [] },
  { name: "Japanese Yen", symbol: "JPY", fiatSymbol: "¥", convertUSD: "0.006941", enabled: false, is_blockchain: false, networks: [] },
  { name: "Pound Sterling", symbol: "GBP", fiatSymbol: "£", convertUSD: "1.344", enabled: false, is_blockchain: false, networks: [] },
  { name: "Chinese Yuan", symbol: "CNY", fiatSymbol: "¥", convertUSD: "1.428", enabled: false, is_blockchain: false, networks: [] },
  { name: "Australian Dollar", symbol: "AUD", fiatSymbol: "$", convertUSD: "0.6881", enabled: false, is_blockchain: false, networks: [] },
  { name: "Canadian Dollar", symbol: "CAD", fiatSymbol: "$", convertUSD: "0.7449", enabled: false, is_blockchain: false, networks: [] },
  { name: "Swiss Franc", symbol: "CHF", fiatSymbol: "₣", convertUSD: "1.184", enabled: false, is_blockchain: false, networks: [] }
]






