export const notifications = [
  {
    ageMs: 1000,
    read: true,
    type: "gap_critical_entireBU",
    args: {buName: "Exchange", buSlug: "exchange"}
  },
  {
    ageMs: 4000,
    read: false,
    type: "gap_unacceptable_currency",
    args: { buName: "Fixed Deposit", buSlug: "fixed-deposit", curSymbol:"BTC" }
  },
  {
    ageMs: 25000,
    read: false,
    type: "new_snapshot",
    args: { snapshotID:"14045", buName: "Loan", buSlug: "loan" }
  },
  {
    ageMs: 841000,
    read: true,
    type: "api_config_error",
    args: { apiID: "14045" }
  },
  {
    ageMs: 749956000,
    read: true,
    type: "api_request_failed",
    args: { apiID: "14045" }
  },
]