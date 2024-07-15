export const notificationTypes = {
  "gap_critical_entireBU": ({ buName, buSlug }) => ({
    icon: "exclamationCircle",
    color: "red",
    header: "Critical gap in business unit",
    body: `The ${buName} business unit as a whole has reached the critical gap threshold.`,
    link: "Investigate immediately.",
    href: `/business-units/${buSlug}`
  }),

  "gap_critical_currency": ({ buName, buSlug, curSymbol }) => ({
    icon: "exclamationCircle",
    color: "red",
    header: "Critical gap in currency",
    body: `The ${curSymbol} currency of the ${buName} business unit has reached the critical gap threshold.`,
    link: "Investigate immediately.",
    href: `/business-units/${buSlug}?currency=${curSymbol}`
  }),

  "gap_unacceptable_entireBU": ({ buName, buSlug }) => ({
    icon: "exclamationCircle",
    color: "amber",
    header: "Gap in business unit",
    body: `The ${buName} business unit as a whole has surpassed the acceptable gap threshold.`,
    link: "Review",
    href: `/business-units/${buSlug}`
  }),

  "gap_unacceptable_currency": ({ buName, buSlug, curSymbol }) => ({
    icon: "exclamationCircle",
    color: "amber",
    header: "Gap in currency",
    body: `The ${curSymbol} currency of the ${buName} business unit has surpassed the acceptable gap threshold.`,
    link: "Review",
    href: `/business-units/${buSlug}?currency=${curSymbol}`
  }),

  "new_snapshot": ({ buName, buSlug, snapshotID }) => ({
    icon: "check",
    color: "sky",
    header: "Snapshot taken!",
    body: `A snapshot has been taken of your business unit ${buName}.`,
    link: "View",
    href: `/business-units/${buSlug}/snapshot/${snapshotID}`
  }),

  "api_config_error": ({ apiID }) => ({
    icon: "exclamationTriangle",
    color: "red",
    header: "API configuration error",
    body: "An account's balance was attempted to be retrieved from an API, but the API does not provide data for it.",
    link: "Review",
    href: `/api-list/${apiID}`
  }),

  "api_request_failed": ({ apiID }) => ({
    icon: "exclamationTriangle",
    color: "amber",
    header: "API request failed",
    body: "A retrieval attempt to one of your APIs has failed. Your balance data might be outdated.",
    link: "Review",
    href: `/api-list/${apiID}`
  }),

  // TODO change link to currency configuration if it exists
  // If not fallback to accounts
  "blockchain_connection_failed": ({ buSlug, networkName, currencyName }) => ({
    icon: "exclamationTriangle",
    color: "amber",
    header: "Blockchain connection failed",
    body: `A retrieval attempt to the ${networkName} network has failed. Your ${currencyName} balance data might be outdated.`,
    link: "Review",
    href: `/business-units/${buSlug}`
  }),

  // TODO change link to account page if it exists
  "too_long_since_last_update": ({ buName, buSlug, accountName, daysSinceLastUpdate }) => ({
    icon: "info",
    color: "gray",
    header: `Data age more than ${daysSinceLastUpdate} days`,
    body: `Your ${accountName} account in ${buName} has not been updated for ${daysSinceLastUpdate} days. Consider updating its data or mark it as up-to-date.`,
    link: "Review",
    href: `/business-units/${buSlug}`
  }),
}