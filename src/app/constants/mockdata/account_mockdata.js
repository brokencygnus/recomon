// Storing balance as string because float screws it up
// API definitely wouldn't return age (but instead updatedAt), I'm leaving it constant so that the screenshots look pretty
export const accounts = [

  // BTC

  {
    "id": 1,
    "code": "EXCG-BTC-C01",
    "name": "Treasury",
    "currency": "BTC",
    "dataSource": "manual",
    "type": "capital",
    "balance": "24.74735730",
    "ageMS": 15432735449,
    "alerts": ["too_long_since_last_update"]
  },
  {
    "id": 2,
    "code": "EXCG-BTC-C02",
    "name": "Hibah Kementerian Perhutanan",
    "currency": "BTC",
    "dataSource": "manual",
    "type": "capital",
    "balance": "2.15400000",
    "ageMS": 4455714855
  },
  {
    "id": 3,
    "code": "EXCG-BTC-C03",
    "name": "Ikhwan's BTC Holdings",
    "currency": "BTC",
    "dataSource": "manual",
    "type": "capital",
    "balance": "3.84005734",
    "ageMS": 3684734768
  },
  {
    "id": 4,
    "code": "EXCG-BTC-C04",
    "name": "Rika's Rainy Day Savings",
    "currency": "BTC",
    "dataSource": "manual",
    "type": "capital",
    "balance": "12.35598777",
    "ageMS": 6598099167
  },
  {
    "id": 5,
    "code": "EXCG-BTC-C05",
    "name": "Customer Funds",
    "currency": "BTC",
    "dataSource": "api",
    "api": 6,
    "type": "capital",
    "balance": "30.69269360",
    "ageMS": 95323
  },
  {
    "id": 6,
    "code": "EXCG-BTC-A01",
    "name": "CAMP Hot Wallet",
    "currency": "BTC",
    "dataSource": "blockchain",
    "network": "Bitcoin",
    "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "type": "asset",
    "balance": "44.16985183",
    "ageMS": 10670
  },
  {
    "id": 7,
    "code": "EXCG-BTC-A02",
    "name": "Fireblocks Cold Storage",
    "currency": "BTC",
    "dataSource": "api",
    "api": 1,
    "type": "asset",
    "balance": "12.72912001",
    "ageMS": 7131
  },
  {
    "id": 8,
    "code": "EXCG-BTC-A03",
    "name": "Fireblocks Hot Wallet",
    "currency": "BTC",
    "dataSource": "blockchain",
    "network": "Bitcoin",
    "address": "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    "type": "asset",
    "balance": "15.94533309",
    "ageMS": 62630
  },
  {
    "id": 9,
    "code": "EXCG-BTC-A04",
    "name": "Anchorage Cold Storage",
    "currency": "BTC",
    "dataSource": "api",
    "api": 2,
    "type": "asset",
    "balance": "8.63198164",
    "ageMS": 18121
  },
  {
    "id": 10,
    "code": "EXCG-BTC-A05",
    "name": "Coinbase Cold Storage",
    "currency": "BTC",
    "dataSource": "api",
    "api": 3,
    "type": "asset",
    "balance": "8.24098153",
    "ageMS": 1747025
  },
  {
    "id": 11,
    "code": "EXCG-BTC-A06",
    "name": "INDODAX Balance",
    "currency": "BTC",
    "dataSource": "api",
    "api": 4,
    "type": "asset",
    "balance": "6.22484857",
    "ageMS": 47732
  },
  {
    "id": 12,
    "code": "EXCG-BTC-A07",
    "name": "FalconX Balance",
    "currency": "BTC",
    "dataSource": "api",
    "api": 5,
    "type": "asset",
    "balance": "11.18971598",
    "ageMS": 32304
  },
  {
    "id": 13,
    "code": "EXCG-BTC-L01",
    "name": "FalconX Pending Settlement",
    "currency": "BTC",
    "dataSource": "api",
    "api": 5,
    "type": "liability",
    "balance": "2.55109285",
    "ageMS": 128684
  },
  {
    "id": 14,
    "code": "EXCG-BTC-L02",
    "name": "Customer Funds",
    "currency": "BTC",
    "dataSource": "api",
    "api": 6,
    "type": "liability",
    "balance": "30.69269360",
    "ageMS": 95323
  },

  // ETH

  {
    "id": 15,
    "code": "EXCG-ETH-C01",
    "name": "Treasury",
    "currency": "ETH",
    "dataSource": "manual",
    "type": "capital",
    "balance": "648.89245672",
    "ageMS": 9894523612,
    "alerts": ["too_long_since_last_update"]
  },
  {
    "id": 16,
    "code": "EXCG-ETH-C02",
    "name": "Dana Camping Pecinta Alam",
    "currency": "ETH",
    "dataSource": "manual",
    "type": "capital",
    "balance": "225.76260987",
    "ageMS": 414074243
  },
  {
    "id": 17,
    "code": "EXCG-ETH-C03",
    "name": "Camping Supplies Revenue",
    "currency": "ETH",
    "dataSource": "manual",
    "type": "capital",
    "balance": "59.63634948",
    "ageMS": 179506315
  },
  {
    "id": 18,
    "code": "EXCG-ETH-C04",
    "name": "Customer Funds",
    "currency": "ETH",
    "dataSource": "api",
    "api": 6,
    "type": "capital",
    "balance": "395.45817344",
    "ageMS": 140339
  },
  {
    "id": 19,
    "code": "EXCG-ETH-A01",
    "name": "CAMP Hot Wallet",
    "currency": "ETH",
    "dataSource": "blockchain",
    "network": "ERC-20",
    "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "type": "asset",
    "balance": "570.31071005",
    "ageMS": 73822
  },
  {
    "id": 20,
    "code": "EXCG-ETH-A02",
    "name": "Fireblocks Cold Storage",
    "currency": "ETH",
    "dataSource": "api",
    "api": 1,
    "type": "asset",
    "balance": "173.64693814",
    "ageMS": 52609
  },
  {
    "id": 21,
    "code": "EXCG-ETH-A03",
    "name": "Fireblocks Hot Wallet",
    "currency": "ETH",
    "dataSource": "blockchain",
    "network": "ERC-20",
    "address": "0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0",
    "type": "asset",
    "balance": "243.33980234",
    "ageMS": 316277
  },
  {
    "id": 22,
    "code": "EXCG-ETH-A04",
    "name": "Anchorage Cold Storage",
    "currency": "ETH",
    "dataSource": "api",
    "api": 2,
    "type": "asset",
    "balance": "97.92890014",
    "ageMS": 114053
  },
  {
    "id": 23,
    "code": "EXCG-ETH-A05",
    "name": "Coinbase Cold Storage",
    "currency": "ETH",
    "dataSource": "api",
    "api": 3,
    "type": "asset",
    "balance": "274.49080895",
    "ageMS": 88337
  },
  {
    "id": 24,
    "code": "EXCG-ETH-A06",
    "name": "INDODAX Balance",
    "currency": "ETH",
    "dataSource": "api",
    "api": 4,
    "type": "asset",
    "balance": "213.54874640",
    "ageMS": 48378
  },
  {
    "id": 25,
    "code": "EXCG-ETH-A07",
    "name": "FalconX Balance",
    "currency": "ETH",
    "dataSource": "api",
    "api": 5,
    "type": "asset",
    "balance": "148.6941995",
    "ageMS": 168656
  },
  {
    "id": 26,
    "code": "EXCG-ETH-A08",
    "name": "Staked ETH on Exchange",
    "currency": "ETH",
    "dataSource": "blockchain",
    "network": "ERC-20",
    "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "type": "asset",
    "balance": "26.36290820",
    "ageMS": 226353
  },
  {
    "id": 27,
    "code": "EXCG-ETH-L01",
    "name": "FalconX Pending Settlement",
    "currency": "ETH",
    "dataSource": "api",
    "api": 5,
    "type": "liability",
    "balance": "22.65537855",
    "ageMS": 336442
  },
  {
    "id": 28,
    "code": "EXCG-ETH-L02",
    "name": "Customer Funds",
    "currency": "ETH",
    "dataSource": "api",
    "api": 6,
    "type": "liability",
    "balance": "395.45817344",
    "ageMS": 147730
  },

  // USDT

  {
    "id": 29,
    "code": "EXCG-USDT-C01",
    "name": "Treasury",
    "currency": "USDT",
    "dataSource": "manual",
    "type": "capital",
    "balance": "419025.98626029",
    "ageMS": 8264731829
  },
  {
    "id": 30,
    "code": "EXCG-USDT-C02",
    "name": "Forest Foraging Revenue",
    "currency": "USDT",
    "dataSource": "manual",
    "type": "capital",
    "balance": "86225.46811034",
    "ageMS": 2774834920
  },
  {
    "id": 31,
    "code": "EXCG-USDT-C03",
    "name": "Series Z Funding",
    "currency": "USDT",
    "dataSource": "manual",
    "type": "capital",
    "balance": "66573.47139100",
    "ageMS": 3894523612
  },
  {
    "id": 32,
    "code": "EXCG-USDT-C04",
    "name": "Customer Funds",
    "currency": "USDT",
    "dataSource": "api",
    "api": 6,
    "type": "capital",
    "balance": "739303.26592228",
    "ageMS": 784736
  },
  {
    "id": 33,
    "code": "EXCG-USDT-A01",
    "name": "CAMP Hot Wallet",
    "currency": "USDT",
    "dataSource": "blockchain",
    "network": "ERC-20",
    "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "type": "asset",
    "balance": "699442.83495135",
    "ageMS": 60163
  },
  {
    "id": 34,
    "code": "EXCG-USDT-A02",
    "name": "Fireblocks Cold Storage",
    "currency": "USDT",
    "dataSource": "api",
    "api": 1,
    "type": "asset",
    "balance": "205152.34225059",
    "ageMS": 843759
  },
  {
    "id": 35,
    "code": "EXCG-USDT-A03",
    "name": "Fireblocks Hot Wallet",
    "currency": "USDT",
    "dataSource": "blockchain",
    "network": "ERC-20",
    "address": "0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0",
    "type": "asset",
    "balance": "173212.51738647",
    "ageMS": 54728
  },
  {
    "id": 36,
    "code": "EXCG-USDT-A04",
    "name": "Anchorage Cold Storage",
    "currency": "USDT",
    "dataSource": "api",
    "api": 2,
    "type": "asset",
    "balance": "156891.92890014",
    "ageMS": 48914
  },
  {
    "id": 40,
    "code": "EXCG-USDT-A08",
    "name": "Anchorage Hot Wallet",
    "currency": "USDT",
    "dataSource": "api",
    "api": 2,
    "type": "asset",
    "balance": "378059.71781061",
    "ageMS": 27261
  },
  {
    "id": 37,
    "code": "EXCG-USDT-A05",
    "name": "Coinbase Cold Storage",
    "currency": "USDT",
    "dataSource": "api",
    "api": 3,
    "type": "asset",
    "balance": "159759.44769919",
    "ageMS": 124589
  },
  {
    "id": 38,
    "code": "EXCG-USDT-A06",
    "name": "INDODAX Balance",
    "currency": "USDT",
    "dataSource": "api",
    "api": 4,
    "type": "asset",
    "balance": "147499.54874640",
    "ageMS": 65738
  },
  {
    "id": 39,
    "code": "EXCG-USDT-A07",
    "name": "FalconX Balance",
    "currency": "USDT",
    "dataSource": "api",
    "api": 5,
    "type": "asset",
    "balance": "169764.99876028",
    "ageMS": 224044
  },
  {
    "id": 41,
    "code": "EXCG-USDT-L01",
    "name": "FalconX Pending Settlement",
    "currency": "USDT",
    "dataSource": "api",
    "api": 5,
    "type": "liability",
    "balance": "45974.34597553",
    "ageMS": 70102
  },
  {
    "id": 42,
    "code": "EXCG-USDT-L02",
    "name": "Customer Funds",
    "currency": "USDT",
    "dataSource": "api",
    "api": 6,
    "type": "liability",
    "balance": "739303.26592228",
    "ageMS": 784736
  }
]
