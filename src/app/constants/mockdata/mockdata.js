// Backend should ABSOLUTELY provide startingDate AND referenceDate (or frontend can copy referenceDate based on startingDate)
// startingDate is mutated when recursing, while referenceDate remains the same throughout recursion, used as a reference point
// There's not a lot of guard clauses because this shit is frustrating
export const APIs = [
  {
    id: 1,
    code: "API-FRBK-01",
    name: "Fireblocks API",
    ageMS: 7527951,
    url: "https://www.campinvestment.com/api/fireblocks-api",
    custom_headers: `{"Authorization": "Bearer aByw0ysG?a9p4DVE8dVejvRqQqc9gfu8bhjcQktePcGmmoQRD2kO7IIE-X?QIydVej6obypz8f3pb6xyzp7dMgTMniOZ3!pAUWaPxIFEntpcVETSLjO?FworL/ZIHK=d4lyKJYViK52Ho=bOUAEIw!VyBlbwjB6qA-T-MrF-F/QauhZUm2vSvIBX0Wk800iCSYH7j3N7US-hlso/2aHN5FAoV6gyFL83dsEP/DvTl3=xyg7QT6q-7rQYUJtjNy!j", "Content-Type": "application/json"}`,
    alerts: ["api_config_error"],
    testResult: "200 OK",
    testResponse: `{"success": true, "data": { "BTC-A002":"12345678.12345678", "ETH-A001":"12345678.12345678", "BTC-FDA006":"12345678.12345678", "BTC-FDA007":"12345678.12345678", "ETH-FDA002":"12345678.12345678", "ETH-FDA003":"12345678.12345678", "ETH-A001":"12345678.12345678", "SOL-A001":"12345678.12345678" }}`,
    apiRetrievalSettings: {
      startingDate: "2024-05-20T11:23Z",
      intervalType: "hour",
      intervalOption: "time-same-time-every-day",
      primaryInterval: 2,
      secondaryInterval: 30,
      weekArray: undefined,
    }
  },
  {
    id: 2,
    code: "API-ACRG-01",
    name: 'Anchorage API',
    ageMS: 41357,
    url: "https://www.campinvestment.com/api/anchorage-api",
    custom_headers: `{"Authorization": "Bearer HhrowEjiGEFu2jwAb7TT?x6CchlLy7zVt95RqLV90VmXITNCuLVogx-Vm2ou?7HNPVyvCv!jUz!EvdboeW-1MEqEvxu2qZZy/7aV/!4VYE1gGiErMiU!B8bECQxFaBEThwAgYcUvuotIlNdhCHCUOSnevyG0VCiIBiGfmslzYqhsueZgPWsKis?VI9MoGUCHS7cFXTByIa009MdZI7H?x2z2L7Nkrp79-KoOhAgz4Ynml!7XbSH4ryoAbRAyPYj/, "Content-Type": "application/json"}`,
    testResult: "421 I'm a teapot",
    testResponse: `{"success": false, "message": "The requested entity body is short and stout. Tip me over and pour me out." }`,
    apiRetrievalSettings: {
      startingDate: "2024-05-20T11:23Z",
      intervalType: "hour",
      intervalOption: "time-same-time-every-day",
      primaryInterval: 4,
      secondaryInterval: 0,
      weekArray: undefined,
    }
  },
  {
    id: 3,
    code: "API-CNBS-01",
    name: 'Coinbase API',
    ageMS: 17472025,
    url: "https://www.campinvestment.com/api/coinbase-api",
    custom_headers: `{"Authorization": "Bearer -dr4SCoHsfatQdVdFQfm7HjY6X8RqkfPm9TZjrymna0muDHy-mI=5-0TueymzoutEsmt301rS7hT6CBp8pLq7vGDnXDQ9JS-GZtHIqydCuX1s?t0jikt4QKHcpq3I4NvkTDT-0=UZaAd94x/J9fA3wvCpuJVg=0nkkfiE9jc4OEmBsTfIsNudYs2Cuh4rH7a01fkN9wVUw6GV1cSNBzMXn1qLSifZD68IdRTZXfrSC6nC254UmAeZFk-ApITHbrI, "Content-Type": "application/json"}`,
    testResult: "431 Request Header Fields Too Large",
    testResponse: `{"success": false, "message": "Request Header Fields Too Large" }`,
    apiRetrievalSettings: null
  },
  {
    id: 4,
    code: "API-IDDX-01",
    name: 'INDODAX API',
    ageMS: 477732,
    url: "https://www.campinvestment.com/api/indodax-api",
    custom_headers: `{"Authorization": "Bearer tqEHkGR17NIFsX9BwIIsPxLmCQ!7C4E4VpEeybaDAvpgnBr?GpWXmLP=9AguLFy0iNaOGqz8U-qzQ?Z15ff786TTZumYWMXB59Dh-Lk20x/g8zRdvMnU4OZz6AQf1TbJAE6zlRXavd=ouYNcv9bb17SJ/ZY73hTCAyNHPZFFLA7Q/HQcOvGHqA4RD3pVqKcwdRYZXEXl-bmWGO!/RWWG2V3HHIxSUyRQ!xcaO1OlZsFguDUl!IuM3K3d6gAlC-yw, "Content-Type": "application/json"}`,
    testResult: "500 Internal Server Error",
    testResponse: "",
    apiRetrievalSettings: {
      startingDate: "2024-05-20T11:23Z",
      intervalType: "week",
      intervalOption: undefined,
      primaryInterval: 1,
      secondaryInterval: 0,
      weekArray: [true, false, false, false, true, false, false],
    }
  },
  {
    id: 5,
    code: "API-FCNX-01",
    name: 'FalconX API',
    ageMS: 6149116,
    url: "https://www.campinvestment.com/api/falconx-api",
    custom_headers: `{"Authorization": "Bearer /yareM6OXxlkAp/fTeCMx!I8SBEdEapuWn0lMLoMY9ChLcYvpPk3a!f7V9DhyxSPe!TAr/cbC?udDm?OeIEndM?-LgMCS-imJbYjQw11w7=6I58?OcxWLn!/4F5nLWNN8N2l8K7Cf!vo1Yl5ITyz6fipN0QfA8OIg2l?Te=H1/qZNIFMs5jR1YjIWwZXcTZz2jXxh?cy8DyyIUgLYjLTukTeAdbKpcuU5nU9xiJ?fUr6Ff9ByFHifaDEFpi6t!zI, "Content-Type": "application/json"}`,
    alerts: ["api_request_failed", "api_config_error"],
    testResult: "218 This is fine",
    testResponse: `{ "success": false, "code": "500", "message": "Internal Server Error" }`,
    apiRetrievalSettings: null
  },
  {
    id: 6,
    code: "API-INTL-01",
    name: 'Internal CAMP API',
    ageMS: 46343658,
    url: "https://www.campinvestment.com/api/internal/user-pool-balances?filter=all",
    custom_headers: `{"Content-Type": "application/json"}`,
    testResult: "450 Blocked by Windows Parental Controls",
    testResponse: `{ "success": false, "message": "Windows Parental Controls has blocked access to the requested resource" }`,
    apiRetrievalSettings: {
      startingDate: "2024-05-20T11:23Z",
      intervalType: "month",
      intervalOption: "month-same-day-of-week",
      primaryInterval: 1,
      secondaryInterval: 0,
      weekArray: undefined,
    }
  },
]

export const defaultApiRetrievalSettings = {
  startingDate: "2024-01-01T11:23Z",
  intervalType: "week",
  intervalOption: undefined,
  primaryInterval: 2,
  secondaryInterval: 0,
  weekArray: [true, false, false, false, false, false, false],
}

export const currencies = [
  { name: 'Bitcoin', symbol: 'BTC', convertUSD: "64251.80", is_blockchain: true,  networks: ["Bitcoin"], icon: '/asset_icons/BTC.svg'},
  { name: 'Ethereum', symbol: 'ETH', convertUSD: "3493.75", is_blockchain: true, networks: ["ERC20"], icon: '/asset_icons/ETH.svg'},
  { name: 'USD Tether', symbol: 'USDT', convertUSD: "0.99942", is_blockchain: true, networks: ["ERC20", "TRC20"], icon: '/asset_icons/USDT.svg'},
  { name: 'Cardano', symbol: 'ADA', convertUSD: "0.3969", is_blockchain: true, networks: ["Cardano"], icon: '/asset_icons/ADA.svg'},
  { name: 'Indonesian Rupiah', symbol: 'IDR', convertUSD: "0.00006089", is_blockchain: false, networks: []},
  { name: 'Indian Rupee', symbol: 'INR', convertUSD: "0.01198178", is_blockchain: false, networks: []},
  { name: 'United States Dollar', symbol: 'USD', convertUSD: "1", is_blockchain: false, networks: []},
]

export const menusNotifications = [
  { code: 'dash', notifications: false },
  { code: 'bu', notifications: true },
  { code: 'snap', notifications: false },
  { code: 'api', notifications: true },
  { code: 'log', notifications: false },
  { code: 'dbug', notifications: true },
]

export const businessUnits = [
  {
    id: 1,
    name: 'Exchange',
    slug: 'exchange',
    code: 'EXCG',
    accounts: "35",
    currencies: "6",
    balance: "16463613.68740567",
    gap: "1833.61636341",
    description: 'Concerns the assets associated with CAMP Investment Exchange, including Swap and Spot Market products. Assets include customer funds, working capital, and escrow funds.',
    alerts: ["gap_unacceptable_entireBU", "gap_critical_currency", "api_request_failed"],
    snapshotSettings: {
      startingDate: "2024-05-20T11:23Z",
      intervalType: "hour",
      intervalOption: "time-same-time-every-day",
      primaryInterval: 2,
      secondaryInterval: 30,
      weekArray: undefined,
    },
    discrAlertConf: {
      buSendPush: true,
      buSendEmail: false,
      curSendPush: true,
      curSendEmail: false,
      repeatNotif: false,
      basis: "usd",
      critHigh: 12000,
      acctbleHigh: 5000,
      acctbleLow: -5000,
      critLow: -12000,
    }
  },
  {
    id: 2,
    name: 'Fixed Deposit',
    slug: 'fixed-deposit',
    code: 'FXDT',
    accounts: "30",
    currencies: "8",
    balance: "13692766.98141219",
    gap: "905.71103009",
    description: 'Concerns the assets in custody of product providers in order to provide CAMP Investment customers with returns from our Fixed Deposit product.',
    alerts:null,
    snapshotSettings: {
      startingDate: "2024-05-20T11:23Z",
      intervalType: "hour",
      intervalOption: "time-same-time-every-day",
      primaryInterval: 4,
      secondaryInterval: 0,
      weekArray: undefined,
    },
    discrAlertConf: {
      buSendPush: true,
      buSendEmail: true,
      curSendPush: true,
      curSendEmail: true,
      repeatNotif: false,
      basis: "percent",
      critHigh: null,
      acctbleHigh: null,
      acctbleLow: -2,
      critLow: -5,
    }
  },
  { id: 3,
    name: 'Staking',
    slug: 'staking',
    code: 'STKG',
    accounts: "11",
    currencies: "5",
    balance: "13577524.32265859",
    gap: "4226.6919247",
    description: 'Concerns the assets required to maintain the Staking products, whether derived from user staking or internal staking. Assets are stored in staking wallets or external staking providers',
    alerts: ["too_long_since_last_update"],
    snapshotSettings: null,
    discrAlertConf: null
  },
  { id: 4,
    name:'Market Maker Bot',
    slug: 'market-maker-bot',
    code: 'MMBT', accounts: "52",
    currencies: "19",
    balance: "83694865.57046921", 
    gap: "3124.88460947",
    description: 'Concerns the assets in multiple counterparties in order to arbitrage the discrepancies between their order books.',
    alerts: ["gap_unacceptable_entireBU", "blockchain_connection_failed"],
    snapshotSettings: {
      startingDate: "2024-05-20T11:23Z",
      intervalType: "week",
      intervalOption: undefined,
      primaryInterval: 1,
      secondaryInterval: 0,
      weekArray: [true, false, false, false, true, false, false],
    },
    discrAlertConf: {
      buSendPush: false,
      buSendEmail: true,
      curSendPush: false,
      curSendEmail: false,
      repeatNotif: true,
      basis: "usd",
      critHigh: null,
      acctbleHigh: 5000,
      acctbleLow: -3000,
      critLow: -8000,
    }
  },
  {
    id: 5, 
    name: 'Loan',
    slug: 'loan',
    code: 'LOAN',
    accounts: "23",
    currencies: "8",
    balance: "67659470.58309516",
    gap: "794.59775464",
    description: 'Concerns the assets used in Loan, product that offers liquid fiat and stablecoins loaned with comparatively volatile crypto assets.',
    alerts: ["api_config_error"],
    snapshotSettings: null,
    discrAlertConf: null
  },
]

export const defaultSnapshotSettings = {
  startingDate: "2024-01-01T11:23Z",
  intervalType: "hour",
  intervalOption: "time-same-time-every-day",
  primaryInterval: 12,
  secondaryInterval: 0,
  weekArray: undefined
}
