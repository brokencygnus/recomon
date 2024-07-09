import { convertShortDate } from '@/app/utils/dates'

// output:
// "Tom Scott changed the name of SDN-3-BKS-04 MTG Trading Account from MTG Trading Account to YGO Trading Account, currency from USD to JMD, and account type from asset to liability"
// "Matt Parker created the business unit MGSV Morgue Services
// "Grant Sanderson set the description of CCLC Calculus Class to ..."
// "Nigel Braun set the currency of CHEV-091 Petroleum Industry Takeover to USD"
export const activity = {
  "business_unit": {
    "create": ({ buCode, buName }) => (
      <p className="font-normal"><span className="font-semibold">Created </span> the business unit {buCode} {buName}</p>
    ),
    "update": ({ buCode, buName, oldData, newData }) => ( // data: { code, name, description }
      <Compare of={`${buCode} ${buName}`} fromObj={oldData} toObj={newData}/>
    ),
    "delete": ({ buCode, buName }) => (
      <p className="font-normal"><span className="font-semibold">Deleted </span> the business unit {buCode} {buName}</p>
    ),
  },
  "account": {
    "create": ({ accountCode, accountName }) => (
      <p className="font-normal"><span className="font-semibold">Created </span> the account {accountCode} {accountName}</p>
    ),
    "update_metadata": ({ accountCode, accountName, oldData, newData }) => ( // data: { code, name, description, currency, accountType }
      <Compare of={`${accountCode} ${accountName}`} fromObj={oldData} toObj={newData}/>
    ),
    "update_balance": ({ accountCode, accountName, oldBalance, newBalance }) => ( // balance: string
      <Compare of={`${accountCode} ${accountName}`} fromObj={{balance:oldBalance}} toObj={{balance:newBalance}}/>
    ), 
    "update_data_source": ({ accountCode, accountName, oldData, newData }) => ( // data: { dataSourceType, apiID, network, blockchainAddress }
      <Compare of={`${accountCode} ${accountName}`} fromObj={oldData} toObj={newData}/>
    ),
    "delete": ({ accountCode, accountName }) => (
      <p className="font-normal"><span className="font-semibold">Deleted </span> the account {accountCode} {accountName}</p>
    ),
  },
  "config": {
    "organization": null, // TBD
    "currency": null, // TBD 
    "default_snapshot": ({ oldConfig, newConfig }) => (  // config: { startingDate, intervalType, intervalOption, primaryInterval, secondaryInterval, weekArray }
      <CompareFreqConfig configName={"default snapshot frequency settings"} of={null} fromObj={oldConfig} toObj={newConfig}/>
    ), 
    "bu_snapshot": ({ buCode, buName, oldConfig, newConfig }) => (
      <CompareFreqConfig configName={"snapshot frequency settings"} of={`${buName}`} fromObj={oldConfig} toObj={newConfig}/>
    ), 
    "default_api_retrieval": ({ oldConfig, newConfig }) => (
      <CompareFreqConfig configName={"default API retrieval settings"} of={null} fromObj={oldConfig} toObj={newConfig}/>
    ), 
    "specific_api_retrieval": ({ apiCode, apiName, oldConfig, newConfig }) => (
      <CompareFreqConfig configName={"API retrieval settings"} of={`${apiCode} ${apiName}`} fromObj={oldConfig} toObj={newConfig}/>
    ), 
    // I think we should skip this one, it needs a bespoke function for it
    // and it's not even worth the time for something that probably shouldn't be in activity log anyway
    //
    // "bu_notifications": ({ buCode, buName, oldConfig, newConfig }) => ( // config: { buIsSendPush, buIsSendEmail, currencyIsSendPush, currencyIsSendEmail, IsRemindUpdate, remindUpdateDays, isNotifyApiFailed, isNotifyApiError, repeatNotif }
    //   <Compare of={`${buName} notification settings`} fromObj={oldConfig} toObj={newConfig}/>
    // ), 
    "bu_discrepancy": ({ buCode, buName, oldConfig, newConfig }) => ( // config: { basis, critHigh, acctbleHigh, acctbleLow, critLow }; basis: "percent" | "usd"
      <Compare of={`${buName} discrepancy settings`} fromObj={oldConfig} toObj={newConfig}/>
    ),
    "currency_discrepancy": ({ currencySymbol, oldConfig, newConfig }) => (
      <Compare of={`${currencySymbol} discrepancy settings`} fromObj={oldConfig} toObj={newConfig}/>
    )
  }
}


// listObj: {"name": "A", "description": "B"}
// unused for now
// output: "name A and description B"
// export const listInWords = ({ listObj }) => {
//   let str = ""
//   const keys = Object.keys(listObj)
//   const length = keys.length

//   for (let i=0; i<length-1; i++) {
//     str += keys[i] + " " + listObj[keys[i]] + ", "
//   }
//   str += "and " + keys[length-1] + " " + listObj[keys[length-1]] + " "

//   return str
// }

// turns [a, b, c] to "a, b, and c" 
export const joinWithAnd = (stringArray) => {
  if (stringArray.length === 1) return stringArray[0]
  if (stringArray.length === 2) return stringArray[0] + " and " + stringArray[1]

  const last = stringArray.pop()
  const rest = stringArray
  return `${rest.join(", ")}, and ${last}`
}

export function Compare({ of, fromObj, toObj }) {
  const fromKeys = Object.keys(fromObj)
  const toKeys = Object.keys(toObj)

  const added = []
  const changed = []
  const deleted = []

  for (let key in toKeys) {
    if (fromKeys.includes(toKeys[key])) {
      if (fromObj[toKeys[key]] !== toObj[toKeys[key]]) {
        changed.push(toKeys[key])
      }
    } else {
      added.push(toKeys[key])
    }
  }

  for (let key in fromKeys) {
    if (!toKeys.includes(fromKeys[key])) {
      deleted.push(fromKeys[key])
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
    addedStr.push(/* set */ `the ${parseKey(thing)} of ${of} to "${parseVal(toObj[thing])}"`)
  } else if (changed.length) {
    // changed the name of the business unit A001 Hasil Maling from "Hasil Maling" to "Sumbangan Tidak Sukarela"
    let thing = changed.shift()
    changedStr.push(/* changed */ `the ${parseKey(thing)} of ${of} from "${parseVal(fromObj[thing])}" to "${parseVal(toObj[thing])}"`)
  } else if (deleted.length) {
    // removed the description of A001 Hasil Maling (was "Charitable donations from unsuspecting folk")
    let thing = deleted.shift()
    deletedStr.push(/* removed */ `the ${parseKey(thing)} of ${of} (was "${parseVal(fromObj[thing])}")`)
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

  return (
    <div className="flex flex-col font-normal gap-y-1">
      {addedStr.length ?
        <p>
          <span className="font-semibold">Set </span>
          <span>{joinWithAnd(addedStr)}.</span>
        </p>
      : null }
      {changedStr.length ?
        <p>
          <span className="font-semibold">Changed </span>
          <span>{joinWithAnd(changedStr)}.</span>
        </p>
      : null }
      {deletedStr.length ?
        <p>
          <span className="font-semibold">Removed </span>
          <span>{joinWithAnd(deletedStr)}.</span>
        </p>
      : null }
    </div>
  )
}

export function CompareFreqConfig({ configName, of, fromObj, toObj }) {
  let newFromObj = {}
  let newToObj = {}

  switch (true) {
    case (fromObj.startingDate !== toObj.startingDate):
      // Starting date is changed
      newFromObj.startingDate = fromObj.startingDate
      newToObj.startingDate = toObj.startingDate
    case (fromObj.intervalType !== toObj.intervalType):
      // Everything except for starting date is changed
      newFromObj = fromObj
      newToObj = toObj
      break;
    case (fromObj.primaryInterval !== toObj.primaryInterval
      || fromObj.secondaryInterval !== toObj.secondaryInterval
    ):
      // Interval duration is changed
      newFromObj.primaryInterval = fromObj.primaryInterval
      newToObj.primaryInterval = toObj.primaryInterval
      newFromObj.secondaryInterval = fromObj.secondaryInterval
      newToObj.secondaryInterval = toObj.secondaryInterval
    case (fromObj.intervalType === "week"
      && fromObj.weekArray !== toObj.weekArray
    ):
      // weekArray is changed
      newFromObj.weekArray = fromObj.weekArray
      newToObj.weekArray = toObj.weekArray
    case ((fromObj.intervalType === "month" || fromObj.intervalType === "hour")
      && fromObj.intervalOption !== toObj.intervalOption
    ):
      // Interval option is changed
      newFromObj.intervalOption = fromObj.intervalOption
      newToObj.intervalOption = toObj.intervalOption
    default:
      break;
  }

  // parse both newFromObj and toFromObj
  const parseFreq = (obj) => {
    const { startingDate, intervalType, intervalOption, primaryInterval, secondaryInterval, weekArray } = obj

    let str = "Repeating"

    if (primaryInterval) {
      str += "every"

      if (primaryInterval !== 1) {
        // Repeating every 5
        str += ` ${primaryInterval}`
        // Repeating every 5 hours
        str += ` ${intervalType}s`
      } else {
        if (intervalType === 'hour' && secondaryInterval) {
          //Repeating  every 1 hour (...and x minutes)
          str += ` ${primaryInterval} ${intervalType}`
        } else {
          // Repeating every hour
          str += ` ${intervalType}`
        }
      }
  
      // Repeating every hour and 30 minutes
      if (intervalType === 'hour' && secondaryInterval) {
        str += ` and ${secondaryInterval} minutes`
      }
    }

    // Repeating every 2 weeks on Mondays, Thursdays, and Sundays
    if (weekArray) {
      str += " on"
      str += () => {
        const weekStringArray = []
        if (weekArray[0]) weekStringArray.push("Mondays")
        if (weekArray[1]) weekStringArray.push("Tuesdays")
        if (weekArray[2]) weekStringArray.push("Wednesdays")
        if (weekArray[3]) weekStringArray.push("Thursdays")
        if (weekArray[4]) weekStringArray.push("Fridays")
        if (weekArray[5]) weekStringArray.push("Saturday")
        if (weekArray[6]) weekStringArray.push("Sundays")
        return joinWithAnd(weekStringArray)
      }
    }

    // Every 4 hours and 30 minutes starting at the same time every day
    if (intervalOption)
    switch (intervalOption) {
      case "month-same-date":
        str += " on the same date of the month"
        break;
      case "month-same-day-of-week":
        str += " on the same day of the week"
        break;
      case "time-same-time-every-day":
        str += " starting at the same time every day"
        break;
      case "time-continuous":
        str += " continuously, ignoring day changes"
        break;
    }

    if (startingDate) {
      str += convertShortDate
    }
  }
  
  return (
    <>
      <p className="font-normal">
        {`changed the ${configName} ${of && `of ${of}`} from ${parseFreq(fromObj)} to ${parseFreq(toObj)}`}
      </p>
    </>
  )
}
  


// Translate key to human readable
const parseKey = (thing) => {
  if (thing in keyDict) {
    return keyDict[thing]
  } else {
    return null
  }
}

// Translate key to human readable
const parseVal = (thing) => {
  if (thing in valDict) {
    return valDict[thing]
  } else {
    // If dict doesn't have it, it's an arbitrary value that needs quotation marks anyway
    return thing
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
  "balance": "balance",
  "basis": "basis",
  "crit_high": "critical high threshold",
  "acctble_high": "acceptable high threshold",
  "crit_low": "critical low threshold",
  "acctble_low": "acceptable low threshold",
  "basis": "basis"
}

const valDict = {
  "capital": "capital",
  "asset": "asset",
  "liability": "liability",
  "api": "Synced using API",
  "blockchain": "Synced using blockchain",
  "manual": "Manual input",
  "usd": "based on the USD equivalent amount",
  "percent": "based on a percentage of the capital",
  "currency": "based on the nominal currency amount"
}