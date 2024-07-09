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