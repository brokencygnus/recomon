export const notificationTypes = {
  "gap_critical_entireBU": ({ buName, buSlug }) => ({
    icon: "exclamationCircle",
    color: "red",
    header: "Critical gap in business unit",
    body: `The ${buName} business unit as a whole has reached the critical gap threshold.`,
    link: "Investigate immediately.",
    href: `/business-unit/${buSlug}`
  }),

  "gap_critical_currency": ({ buName, buSlug, curSymbol }) => ({
    icon: "exclamationCircle",
    color: "red",
    header: "Critical gap in currency",
    body: `The ${curSymbol} currency of the ${buName} business unit has reached the critical gap threshold.`,
    link: "Investigate immediately.",
    href: `/business-unit/${buSlug}?currency=${curSymbol}`
  }),

  "gap_unacceptable_entireBU": ({ buName, buSlug }) => ({
    icon: "exclamationCircle",
    color: "amber",
    header: "Gap in business unit",
    body: `The ${buName} business unit as a whole has surpassed the acceptable gap threshold.`,
    link: "Review",
    href: `/business-unit/${buSlug}`
  }),

  "gap_unacceptable_currency": ({ buName, buSlug, curSymbol }) => ({
    icon: "exclamationCircle",
    color: "amber",
    header: "Gap in currency",
    body: `The ${curSymbol} currency of the ${buName} business unit has surpassed the acceptable gap threshold.`,
    link: "Review",
    href: `/business-unit/${buSlug}?currency=${curSymbol}`
  }),

  "new_snapshot": ({ buName, buSlug, snapshotID }) => ({
    icon: "check",
    color: "sky",
    header: "Snapshot taken!",
    body: `A snapshot has been taken of your business unit ${buName}.`,
    link: "View",
    href: `/business-unit/${buSlug}/snapshot/${snapshotID}`
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
  })
}