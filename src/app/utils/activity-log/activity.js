import { convertShortDate } from '@/app/utils/dates'
import _ from 'lodash'

// output:
// "Tom Scott changed the name of SDN-3-BKS-04 MTG Trading Account from MTG Trading Account to YGO Trading Account, currency from USD to JMD, and account type from asset to liability"
// "Matt Parker created the business unit MGSV Morgue Services
// "Grant Sanderson set the description of CCLC Calculus Class to ..."
// "Nigel Braun set the currency of CHEV-091 Petroleum Industry Takeover to USD"
export const activity = {
  "businessUnit": {
    "create": ({ buCode, buName, oneLine=false }) => {
      return oneLine
        ? <><span className="font-semibold">created </span> the business unit {buCode} {buName}.</>
        : <p><span className="font-semibold">Created </span> the business unit {buCode} {buName}.</p>
    },
    "update": ({ buCode, buName, oldData, newData, oneLine=false }) => ( // data: { buCode, buName, description }
      <Compare of={`the business unit ${buCode} ${buName}`} fromObj={oldData} toObj={newData} oneLine={oneLine}/>
    ),
    "delete": ({ buCode, buName, oneLine=false }) => {
      return oneLine
        ? <><span className="font-semibold">deleted </span> the business unit {buCode} {buName}.</>
        : <p><span className="font-semibold">Deleted </span> the business unit {buCode} {buName}.</p>
    }
  },
  "account": {
    "create": ({ accountCode, accountName, oneLine=false }) => {
      return oneLine
        ? <><span className="font-semibold">created </span> the account {accountCode} {accountName}.</>
        : <p><span className="font-semibold">Created </span> the account {accountCode} {accountName}.</p>
    },
    "updateMetadata": ({ accountCode, accountName, oldData, newData, oneLine=false }) => ( // data: { accountCode, accountName, description, currency, accountType }
      <Compare of={`the account ${accountCode} ${accountName}`} fromObj={oldData} toObj={newData} oneLine={oneLine}/>
    ),
    "updateBalance": ({ accountCode, accountName, currency, oldBalance, newBalance, oneLine=false }) => ( // balance: string
      <Compare of={`the account ${accountCode} ${accountName}`} fromObj={{balance:`${oldBalance} ${currency}`}} toObj={{balance:`${newBalance} ${currency}`}} oneLine={oneLine}/>
    ), 
    "updateDataSource": ({ accountCode, accountName, oldData, newData, oneLine=false }) => ( // data: { dataSourceType, api = `{code} {name}`, network, blockchainAddress }
      <Compare of={`the account ${accountCode} ${accountName}`} fromObj={oldData} toObj={newData} oneLine={oneLine}/>
    ),
    "delete": ({ accountCode, accountName, oneLine=false }) => {
      return oneLine
        ? <><span className="font-semibold">deleted </span> the account {accountCode} {accountName}.</>
        : <p><span className="font-semibold">Deleted </span> the account {accountCode} {accountName}.</p>
    },
  },
  "api": {
    "create": ({ apiCode, apiName, oneLine=false }) => {
      return oneLine
        ? <><span className="font-semibold">created </span> the API {apiCode} {apiName}.</>
        : <p><span className="font-semibold">Created </span> the API {apiCode} {apiName}.</p>
    },
    "update": ({ apiCode, apiName, oldData, newData, oneLine=false }) => ( // data: { apiCode, apiName, url, customHeaders }
      <Compare of={`the API ${apiCode} ${apiName}`} fromObj={oldData} toObj={newData} oneLine={oneLine} className="break-all"/>
    ),
    "delete": ({ apiCode, apiName, oneLine=false }) => {
      return oneLine
        ? <><span className="font-semibold">deleted </span> the API {apiCode} {apiName}.</>
        : <p><span className="font-semibold">Deleted </span> the API {apiCode} {apiName}.</p>
    },
  },
  "config": {
    "organization": null, // TBD
    "currency": null, // TBD 
    "defaultSnapshot": ({ oldConfig, newConfig, oneLine=false }) => (  // config: { startingDate, intervalType, intervalOption, primaryInterval, secondaryInterval, weekArray }
      <CompareFreqConfig configName={"default snapshot frequency settings"} of={undefined} fromObj={oldConfig} toObj={newConfig} oneLine={oneLine}/>
    ), 
    "buSnapshot": ({ buName, oldConfig, newConfig, oneLine=false }) => (
      <CompareFreqConfig configName={"snapshot frequency settings"} of={`${buName}`} fromObj={oldConfig} toObj={newConfig} oneLine={oneLine}/>
    ), 
    "defaultApiRetrieval": ({ oldConfig, newConfig, oneLine=false }) => (
      <CompareFreqConfig configName={"default API retrieval settings"} of={undefined} fromObj={oldConfig} toObj={newConfig} oneLine={oneLine}/>
    ), 
    "specificApiRetrieval": ({ apiCode, apiName, oldConfig, newConfig, oneLine=false }) => (
      <CompareFreqConfig configName={"API retrieval settings"} of={`${apiCode} ${apiName}`} fromObj={oldConfig} toObj={newConfig} oneLine={oneLine}/>
    ), 
    // I think we should skip this one, it needs a bespoke function for it
    // and it's not even worth the time for something that probably shouldn't be in activity log anyway
    //
    // "buNotifications": ({ buCode, buName, oldConfig, newConfig }) => ( // config: { buIsSendPush, buIsSendEmail, currencyIsSendPush, currencyIsSendEmail, IsRemindUpdate, remindUpdateDays, isNotifyApiFailed, isNotifyApiError, repeatNotif }
    //   <Compare of={`${buName} notification settings`} fromObj={oldConfig} toObj={newConfig}/>
    // ), 
    "buDiscrepancy": ({ buName, oldConfig, newConfig, oneLine=false }) => ( // config: { basis, critHigh, acctbleHigh, acctbleLow, critLow }; basis: "percent" | "usd"
      <Compare of={`${buName} discrepancy settings`} fromObj={oldConfig} toObj={newConfig} oneLine={oneLine}/>
    ),
    "currencyDiscrepancy": ({ currencySymbol, oldConfig, newConfig, oneLine=false }) => (
      <Compare of={`${currencySymbol} discrepancy settings`} fromObj={oldConfig} toObj={newConfig} oneLine={oneLine}/>
    )
  }
}


// listObj: {"name": "A", "description": "B"}
// unused for now
// output: "name A and description B"

//
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
export const joinWithAnd = (anyArray) => {
  if (anyArray.length === 1) return [anyArray[0]]
  if (anyArray.length === 2) return [anyArray[0], " and ", anyArray[1]]

  const last = anyArray.pop()
  const rest = anyArray

  const outputArray = []
  for (let i in rest) {
    outputArray.push(rest[i])
    outputArray.push(", ")
  }
  outputArray.push("and ")
  outputArray.push(last)

  return outputArray
}

// Generic compare
export function Compare({ of, fromObj, toObj, className, oneLine=false }) {
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

  function AddedComp() {
    return (
      <>
        <span className="font-semibold">{oneLine ? 'set ' : 'Set '}</span>
        <span className={className}>{joinWithAnd(addedStr)}</span>
      </>
    )
  }
  function ChangedComp() {
    return (
      <>
        <span className="font-semibold">{oneLine ? 'changed ' : 'Changed '}</span>
        <span className={className}>{joinWithAnd(changedStr)}</span>
      </>
    )
  }
  function DeletedComp() {
    return ( 
      <>
        <span className="font-semibold">{oneLine ? 'removed ' : 'Removed '} </span>
        <span className={className}>{joinWithAnd(deletedStr)}</span>
      </>
    )
  }

  if (oneLine) {
    return (
      <>
        {joinWithAnd([
          addedStr.length && <AddedComp/>,
          changedStr.length && <ChangedComp/>,
          deletedStr.length && <DeletedComp/>
        ].filter(e => e !== 0))}
      </>
    )
  } else {
    return (
      // Can't use && here since it returns false instead of null
      <div className="flex flex-col font-normal gap-y-1">
        <p>{addedStr.length ? <><AddedComp/>.</> : null }</p>
        <p>{changedStr.length ? <><ChangedComp/>.</> : null }</p>
        <p>{deletedStr.length ? <><DeletedComp/>.</> : null }</p>
      </div>
    )
  }
}

// Compare frequency config
export function CompareFreqConfig({ configName, of, fromObj, toObj, oneLine=false }) {
  let newToObj = {}

  if (fromObj.intervalType !== toObj.intervalType) {
    // If interval type is changed, treat as if everything except for starting date is changed
    const {startingDate: fromStartingDate, ...restFromObj} = fromObj
    const {startingDate: toStartingDate, ...restToObj} = toObj
    
    newToObj = restToObj
  } else {
    if (fromObj.primaryInterval !== toObj.primaryInterval
      || fromObj.secondaryInterval !== toObj.secondaryInterval
    ) {
      // Interval duration is changed
      newToObj.primaryInterval = toObj.primaryInterval
      newToObj.secondaryInterval = toObj.secondaryInterval
      newToObj.intervalType = toObj.intervalType
    }
    if (fromObj.intervalType === "week"
      && !_.isEqual(fromObj.weekArray, toObj.weekArray)
    ) {
      // weekArray is changed
      newToObj.weekArray = toObj.weekArray
    }
    if ((fromObj.intervalType === "month" || fromObj.intervalType === "hour")
      && fromObj.intervalOption !== toObj.intervalOption
    ) {
      // Interval option is changed
      newToObj.intervalOption = toObj.intervalOption
    }
  }

  if (fromObj.startingDate !== toObj.startingDate) {
    // Starting date is changed
    newToObj.startingDate = toObj.startingDate

  }

  // parse fromObj and newToObj
  const parseFreq = (obj) => {
    const { startingDate, intervalType, intervalOption, primaryInterval, secondaryInterval, weekArray } = obj

    let str = ""

    if (primaryInterval) {
      str += "every"

      if (primaryInterval !== 1) {
        // Repeating every 5
        str += ` ${primaryInterval}`
        // Repeating every 5 hours
        str += ` ${intervalType}s`
      } else {
        if (intervalType === 'hour' && secondaryInterval) {
          //Repeating every 1 hour (...and x minutes)
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
      str += " on "
      str += (() => {
        const weekStringArray = []
        if (weekArray[0]) weekStringArray.push("Mondays")
        if (weekArray[1]) weekStringArray.push("Tuesdays")
        if (weekArray[2]) weekStringArray.push("Wednesdays")
        if (weekArray[3]) weekStringArray.push("Thursdays")
        if (weekArray[4]) weekStringArray.push("Fridays")
        if (weekArray[5]) weekStringArray.push("Saturday")
        if (weekArray[6]) weekStringArray.push("Sundays")
        return joinWithAnd(weekStringArray).join("")
      })()
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
    console.log(str)

    if (startingDate) {
      str += " starting from "
      str += convertShortDate(new Date(startingDate))
    }

    return str
  }

  const returnString = ` the ${configName} ${of ? `of ${of}` : ''} from ${parseFreq(fromObj)} to ${parseFreq(newToObj)}`
  
  return oneLine
    ? <><span className="font-semibold">changed</span>{returnString}</>
    : <p><span className="font-semibold">Changed</span>{returnString}</p>
}


// Translate key to human readable
const parseKey = (thing) => {
  if (thing in keyDict) {
    return keyDict[thing]
  } else {
    return null
  }
}

// Translate val to human readable
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
  "businessUnit": "business unit",
  "buCode": "code",
  "buName": "name",
  "description": "description",
  "account": "account",
  "accountCode": "code",
  "accountName": "name",
  "currency": "currency",
  "accountType": "account type",
  "dataSource": "data source",
  "dataSourceType": "data source",
  "api": "API source",
  "balance": "balance",
  "basis": "basis",
  "apiCode": "code",
  "apiName": "name",
  "url" : "URL",
  "customHeaders": "custom headers",
  "critHigh": "critical high threshold",
  "acctbleHigh": "acceptable high threshold",
  "critLow": "critical low threshold",
  "acctbleLow": "acceptable low threshold",
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