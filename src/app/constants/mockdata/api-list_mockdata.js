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

// There's not a lot of guard clauses because this shit is frustrating
export const apiRetrievalSettings = {
  startingDate: "2024-05-20T11:23Z",
  intervalType: "hour",
  intervalOption: "time-same-time-every-day",
  primaryInterval: 2,
  secondaryInterval: 30,
  weekArray: undefined,
}