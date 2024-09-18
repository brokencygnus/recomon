// Input and output dates are guard-claused by undefined
//
// For week, weekArray = [0, 1, 0, 0, 1, 0, 0] # length 7
// Else, primaryInterval = 3 # integer
// For time, use primaryInterval and secondaryInterval for hours and minutes

import { config } from "@/app/constants/config"

// Pass an object with params startingDate, intervalType, intervalOption, primaryInterval, weekArray, secondaryInterval
export const NextInterval = (paramObj) => {
  if (!paramObj.startingDate || !paramObj.primaryInterval){
    return undefined
  }

  if (!paramObj.secondaryInterval) {
    paramObj.secondaryInterval = 0
  }

  var nextDate = new Date(limitYear(paramObj.startingDate))

  switch (paramObj.intervalType.value) {
    case "month":
      switch (paramObj.intervalOption.value) {
        case "month-same-date": // Once every n months, same date every month, e.g. 3 May, 3 June, 3 July ... 
          nextDate.setMonth(nextDate.getMonth() + paramObj.primaryInterval)
          break
    
        case "month-same-day-of-week": // Once every n months, same day every month, e.g. second Tuesday of every month
          const targetDay = nextDate.getDay()
          const targetDate = nextDate.getDate()
          const targetWeek = Math.floor((targetDate - 1) / 7)
          nextDate.setMonth(nextDate.getMonth() + paramObj.primaryInterval)
          nextDate.setDate(1) // Set to the first day of the month
          while (nextDate.getDay() !== targetDay) {
            nextDate.setDate(nextDate.getDate() + 1) // Set to the first (day of week) of the month
          }
          nextDate.setDate(nextDate.getDate() + targetWeek * 7) // Set to the nth (day of week) of the month
          break
      }
      break

    case "week": // Select days of week that apply
      let daysToAdd = 0
      let weeksToAdd = 0
      for (let i = 0; i < 7; i++) {
        const currentDay = (nextDate.getDay() + i) % 7
        if (paramObj.weekArray[currentDay] === true) {
          if (currentDay <= nextDate.getDay()) { // Check if the week has changed
            weeksToAdd = (paramObj.primaryInterval - 1) * 7
          }
          daysToAdd = i + 1 + weeksToAdd
          break
        }
      }
      nextDate.setDate(nextDate.getDate() + daysToAdd)
      break

    case "day": // Once every n days, continuously regardless of weeks or months
      nextDate.setDate(nextDate.getDate() + paramObj.primaryInterval)
      break

    case "hour":
      switch (paramObj.intervalOption.value) {
        case "time-same-time-every-day": // Once every n hours and n minutes, resets every day
          const previousDate = new Date(paramObj.startingDate)
          // referenceDate is not mutated during recursion
          const referenceDate = new Date(paramObj.referenceDate)

          // Set reference day, month, and years based on current date
          referenceDate.setUTCFullYear(previousDate.getUTCFullYear())
          referenceDate.setMonth(previousDate.getMonth())
          referenceDate.setDate(previousDate.getDate())

          nextDate.setTime(nextDate.getTime() + (paramObj.primaryInterval * 60 + paramObj.secondaryInterval) * 60 * 1000)

          // If time addition causes nextDate to surpass referenceTime, reset the time
          if (previousDate < referenceDate && nextDate > referenceDate) {
            nextDate.setTime(referenceDate)
          }
          break
    
        case "time-continuous": // Once every n hours and n minutes, continuously regardless of day change
          nextDate.setTime(nextDate.getTime() + (paramObj.primaryInterval * 60 + paramObj.secondaryInterval) * 60 * 1000)
          break
      }
      break
  }
  return nextDate
  // Too complicated to implement in UI
  //
  // case "two-weeks": // Select days of week that apply
  //   let doubledFortnightArray = paramObj.fortnightArray.concat(paramObj.fortnightArray)
  //   let daysToAddTwoWeeks = 0
  //   for (let i = 1; i <= 14; i++) {
  //     const currentDay = (nextDate.getDay() + i) % 7
  //     if (doubledFortnightArray[paramObj.isSecondWeek ? currentDay + 7 : currentDay] === 1) {
  //       daysToAddTwoWeeks = i
  //       break
  //     }
  //   }
  //   nextDate.setDate(nextDate.getDate() + daysToAddTwoWeeks)
  //   paramObj.isSecondWeek = !paramObj.isSecondWeek
  //   break
}

// Returns a list of next dates up until i, in the form of [nextDate, nextNextDate, nextNextNextDate ... ]
export const RecursiveNextInterval = (i, paramObj, currentData = []) => {
  if (i <= 0) {
    return currentData
  }

  const nextDate = NextInterval(paramObj)

  if (nextDate === undefined) {
    return undefined
  }

  currentData.push(nextDate)

  const newParamObj = {
    ...paramObj,
    ["startingDate"]: nextDate,
  }

  return RecursiveNextInterval(i - 1, newParamObj, currentData)
}

// Filters based on future dates only
export const RecursiveFutureNextInterval = (i, paramObj, currentData = []) => {
  if (i <= 0) {
    return currentData
  }

  const now = new Date()
  let nextDate = new Date(limitYear(paramObj.startingDate))
  let newParamObj = {
    ...paramObj,
    ["startingDate"]: nextDate,
  }

  while (nextDate < now) {
    nextDate = NextInterval(newParamObj)
    newParamObj = {
      ...paramObj,
      ["startingDate"]: nextDate,
    }
  }

  if (nextDate === undefined) {
    return undefined
  }

  currentData.push(nextDate)

  return RecursiveNextInterval(i - 1, newParamObj, currentData)
}

// Apparently Adobe didn't bother to set a minimum and maximum on the Date Input, only the Calendar
// So here we go writing a limit function by ourselves
const limitYear = (dateString) => {
  if (!dateString) {return dateString}
  const date = new Date(dateString)

  date.setUTCFullYear(Math.min(config.maxYear, date.getUTCFullYear()))
  date.setUTCFullYear(Math.max(config.minYear, date.getUTCFullYear()))
  return date
}