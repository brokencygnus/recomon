// Storing as string because float screws it up
// API definitely wouldn't return age (but instead updatedAt), I'm leaving it constant so that the screenshots look pretty
export const accounts = [
  { id: 1, code: "BTC-C001", name: 'Treasury', currency: 'BTC', dataSource: "manual", type: "capital", balance: "1.12345678", ageMS: 65432449},
  { id: 2, code: "BTC-C002", name: 'Hibah Kementerian Perhutanan', currency: 'BTC', dataSource: "manual", type: "capital", balance: "1.12345678", ageMS: 455714855},
  { id: 3, code: "BTC-C003", name: 'Dana Camping Pecinta Alam', currency: 'BTC', dataSource: "manual", type: "capital", balance: "1.12345678", ageMS: 684734768},
  { id: 4, code: "BTC-C004", name: 'Rika\'s Rainy Day Savings', currency: 'BTC', dataSource: "manual", type: "capital", balance: "991.12345678", ageMS: 598099167},
  { id: 5, code: "BTC-A001", name: 'CAMP Hot Wallet', currency: 'BTC', dataSource: "blockchain", type: "asset", balance: "1.12345678", ageMS: 60163},
  { id: 6, code: "BTC-A002", name: 'Fireblocks Cold Storage', currency: 'BTC', dataSource: "api", type: "asset", balance: "1.12345678", ageMS: 752751},
  { id: 7, code: "BTC-A003", name: 'Anchorage Cold Storage', currency: 'BTC', dataSource: "api", type: "asset", balance: "1.12345678", ageMS: 437},
  { id: 8, code: "BTC-A004", name: 'Coinbase Cold Storage', currency: 'BTC', dataSource: "api", type: "asset", balance: "1.12345678", ageMS: 1747025},
  { id: 9, code: "BTC-A005", name: 'INDODAX Balance', currency: 'BTC', dataSource: "api", type: "asset", balance: "1.12345678", ageMS: 47732},
  { id: 10, code: "BTC-A006", name: 'FalconX Balance', currency: 'BTC', dataSource: "api", type: "asset", balance: "1.12345678", ageMS: 619116},
  { id: 11, code: "BTC-L001", name: 'FalconX Pending Settlement', currency: 'BTC', dataSource: "api", type: "liability", balance: "1.12345678", ageMS: 128684},
  { id: 12, code: "BTC-L002", name: 'Customer Funds', currency: 'BTC', dataSource: "api", type: "liability", balance: "1.12345678", ageMS: 9634368},
]

export const APIs = [
  { id: 1, code: "API-001", name: "Fireblocks API", ageMS: 7527951, testResult: "200 OK", testResponse: `{"success": true, "data": { "BTC-A002":"12345678.12345678", "ETH-A001":"12345678.12345678", "BTC-FDA006":"12345678.12345678", "BTC-FDA007":"12345678.12345678", "ETH-FDA002":"12345678.12345678", "ETH-FDA003":"12345678.12345678", "ETH-A001":"12345678.12345678", "SOL-A001":"12345678.12345678" }}`, url: "https://www.campinvestment.com/api/fireblocks-api", custom_headers: `{"Authorization": "Bearer aByw0ysG?a9p4DVE8dVejvRqQqc9gfu8bhjcQktePcGmmoQRD2kO7IIE-X?QIydVej6obypz8f3pb6xyzp7dMgTMniOZ3!pAUWaPxIFEntpcVETSLjO?FworL/ZIHK=d4lyKJYViK52Ho=bOUAEIw!VyBlbwjB6qA-T-MrF-F/QauhZUm2vSvIBX0Wk800iCSYH7j3N7US-hlso/2aHN5FAoV6gyFL83dsEP/DvTl3=xyg7QT6q-7rQYUJtjNy!j", "Content-Type": "application/json"}`},
  { id: 2, code: "API-002", name: 'Anchorage API', ageMS: 41357, testResult: "421 I'm a teapot", testResponse: `{"success": false, "message": "The requested entity body is short and stout. Tip me over and pour me out." }`, url: "https://www.campinvestment.com/api/anchorage-api", custom_headers: `{"Authorization": "Bearer HhrowEjiGEFu2jwAb7TT?x6CchlLy7zVt95RqLV90VmXITNCuLVogx-Vm2ou?7HNPVyvCv!jUz!EvdboeW-1MEqEvxu2qZZy/7aV/!4VYE1gGiErMiU!B8bECQxFaBEThwAgYcUvuotIlNdhCHCUOSnevyG0VCiIBiGfmslzYqhsueZgPWsKis?VI9MoGUCHS7cFXTByIa009MdZI7H?x2z2L7Nkrp79-KoOhAgz4Ynml!7XbSH4ryoAbRAyPYj/, "Content-Type": "application/json"}`},
  { id: 3, code: "API-003", name: 'Coinbase API', ageMS: 17472025, testResult: "431 Request Header Fields Too Large", testResponse: `{"success": false, "message": "Request Header Fields Too Large" }`, url: "https://www.campinvestment.com/api/coinbase-api", custom_headers: `{"Authorization": "Bearer -dr4SCoHsfatQdVdFQfm7HjY6X8RqkfPm9TZjrymna0muDHy-mI=5-0TueymzoutEsmt301rS7hT6CBp8pLq7vGDnXDQ9JS-GZtHIqydCuX1s?t0jikt4QKHcpq3I4NvkTDT-0=UZaAd94x/J9fA3wvCpuJVg=0nkkfiE9jc4OEmBsTfIsNudYs2Cuh4rH7a01fkN9wVUw6GV1cSNBzMXn1qLSifZD68IdRTZXfrSC6nC254UmAeZFk-ApITHbrI, "Content-Type": "application/json"}`},
  { id: 4, code: "API-004", name: 'INDODAX API', ageMS: 477732, testResult: "500 Internal Server Error", testResponse: "", url: "https://www.campinvestment.com/api/indodax-api", custom_headers: `{"Authorization": "Bearer tqEHkGR17NIFsX9BwIIsPxLmCQ!7C4E4VpEeybaDAvpgnBr?GpWXmLP=9AguLFy0iNaOGqz8U-qzQ?Z15ff786TTZumYWMXB59Dh-Lk20x/g8zRdvMnU4OZz6AQf1TbJAE6zlRXavd=ouYNcv9bb17SJ/ZY73hTCAyNHPZFFLA7Q/HQcOvGHqA4RD3pVqKcwdRYZXEXl-bmWGO!/RWWG2V3HHIxSUyRQ!xcaO1OlZsFguDUl!IuM3K3d6gAlC-yw, "Content-Type": "application/json"}`},
  { id: 5, code: "API-005", name: 'FalconX API', ageMS: 6149116, testResult: "218 This is fine", testResponse: `{ "success": false, "code": "500", "message": "Internal Server Error" }`, url: "https://www.campinvestment.com/api/falconx-api", custom_headers: `{"Authorization": "Bearer /yareM6OXxlkAp/fTeCMx!I8SBEdEapuWn0lMLoMY9ChLcYvpPk3a!f7V9DhyxSPe!TAr/cbC?udDm?OeIEndM?-LgMCS-imJbYjQw11w7=6I58?OcxWLn!/4F5nLWNN8N2l8K7Cf!vo1Yl5ITyz6fipN0QfA8OIg2l?Te=H1/qZNIFMs5jR1YjIWwZXcTZz2jXxh?cy8DyyIUgLYjLTukTeAdbKpcuU5nU9xiJ?fUr6Ff9ByFHifaDEFpi6t!zI, "Content-Type": "application/json"}`},
  { id: 6, code: "API-006", name: 'Internal CAMP API', ageMS: 46343658, testResult: "450 Blocked by Windows Parental Controls", testResponse: `{ "success": false, "message": "Windows Parental Controls has blocked access to the requested resource" }`, url: "https://www.campinvestment.com/api/internal/user-pool-balances?filter=all", custom_headers: `{"Content-Type": "application/json"}`},
]

export const discrAlertConf = {
  critHigh: 10000,
  acctbleHigh: 200,
  acctbleLow: -200,
  critLow: -10000,
}

export const exchangeData = [
  { name: 'Bitcoin', symbol: 'BTC', href: '#', discrepancy:"81234.12345678", is_blockchain: true,  networks: ["Bitcoin"], current: true, interval: {value: 10, unit: "day"} },
  { name: 'Ethereum', symbol: 'ETH', href: '#', discrepancy:"0", is_blockchain: true, networks: ["ERC20"], current: false, interval: {value: 1, unit: "month"} },
  { name: 'USD Tether', symbol: 'USDT', href: '#', discrepancy:"62.85267819928", is_blockchain: true, networks: ["ERC20", "TRC20"], current: false, interval: {value: 3, unit: "hour"} },
  { name: 'Solana', symbol: 'SOL', href: '#', discrepancy:"-72.12345678", is_blockchain: true, networks: ["Solana"], current: false, interval: {value: 4, unit: "hour"} },
  { name: 'Indonesian Rupiah', symbol: 'IDR', href: '#', discrepancy:"591091534.12345678",  is_blockchain: false, networks: [], current: false, interval: {value: 10, unit: "minutes"} },
  { name: 'United States Dollar', symbol: 'USD', href: '#', discrepancy:"225.12345678",  is_blockchain: false, networks: [], current: false, interval: {value: 30, unit: "minutes"} },
]

export const currencies = [
  { name: 'Bitcoin', symbol: 'BTC', convertUSD: "64251.80", is_blockchain: true,  networks: ["Bitcoin"], current: true, interval: {value: 10, unit: "day"} },
  { name: 'Ethereum', symbol: 'ETH', convertUSD: "3493.75", is_blockchain: true, networks: ["ERC20"], current: false, interval: {value: 1, unit: "month"} },
  { name: 'USD Tether', symbol: 'USDT', convertUSD: "0.99942", is_blockchain: true, networks: ["ERC20", "TRC20"], current: false, interval: {value: 3, unit: "hour"} },
  { name: 'Solana', symbol: 'SOL', convertUSD: "134.19", is_blockchain: true, networks: ["Solana"], current: false, interval: {value: 4, unit: "hour"} },
  { name: 'Indonesian Rupiah', symbol: 'IDR', convertUSD: "0.00006089", is_blockchain: false, networks: [], current: false, interval: {value: 10, unit: "minutes"} },
  { name: 'Indian Rupee', symbol: 'INR', convertUSD: "0.01198178", is_blockchain: false, networks: [], current: false, interval: {value: 20, unit: "minutes"} },
  { name: 'United States Dollar', symbol: 'USD', convertUSD: "1", is_blockchain: false, networks: [], current: false, interval: {value: 30, unit: "minutes"} },
]

export const businessUnits = [
  { id: 1, name: 'Exchange', slug: 'exchange', code: 'EXCG', accounts: "35", currencies: "6", balance: "12345678.12345678", description: 'Concerns the assets associated with CAMP Investment Exchange, including Swap and Spot Market products. Assets include customer funds, working capital, and escrow funds.' },
  { id: 2, name: 'Fixed Deposit', slug: 'fixed-deposit', code: 'FXDT', accounts: "30", currencies: "8", balance: "12345678.12345678", description: 'Concerns the assets in custody of product providers in order to provide CAMP Investment customers with returns from our Fixed Deposit product.' },
  { id: 3, name: 'Staking', slug: 'staking', code: 'STKG', accounts: "11", currencies: "5", balance: "12345678.12345678", description: 'Concerns the assets required to maintain the Staking products, whether derived from user staking or internal staking. Assets are stored in staking wallets or external staking providers' },
  { id: 4, name: 'Market Maker Bot', slug: 'mm-bot', code: 'MMBT', accounts: "52", currencies: "19", balance: "12345678.12345678", description: 'Concerns the assets in multiple counterparties in order to arbitrage the discrepancies between their order books.' },
]

export const accountsUsingAPI = [
  {
    id: 1, business_unit: 'Exchange', accounts: [
      { code: 'BTC-A002', currency: 'BTC', name: 'Fireblocks Cold Storage', detected: true },
      { code: 'ETH-A001', currency: 'ETH', name: 'Fireblocks Cold Storage', detected: true }
    ]
  },
  {
    id: 2, business_unit: 'Fixed Deposit',
    accounts: [
      { code: 'BTC-FDA006', currency: 'BTC', name: 'Fireblocks Cold Storage', detected: true },
      { code: 'BTC-FDA007', currency: 'BTC', name: 'Fireblocks Hot Wallet', detected: true },
      { code: 'ETH-FDA002', currency: 'ETH', name: 'Fireblocks Cold Storage', detected: false},
      { code: 'ETH-FDA003', currency: 'BTC', name: 'Fireblocks Hot Wallet', detected: true },
    ]
  },
  {
    id: 3, business_unit: 'Staking', accounts: [
      { code: 'ETH-A001', currency: 'ETH', name: 'Fireblocks Cold Storage', detected: false },
      { code: 'SOL-A001', currency: 'SOL', name: 'Fireblocks Cold Storage', detected: true }
    ]
  },
]

// Backend should ABSOLUTELY provide startingDate and referenceDate (or frontend can copy referenceDate based on startingDate)
// There's not a lot of guard clauses because this shit is frustrating
export const apiRetrievalSettings = {
  startingDate: "2024-05-20T11:00Z",
  referenceDate: "2024-05-20T11:00Z",
  intervalType: { name: "hours", value: "hour" },
  intervalOption: { name: "Starting at the same time every day", value: "time-same-time-every-day"},
  primaryInterval: 2,
  secondaryInterval: 30,
  weekArray: undefined,
}