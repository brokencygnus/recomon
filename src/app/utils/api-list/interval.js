// For week, weekArray = [0, 1, 0, 0, 1, 0, 0] # length 7
// For two weeks, fortnightArray = [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0] # length 7
// Else, intervalValue = 3
// For time, use hoursValue and minutesValue and leave intervalValue alone.
// Pass an object with params startingDate, intervalType, intervalValue, weekArray, fortnightArray, isSecondWeek, hoursValue, minutesValue
export const NextInterval = (paramObj) => {
  const nextDate = new Date(paramObj.startingDate)
  
  switch (paramObj.intervalType) {
    case "month-same-date": // Once every n months, same date every month, e.g. 3 May, 3 June, 3 July ... 
      nextDate.setMonth(nextDate.getMonth() + paramObj.intervalValue);
      break;

    case "month-same-day-of-week": // Once every n months, same day every month, e.g. second Tuesday of every month
      const targetDay = nextDate.getDay()
      const targetDate = nextDate.getDate()
      const targetWeek = Math.floor((targetDate - 1) / 7);
      nextDate.setMonth(nextDate.getMonth() + paramObj.intervalValue)
      nextDate.setDate(1); // Set to the first day of the month
      while (nextDate.getDay() !== targetDay) {
        nextDate.setDate(nextDate.getDate() + 1); // Set to the first (day of week) of the month
      }
      nextDate.setDate(nextDate.getDate() + targetWeek * 7) // Set to the nth (day of week) of the month
      break;

    case "two-weeks": // Select days of week that apply
      let doubledFortnightArray = paramObj.fortnightArray.concat(paramObj.fortnightArray);
      let daysToAddTwoWeeks = 0;
      for (let i = 1; i <= 14; i++) {
        const currentDay = (nextDate.getDay() + i) % 7;
        if (doubledFortnightArray[paramObj.isSecondWeek ? currentDay + 7 : currentDay] === 1) {
          daysToAddTwoWeeks = i;
          break;
        }
      }
      nextDate.setDate(nextDate.getDate() + daysToAddTwoWeeks);
      paramObj.isSecondWeek = !paramObj.isSecondWeek
      break;

    case "week": // Select days of week that apply
      let daysToAddWeek = 0;
      for (let i = 1; i <= 7; i++) {
        const currentDay = (nextDate.getDay() + i) % 7;
        if (paramObj.weekArray[currentDay] === 1) {
          daysToAddWeek = i;
          break;
        }
      }
      nextDate.setDate(nextDate.getDate() + daysToAddWeek);
      break;

    case "day-continuous": // Once every n days, continuously regardless of weeks or months
      nextDate.setDate(nextDate.getDate() + paramObj.intervalValue);
      break;

    case "time-same-time-every-day": // Once every n hours and n minutes, resets every day
      nextDate.setTime(nextDate.getTime() + (paramObj.hoursValue * 60 + paramObj.minutesValue) * 60 * 1000)
      const dayPlusOne = (new Date(startingDate)).setDate(new Date(startingDate) + 1)
      if (nextDate > dayPlusOne) {
        nextDate = dayPlusOne
      }
      break;

    case "time-continuous": // Once every n hours and n minutes, continuously regardless of day change
      nextDate.setTime(nextDate.getTime() + (paramObj.hoursValue * 60 + paramObj.minutesValue) * 60 * 1000)
      break;
  }

  return nextDate;

}

// Returns a list of next dates up until i, in the form of [nextDate, nextNextDate, nextNextNextDate ... ]
export const RecursiveNextInterval = (i, paramObj, currentData = []) => {
  if (i < 0) {
    return currentData
  }

  const nextDate = NextInterval(paramObj)
  currentData.push(nextDate)

  paramObj.startingDate = nextDate

  return RecursiveNextInterval(i - 1, paramObj, currentData)
};