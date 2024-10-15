export const notifications = [
  {
    ageMs: 11000,
    read: true,
    type: "gap_critical_entireBU",
    args: {buName: "Exchange", buSlug: "exchange"}
  },
  {
    ageMs: 14000,
    read: false,
    type: "gap_unacceptable_currency",
    args: { buName: "Fixed Deposit", buSlug: "fixed-deposit", curSymbol:"BTC" }
  },
  {
    ageMs: 125000,
    read: false,
    type: "new_snapshot",
    args: { snapshotID:"14045", buName: "Loan", buSlug: "loan" }
  },
  {
    ageMs: 1841000,
    read: true,
    type: "api_config_error",
    args: { apiID: "14045" }
  },
  {
    ageMs: 149956000,
    read: true,
    type: "api_request_failed",
    args: { apiID: "14045" }
  },
  {
    ageMs: 151936000,
    read: false,
    type: "blockchain_connection_failed",
    args: { buSlug: "staking", networkName: "ERC-20", currencyName: "ETH" }
  },
  {
    ageMs: 1639457000,
    read: true,
    type: "too_long_since_last_update",
    args: { buName: "Contract Market", buSlug: "contract-market", accountName: "Hedging Cold Wallet in Fireblocks", daysSinceLastUpdate: "60" }
  },
]

export const menusNotifications = [
  { code: 'dash', notifications: false },
  { code: 'bu', notifications: true },
  { code: 'snap', notifications: false },
  { code: 'api', notifications: true },
  { code: 'log', notifications: false },
  { code: 'dbug', notifications: true },
]