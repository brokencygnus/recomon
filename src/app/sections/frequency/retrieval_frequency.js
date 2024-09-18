import { useState, createContext, useContext, useEffect } from 'react';
import { NumberInput } from '@/app/components/numberinput';
import { Dropdown } from '@/app/components/dropdown';
import { checkDataEdited } from '@/app/utils/utils';
import { DatePickerComp } from '@/app/components/datepicker'
import { TimePickerComp } from '@/app/components/timepicker'
import { RecursiveFutureNextInterval } from '@/app/utils/api-list/interval'
import { convertShortDate } from '@/app/utils/dates'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { parseDate, parseTime, getDayOfWeek, toCalendarDateTime } from '@internationalized/date';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const RetrievalFreqContext = createContext({})
  
const intervalTypes = [
  { name: "months", value: "month" },
  { name: "weeks", value: "week" },
  { name: "days", value: "day" },
  { name: "hours", value: "hour" },
]

const monthOptions = [
  { name: "On the same date of the month", value: "month-same-date"},
  { name: "On the same day of the week", value: "month-same-day-of-week"},
]

const timeOptions = [
  { name: "Starting at the same time every day", value: "time-same-time-every-day"},
  { name: "Continuously, ignoring day changes", value: "time-continuous"},
]

const weeks = [
  { name: "Mon" },
  { name: "Tue" },
  { name: "Wed" },
  { name: "Thu" },
  { name: "Fri" },
  { name: "Sat" },
  { name: "Sun" }
];

export function RetrievalFreqProvider({ retrievalSettings, defaultSettings=null, children, disabled=false, onSave }) {
  const parseState = (state) => {
    // state.startingDate: "2024-07-05T00:00whateveritonlyreadsthefirstsixteenchars"
      const stateDate = 
      state?.startingDate
      ? parseDate(state.startingDate.substring(0, 10)) 
      : undefined

    const stateTime = 
    state?.startingDate
      ? parseTime(state.startingDate.substring(11, 16)) 
      : undefined

    // Set default of [false, false, false, false, false, false, false]
    // except for the day of the startingDate, which is true
    const getDefaultDOW = () => {
      const emptyWeekArray = Array(7).fill(false)
      if (stateDate) {
        const dayOfWeek = getDayOfWeek(stateDate, 'fr-FR') % 7 ?? 0
        emptyWeekArray[dayOfWeek] = true
      } else {
        // Else returns monday
        emptyWeekArray[0] = true
      }

      return emptyWeekArray
    }

    return {
      startingDate: stateDate ?? null,
      startingTime: stateTime ?? null,
      intervalType:
        intervalTypes.find(type => type.value == state?.intervalType)
        ?? { name: "", value: undefined},
      intervalOption:
        monthOptions.find(option => option.value == state?.intervalOption)
        ?? timeOptions.find(option => option.value == state?.intervalOption)
        ?? { name: "", value: undefined},
      primaryInterval: state?.primaryInterval ?? null,
      secondaryInterval: state?.secondaryInterval ?? 0, 
      weekArray: state?.weekArray ?? getDefaultDOW(),
    }
  }

  const initialState = parseState(retrievalSettings)
  const defaultState = parseState(defaultSettings)

  const [formState, setFormState] = useState(initialState);
  const [isDataEdited, setIsDataEdited] = useState(false)

  useEffect(() => {
    setFormState(initialState)
  }, [retrievalSettings])

  const checkEdit = (updatedState) => {
    checkDataEdited(initialState, updatedState, setIsDataEdited)
  }

  const handleCancel = () => {
    setFormState(initialState)
  }

  const handleRevert = () => {
    setFormState(defaultState)
  }

  const handleSave = () => {
    // Save callback from page
    onSave()
    setIsDataEdited(false)
  }

  return (
    <div className="flex flex-col">
      <RetrievalFreqContext.Provider value={{
        isDataEdited,
        handleCancel,
        handleSave,
        handleRevert,
        defaultSettings,
        formState,
        setFormState,
        checkEdit,
        disabled
      }}>
        { children }
      </RetrievalFreqContext.Provider>
    </div>
  )
}

export function RetrievalFreqButtons() {
  const { isDataEdited, handleCancel, handleSave, handleRevert, defaultSettings, disabled } = useContext(RetrievalFreqContext)

  return (
    <div className="flex gap-x-4">
      { isDataEdited ? 
        <button
          type="button" 
          onClick={handleCancel}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
      : null}
      { defaultSettings &&
        <button
          type="button" 
          onClick={handleRevert}
          disabled={disabled}
          className={classNames(!disabled ? "bg-white hover:bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            : "bg-gray-50 text-gray-600 pointer-events-none",
            "rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm"
          )}
        >
          Revert to default
        </button>
      }
      <button
        type="button"
        onClick={handleSave}
        disabled={disabled}
        className={classNames(
          isDataEdited && !disabled ? "bg-sky-600 hover:bg-sky-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          : "bg-gray-50 text-gray-600 pointer-events-none",
          "rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm"
        )}
      >
        Save
      </button>
    </div>
  )
}


export function RetrievalFreqBody() {
  const { formState, setFormState, checkEdit, disabled } = useContext(RetrievalFreqContext)

  const [selectedMonthOption, setSelectedMonthOption] = useState({ name: "On the same date of the month", value: "month-same-date"})
  const [selectedTimeOption, setSelectedTimeOption] = useState({ name: "Starting at the same time every day", value: "time-same-time-every-day"})

  const maximum = () => {
    switch(formState.intervalType.value) {
      case "month": return 12;
      case "week": return 56;
      case "day": return 30;
      case "hour": return 23;
      default: return 100;
    }
  }

  // Time zone shenanigans
  // No longer used. Thanks Adobe Internationalized!
  // const correctTimezone = (date) => {
  //   var tzoffset = (new Date(date)).getTimezoneOffset() * 60000;
  //   return (new Date(date - tzoffset)).toISOString().slice(0, -8)
  // }

  const handleFormChange = ({ name, value }) => {
    const updatedState = {
      ...formState,
      [name]: value,
    };
    
    setFormState(updatedState)
    checkEdit(updatedState)
  }

  // Default form change, just pass the target instead of the event
  const handleDefaultFormChange = (event) => {
    handleFormChange(event.target)
  }

  const handleIntervalTypeChange = (event) => {
    const { value } = event.target
    formState.primaryInterval = formState.primaryInterval // Re-run validation
    var intervalOption = ""

    if (value.value == "month") { // Update intervalOption based on selection if applicable
      intervalOption = selectedMonthOption
    } else if (value.value == "hour") { // Expanded to prevent race condition
      intervalOption = selectedTimeOption
    } else {
      intervalOption = ""
    }

    const updatedState = {
      ...formState,
      ["intervalType"]: value,
      ["intervalOption"]: intervalOption,
    };
    
    setFormState(updatedState)
    checkEdit(updatedState)
  }

  const handleMonthOption = (event) => {
    const { value } = event.target
    handleFormChange(event.target)
    setSelectedMonthOption(value)
  }

  const handleTimeOption = (event) => {
    const { value } = event.target
    handleFormChange(event.target)
    setSelectedTimeOption(value)
  }

  const handleDayOfWeek = (event) => {
    const { value } = event.target;
    
    const newArray = [...formState.weekArray];
    newArray[value] = !newArray[value];

    handleFormChange({ name: "weekArray", value: newArray })
  }

  // No longer need this conversion thing anymore thanks to @internationalized

  // const updateTimes = (value) => {
  //   const updatedState = {
  //     ...formState,
  //     ["startingDate"]: value,
  //     ["referenceDate"]: value,
  //   };
    
  //   setFormState(updatedState)
  //   checkEdit(updatedState)
  // }

  // const handleStartingDate = (value) => {
  //   const hour = new Date(formState.startingDate).getHours()
  //   const minute = new Date(formState.startingDate).getMinutes()
  //   const newValue = new Date(value)

  //   newValue.setHours(hour)
  //   newValue.setMinutes(minute)

  //   const isoDate = newValue.toISOString()

  //   updateTimes(isoDate)
  // }

  // const handleStartingTime = (value) => {
  //   const date = new Date(formState.startingDate)
  //   date.setHours(value.hour)
  //   date.setMinutes(value.minute)

  //   const isoDate = date.toISOString()

  //   updateTimes(isoDate)
  // }

  const handleStartingDate = (value) => {
    handleFormChange({name:"startingDate", value})
  }

  const handleStartingTime = (value) => {
    handleFormChange({name:"startingTime", value})
  }

  const nextIntervals = () => {
    if (formState.startingDate && formState.startingTime) {
      let fullDate = toCalendarDateTime(formState.startingDate, formState.startingTime)
      let inputState = { ...formState, startingDate:fullDate, referenceDate:fullDate }

      return (RecursiveFutureNextInterval(6, inputState))
    } else {
      return null
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex flex-row grow items-center mt-8">
          <p className="w-56 text-sm text-gray-600">
            Repeat every
          </p>
          <div className="w-24">
            <NumberInput
              type="text"
              name="primaryInterval"
              disabled={disabled}
              value={formState.primaryInterval}
              maximum={maximum()}
              onChange={handleDefaultFormChange}
              className={classNames(disabled && "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:ring-gray-200",
                "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
              )}
            />
          </div>
          <div className="px-3">
            <Dropdown
              name='intervalType'
              disabled={disabled}
              options={intervalTypes}
              selectedOption={formState.intervalType.name}
              onSelect={handleIntervalTypeChange}
              className={classNames(disabled && "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:ring-gray-200",
                "w-24 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
              )}
            />
          </div>
          {formState.intervalType.value == "hour" ?
            <>
              <p className="text-sm text-gray-600">
                and
              </p>
              <div className="w-24 pl-3">
                <NumberInput
                  type="text"
                  name="secondaryInterval"
                  disabled={disabled}
                  value={formState.secondaryInterval}
                  maximum={59}
                  onChange={handleDefaultFormChange}
                  className={classNames(disabled && "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:ring-gray-200",
                    "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
                  )}
                />
              </div>
              <p className="mx-3 text-sm text-gray-600">
                minutes
              </p>
            </>
          : null}
        </div>
        {formState.intervalType.value == "month" ?
          <div className="flex mt-8 items-center">
            <p className="w-56 text-sm text-gray-600">
              Repeat
            </p>
            <div>
            <Dropdown
              name='intervalOption'
              disabled={disabled}
              options={monthOptions}
              selectedOption={selectedMonthOption.name}
              onSelect={handleMonthOption}
              className={classNames(disabled && "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:ring-gray-200",
                "w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
              )}
            />
            </div>
          </div>
        : null}
        {formState.intervalType.value == "hour" ?
          <div className="flex mt-8 items-center">
            <p className="w-56 text-sm text-gray-600">
              Repeat
            </p>
            <div>
              <Dropdown
                name='intervalOption'
                disabled={disabled}
                options={timeOptions}
                selectedOption={selectedTimeOption.name}
                onSelect={handleTimeOption}
                className={classNames(disabled && "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:ring-gray-200",
                  "w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
                )}
              />
            </div>
          </div>
        : null} 
        {formState.intervalType.value == "week" ?
          <div className="flex mt-8 items-center">
            <p className="w-56 text-sm text-gray-600">
              Repeat on the following days:
            </p>
            <div className="flex gap-x-2">
              {weeks.map((dayofweek, index) => (
                <button
                  key={index}
                  type="button"
                  value={index}
                  disabled={disabled}
                  onClick={handleDayOfWeek}
                  className={classNames(
                    disabled && "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:ring-gray-200",
                    "ring-inset", formState.weekArray[index] ? "ring-1 ring-sky-700 text-sky-700" : "ring-1 ring-gray-300 text-gray-700",
                    "w-12 rounded-lg bg-white px-2.5 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
                  )}
                    >
                  {dayofweek.name}
                </button>
              ))}
            </div>
          </div>
        : null}

      </div>
      <div className="flex items-center mt-8">
        <p className="w-56 text-sm text-gray-600">
          Starting from
        </p>
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <DatePickerComp
            isDisabled={disabled}
            value={formState.startingDate}
            onChange={handleStartingDate}
            className={classNames(disabled ? "cursor-not-allowed bg-gray-50 text-gray-600 ring-gray-200" : "text-gray-900 bg-white ring-gray-300",
              "block w-44 rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 sm:text-sm sm:leading-6"
            )}
          />
        </div>
        <div className="relative rounded-md shadow-sm ml-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <TimePickerComp
            isDisabled={disabled}
            value={formState.startingTime}
            onChange={handleStartingTime}
            className={classNames(disabled ? "cursor-not-allowed bg-gray-50 text-gray-600 ring-gray-200" : "text-gray-900 bg-white ring-gray-300",
              "block w-36 rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 sm:text-sm sm:leading-6"
            )}
          />
        </div>
      </div>

      <div className="flex items-start mt-8">
        <p className="w-56 shrink-0 text-sm text-nowrap text-gray-600">
          Next schedules
        </p>
        <div className="flex text-sm text-gray-400 pr-3">
          {formState.intervalType.value === "week" && !formState.weekArray.some(w => w) ?
            <p className="text-nowrap text-red-400">Please select at least one day of the week.</p>
          : !nextIntervals() ?
              <p className="text-nowrap">
                Fill out the above information to calculate the next schedules.
              </p>
            :
              <div className="flex flex-wrap gap-x-3">
                {nextIntervals().map((nextDate, index) => (
                  <p className="text-nowrap">
                    {convertShortDate(nextDate)}
                    {index == 5 ? "" : ","}
                  </p>
                ))}
              </div>
          }
        </div>
      </div>

{/* debug */}
{/* {JSON.stringify(formState)} */}
    </div>
  )
}