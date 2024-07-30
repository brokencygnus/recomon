// output:
// "Tom Scott changed the name of SDN-3-BKS-04 MTG Trading Account from MTG Trading Account to YGO Trading Account, currency from USD to JMD, and account type from asset to liability"
// "Matt Parker created the business unit MGSV Morgue Services with description \"Business unit that concerns the cashflow of CAMP Investment morgue services.\""
// "Grant Sanderson set the description to the business unit CCLC Calculus Class to ..."
// "Nigel Braun set the currency of CHEV-091 Petroleum Industry Takeover to USD"
export const activities = {
  businessUnit: {
    "create": ({ buCode, buName }) => {}, // data: { code, name, description }
    "update": ({ buCode, buName, oldData, newData }) => {},
    "delete": ({ buCode, buName }) => {},
  },
  account: {
    "create": ({ accountCode, accountName }) => {},
    "update_metadata": ({ accountCode, accountName, oldData, newData }) => {}, // data: { code, name, description, currency, accountType }
    "update_balance": ({ accountCode, accountName, oldBalance, newBalance }) => {}, // balance: string
    "update_data_source": ({ accountCode, accountName, oldData, newData }) => {}, // data: { dataSourceType, apiID, network, blockchainAddress }
    "delete": ({ accountCode, accountName }) => {},
  },
  config: {
    "organization": null, // TBD
    "currency": null, // TBD 
    "default_snapshot": ({ startingDate, intervalType, intervalOption, primaryInterval, secondaryInterval, weekArray }) => {},
    "bu_snapshot": ({ startingDate, intervalType, intervalOption, primaryInterval, secondaryInterval, weekArray }) => {},
    "default_api_retrieval": ({ startingDate, intervalType, intervalOption, primaryInterval, secondaryInterval, weekArray }) => {},
    "specific_api_retrieval": ({ startingDate, intervalType, intervalOption, primaryInterval, secondaryInterval, weekArray }) => {},
    "bu_notifications": ({ buIsSendPush, buIsSendEmail, currencyIsSendPush, currencyIsSendEmail, IsRemindUpdate, remindUpdateDays, isNotifyApiFailed, isNotifyApiError, repeatNotif }) => {},
    "bu_discrepancy": ({ basis, critHigh, acctbleHigh, acctbleLow, critLow }) => {}, // basis: "percent" | "usd"
    "currency_discrepancy": ({ currencySymbol, basis, critHigh, acctbleHigh, acctbleLow, critLow }) => {}, // basis: "percent" | "usd" | "currency"
  }
}

// listObj: {"name": "A", "description": "B"}
// output: "name A and description B"
export const listInWords = ({ listObj }) => {
  const str = ""
  const keys = Object.keys(listObj)
  const length = keys.length

  for (let i=0; i<length-1; i++) {
    str += keys[i] + " " + listObj[keys[i]] + ", "
  }
  str += "and " + keys[length-1] + " " + listObj[keys[length-1]] + " "

  return str
}

export const compareInWords = ({ of, fromObj, toObj }) => {
  const fromKeys = Object.keys(fromObj)
  const toKeys = Object.keys(toObj)

  const added = []
  const changed = []
  const deleted = []

  for (key in toKeys) {
    if (fromKeys.includes(key)) {
      if (fromObj(key) !== toObj(key)) {
        changed.push(key)
      }
    } else {
      added.push(key)
    }
  }

  for (key in fromKeys) {
    if (!toKeys.includes(key)) {
      deleted.push(key)
    }
  }

  const addedStr = []
  const changedStr = []
  const deletedStr = []

  // First clause
  // set / changed / removed isn't in the strings because I want them to be semibold later 
  if (added.length) {
    //  set the description of A001 Hasil Maling to "Charitable donations from unsuspecting folk"
    let thing = added.shift()
    addedStr.push(/* set */ `the ${parseKey(thing)} ${of} to "${parseVal(toObj[thing])}"`)
  } else if (changed.length) {
    // changed the name of the business unit A001 Hasil Maling from "Hasil Maling" to "Sumbangan Tidak Sukarela"
    let thing = changed.shift()
    changedStr.push(/* changed */ `the ${parseKey(thing)} ${of} from "${parseVal(fromObj[thing])}" to "${parseVal(toObj[thing])}"`)
  } else if (deleted.length) {
    // removed the description of A001 Hasil Maling (was "Charitable donations from unsuspecting folk")
    let thing = deleted.shift()
    deletedStr.push(/* removed */ `the ${parseKey(thing)} ${of} (was "${parseVal(fromObj[thing])}")`)
  }

  // ..., (set) the description to "Charitable donations from unsuspecting folk", ...
  for (let i in added) {
    let thing = added[i]
    addedStr.push(`${parseKey(thing)} to "${parseVal(toObj[i])}"`)
  }
  // ..., (changed) the name from "Hasil Maling" to "Sumbangan Tidak Sukarela", ...
  for (let i in changed) {
    let thing = changed[i]
    changedStr.push(`the ${parseKey(thing)} from "${parseVal(fromObj[thing])}" to "${parseVal(toObj[thing])}"`)
  }
  // ..., (removed) the name (was "Sumbangan Tidak Sukarela"), ...
  for (let i in deleted) {
    let thing = deleted[i]
    deletedStr.push(`the ${parseKey(thing)} (was "${parseVal(fromObj[thing])}")`)
  }

  return {addedStr, changedStr, deletedStr}
}

// Translate key to human readable
const parseKey = (thing) => {
  if (thing in keyDict) {
    return keyDict.thing
  } else {
    return null
  }
}

// Translate key to human readable
const parseVal = (thing) => {
  if (thing in valDict) {
    return `"${valDict.thing}"`
  } else {
    // If dict doesn't have it, it's an arbitrary value that needs quotation marks anyway
    return `"${thing}"`
  }
}

// dictionary to translate to human readable
const keyDict = {
  "business_unit": "business unit",
  "code": "code",
  "name": "name",
  "description": "description",
  "account": "account",
  "currency": "currency",
  "account_type": "account type",
  "data_source": "data source",
  "api": "API",
  "basis": "basis",
  "crit_high": "critical high threshold",
  "acctble_high": "acceptable high threshold",
  "crit_low": "critical low threshold",
  "acctble_low": "acceptable low threshold",
}

const valDict = {
  "capital": "capital",
  "asset": "asset",
  "liability": "liability",
  "api": "Synced using API",
  "blockchain": "Synced using blockchain",
  "manual": "Manual input"
}