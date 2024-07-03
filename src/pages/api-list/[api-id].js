import { useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { TestConnectionDetails } from '@/app/components/api-list/testconnection';
import { NumberInput } from '@/app/components/numberinput';
import { Dropdown } from '@/app/components/dropdown';
import { checkDataEdited } from '@/app/utils/utils';
import { DatePickerComp } from '@/app/components/datepicker'
import { TimePickerComp } from '@/app/components/timepicker'
import { RecursiveFutureNextInterval } from '@/app/utils/api-list/interval'
import { convertShortDate } from '@/app/utils/dates'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { ToastContext } from '@/app/components/toast';

const LastConnectionDetails = dynamic(() => import('@/app/components/api-list/testconnection').then(mod => mod.LastConnectionDetails), { ssr: false });

// mock data start

import { APIs } from '@/app/constants/mockdata/mockdata';
import { accountsUsingAPI, apiRetrievalSettings } from '@/app/constants/mockdata/api-list_mockdata';

// mock data end

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function APIPage() {
  const breadcrumbPages = [
    { name: 'Manage APIs', href: '#', current: true },
    { name: 'Endpoint Details', href: '#', current: true },
  ]

  const [isEdit, setIsEdit] = useState(false);

  return (
    <Layout currentTab="api">
      <main className="relative flex flex-rows">
        <div
          style={{ scrollbarGutter: "stable" }}
          className="h-screen w-full overflow-y-auto -mt-16 pt-[6.5rem] py-10"
        >
          <div className="w-3/5 pb-16 px-12 2xl:px-16">
            <Breadcrumbs breadcrumbPages={breadcrumbPages} />
            <APIDetailsHeader
              isEdit={isEdit}
              setIsEdit={setIsEdit}
            />
            <APIDetailsContent
              APIData={APIs[0]}
              isEdit={isEdit}
            />
          </div>
        </div>
        <aside className="absolute inset-y-0 w-2/5 right-0 h-screen -mt-16 flex flex-col block gap-y-6 overflow-y-scroll bg-gray-100 border-l border-gray-200 px-4 pt-[6.5rem] pb-16 xl:px-8">
          <LastRetrievalCard APIData={APIs[0]} />
          <AccountListCard />
        </aside>
      </main>
    </Layout>
  )
}
  
function APIDetailsHeader({ isEdit, setIsEdit }) {
  const { addToast } = useContext(ToastContext)
  const launchToast = () => {
    addToast({ color: "green", message: "Endpoint details edited!" })
  }
  
  const handleSave = () => {
    launchToast()
    setIsEdit(false)
    // Enter save logic here
  }

  return (
    <div className="flex items-center mb-4">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Endpoint Details</h1>
            </div>
          </header>
        </div>
      </div>
        <div className="flex items-end">
          {isEdit ? (
            <div className="flex justify-end gap-x-3">
              <button
                type="button"
                onClick={() => setIsEdit(false)}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSave}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEdit(true)}
              className="ml-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              Edit
            </button>
          )}
        </div>
    </div>
  );
}


function APIDetailsContent({ APIData, isEdit }) {

  return (
    <div>
      <EditEndpoint
        APIData={APIData}
        isEdit={isEdit}
      />
      <div className="border-b border-gray-900/10 py-12">
        <TestConnectionDetails item={APIs[0]}/>
      </div>
      <div className="py-12">
        <RetrievalFreq retrievalSettings={apiRetrievalSettings}/>
      </div>
      {/* debug */}
      {/* {JSON.stringify(formState)} */}
    </div>
  )
}

function EditEndpoint({ APIData, isEdit }) {
  const [formState, setFormState] = useState({
    "code": APIData?.code ?? '',
    "api-name": APIData?.name ?? '',
    "url": APIData?.url.replace(/^https?:\/\//, '') ?? '',
    "custom-headers": JSON.stringify(JSON.parse(APIData?.custom_headers), null, 2) ?? '',
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleHeaderChange = (event) => {
    const { name, value } = event.target;
    let processedValue = ""

    try {
      processedValue = JSON.stringify(JSON.parse(value), null, 2)
    } catch (error) {
      processedValue = value
    }

    setFormState((prevState) => ({
      ...prevState,
      [name]: processedValue,
    }));
  };

  return (
    <form id="edit-endpoint-form">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          {/* <h2 className="text-base font-semibold leading-7 text-gray-900">API Details</h2>
          <p className="mt-1 mb-10 text-sm leading-6 text-gray-600">
            Description for API Details.
          </p> */}

          <div className="grid grid-cols-4 gap-x-4 gap-y-6">
            <div className="flex grid grid-cols-5 col-span-4 gap-x-6 ">
              <div className="col-span-1">
                <p className="block text-sm font-medium leading-6 text-gray-900">
                  Code
                </p>
                {isEdit ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      name="code"
                      value={formState["code"]}
                      onChange={handleFormChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6"
                      placeholder="A001"
                    />
                  </div>
                ) : (
                  <p className="mt-2 py-1.5 text-gray-500">{APIData?.code}</p>
                )}
              </div>

              <div className="col-span-4">
                <p className="block text-sm font-medium leading-6 text-gray-900">
                  API name
                </p>
                {isEdit ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      name="api-name"
                      value={formState["api-name"]}
                      onChange={handleFormChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6"
                      placeholder="My API"
                    />
                  </div>
                ) : (
                  <p className="mt-2 py-1.5 text-gray-500">{APIData?.name}</p>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <p className="block text-sm font-medium leading-6 text-gray-900">
                URL
              </p>
                {isEdit ? (
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <span className="flex select-none items-center pl-3 text-gray-500">https://</span>
                      <input
                        type="url"
                        name="url"
                        value={formState["url"]}
                        onChange={handleFormChange}
                        autoComplete="url"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 leading-6"
                      />
                    </div>
                </div>
                ) : (
                  <p className="mt-2 py-1.5 text-wrap break-all text-gray-500">{APIData?.url}</p>
                )}
            </div>

            <div className="col-span-full">
              <p className="block text-sm font-medium leading-6 text-gray-900">
                Custom headers &#40;optional&#41;
              </p>
              {isEdit ? (
                <>
                  <div className="mt-2 font-mono text-wrap break-all max-h-[8.5rem]">
                    <textarea
                      name="custom-headers"
                      value={formState["custom-headers"]}
                      onChange={handleHeaderChange}
                      style={{ maxHeight: "136px", resize: "none" }}
                      rows={6}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"
                      placeholder={`{
"Authorization": "Bearer token",
"Content-Type": "application/json"
}` /* Please don't "fix" the indentation, this is a template literal */}
                      />
                  </div>
                </>
              ) : (
                <div className="mt-2 rounded-md bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300">
                  <p 
                    className="px-3 py-1.5 text-sm font-mono text-wrap break-all text-gray-900 max-h-[8.5rem] leading-6 overflow-y-auto" 
                    dangerouslySetInnerHTML={{ __html:
                      JSON.stringify(JSON.parse(APIData?.custom_headers), null, 2)
                      .replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;') }} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}


function RetrievalFreq({ retrievalSettings }) {
  const getDefaultDOW = () => {
    const emptyWeekArray = Array(7).fill(false)

      const dayOfWeek = ((new Date(retrievalSettings?.startingDate)).getDay() - 1) % 7 ?? 0
      emptyWeekArray[dayOfWeek] = true

    return emptyWeekArray
  }

  const initialState = {
    startingDate: new Date(retrievalSettings?.startingDate?? undefined), // Will be mutated
    referenceDate: new Date(retrievalSettings?.startingDate?? undefined), // Will not be mutated
    intervalType: retrievalSettings?.intervalType?? { name: "", value: undefined},
    intervalOption: retrievalSettings?.intervalOption?? { name: "", value: undefined},
    primaryInterval: retrievalSettings?.primaryInterval?? 1,
    secondaryInterval: retrievalSettings?.secondaryInterval?? 0, 
    weekArray: retrievalSettings?.weekArray?? getDefaultDOW(),
  }

  const [formState, setFormState] = useState(initialState);

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

  const [isDataEdited, setIsDataEdited] = useState(false)
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
  const correctTimezone = (date) => {
    var tzoffset = (new Date(date)).getTimezoneOffset() * 60000;
    return (new Date(date - tzoffset)).toISOString().slice(0, -8)
  }

  const handleFormChange = ({ name, value }) => {
    const updatedState = {
      ...formState,
      [name]: value,
    };
    
    setFormState(updatedState)
    checkDataEdited(initialState, updatedState, setIsDataEdited)
  }

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
    checkDataEdited(initialState, updatedState. setIsDataEdited)
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

  const updateTimes = (value) => {
    const updatedState = {
      ...formState,
      ["startingDate"]: value,
      ["referenceDate"]: value,
    };
    
    setFormState(updatedState)
    checkDataEdited(initialState, updatedState, setIsDataEdited)
  }

  const handleStartingDate = (value) => {
    const hour = formState.startingDate.getHours()
    const minute = formState.startingDate.getMinutes()
    const newValue = new Date(value)

    newValue.setHours(hour)
    newValue.setMinutes(minute)

    updateTimes(newValue)
  }

  const handleStartingTime = (value) => {
    const date = new Date(formState.startingDate)
    date.setHours(value.hour)
    date.setMinutes(value.minute)

    updateTimes(date)
  }

  const { addToast } = useContext(ToastContext)
  const launchToast = () => {
    addToast({ color: "green", message: "Retrieval configuration saved!" })
  }

  const handleCancel = () => {
    setFormState(initialState)
  }

  const handleSave = () => {
    launchToast()
    setIsDataEdited(false)
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div>
          <h3 className="text-base font-semibold leading-6 text-gray-900">Retrieval Frequency</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>
                Adjust how often to retrieve data from your API.
              </p>
            </div>
        </div>
        <div>
          { isDataEdited ? 
            <button
              type="button" 
              onClick={handleCancel}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
          : null}
          <button
            type="button"
            onClick={handleSave}
            className={classNames(
              isDataEdited ? "bg-indigo-600 hover:bg-indigo-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              : "bg-gray-300 text-gray-500 pointer-events-none",
              "ml-4 rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm"
            )}
            >
            Save
          </button>
        </div>
      </div>

      <div className="flex flex-col 3xl:flex-row">
        <div className="flex flex-row grow items-center pt-8">
          <p className="text-sm text-gray-600">
            Repeat every
          </p>
          <div className="w-24 pl-3">
            <NumberInput
              type="text"
              name="primaryInterval"
              value={formState.primaryInterval}
              maximum={maximum()}
              onChange={handleDefaultFormChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6"
            />
          </div>
          <div className="px-3">
            <Dropdown
              name='intervalType'
              options={intervalTypes}
              selectedOption={formState.intervalType.name}
              onSelect={handleIntervalTypeChange}
              className="w-24 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                  value={formState.secondaryInterval}
                  maximum={59}
                  onChange={handleDefaultFormChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6"
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
            <p className="mr-3 text-sm text-gray-600">
              Repeat
            </p>
            <div>
            <Dropdown
              name='intervalOption'
              options={monthOptions}
              selectedOption={selectedMonthOption.name}
              onSelect={handleMonthOption}
              className="w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            />
            </div>
          </div>
        : null}
        {formState.intervalType.value == "hour" ?
          <div className="flex mt-8 items-center">
            <p className="mr-3 text-sm text-gray-600">
              Repeat
            </p>
            <div>
              <Dropdown
                name='intervalOption'
                options={timeOptions}
                selectedOption={selectedTimeOption.name}
                onSelect={handleTimeOption}
                className="w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              />
            </div>
          </div>
        : null} 
        {formState.intervalType.value == "week" ?
          <div className="flex mt-8 items-center">
            <p className="mr-3 text-sm text-gray-600">
              Repeat on the following days:
            </p>
            <div className="flex gap-x-2">
              {weeks.map((dayofweek, index) => (
                <button
                  key={index}
                  type="button"
                  value={index}
                  onClick={handleDayOfWeek}
                  className={classNames(
                    "ring-inset", formState.weekArray[index] ? "ring-1 ring-indigo-600 text-indigo-600" : "ring-1 ring-gray-300 text-gray-900",
                    "w-12 rounded-full bg-white px-2.5 py-1.5 text-sm font-semibold shadow-sm hover:bg-gray-50"
                  )}
                    >
                  {dayofweek.name}
                </button>
              ))}
            </div>
          </div>
        : null}

      </div>
      <div className="flex items-center mt-8 gap-x-3">
        <p className="text-sm text-gray-600">
          Starting from
        </p>
        <div className="relative rounded-md shadow-sm">
          {/* TODO add max and min dates because changing the year causes it to freeze due to recursive calculations */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <DatePickerComp
            name="startingDate"
            id="startingDate"
            value={correctTimezone(formState.referenceDate).slice(0, -6)}
            onChange={handleStartingDate}
            className="block w-44 rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <TimePickerComp
            name="startingTime"
            id="startingTime"
            value={correctTimezone(formState.referenceDate).slice(11, 16)}
            onChange={handleStartingTime}
            className="block w-36 rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="flex items-start mt-8">
        <p className="text-sm text-nowrap text-gray-600">
          Next retrievals:
        </p>
        <div className="flex flex-wrap text-sm text-gray-400 pr-3">
          {formState.intervalType.value === "week" && !formState.weekArray.some(w => w) ?
          <p className="text-nowrap pl-3 text-red-400">Please select at least one day of the week.</p>
          : (RecursiveFutureNextInterval(6, formState)).map((nextDate, index) => (
            <p className="text-nowrap pl-3">
              {convertShortDate(nextDate)}
              {index == 5 ? "" : ","}
            </p>
          ))
          }
        </div>
      </div>

{/* debug */}
{/* {JSON.stringify(formState)} */}
    </div>
  )
}

function Card({ children }) {
  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="px-8 py-8">
        {children}
      </div>
    </div>
  )
}


function LastRetrievalCard({ APIData }) {
  return (
    <Card>
      <LastConnectionDetails item={APIData}/>
    </Card>
  )
}


function AccountListCard() {
  return (
    <Card>
      <h3 className="text-base font-semibold leading-6 text-gray-900">Accounts</h3>
      <div className="mt-2 text-sm text-gray-500">
        <p>
          A list of accounts that are currently using this endpoint as their data source.
        </p>
      </div>
      {accountsUsingAPI.some((businessUnit) => (businessUnit.accounts.some(account => !account.detected))) ? 
        <div className="flex rounded-md bg-red-50 p-4 mt-4">
          <div className="flex flex-shrink-0 items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <p className="ml-3 text-sm text-red-700">
            Some of your accounts were assigned to this endpoint, but their account codes were not detected. Check your configurations.
          </p>
        </div>
      : null}
      {accountsUsingAPI.map((businessUnit) => (
        <div key={businessUnit.business_unit}>
          <div className="mt-8 mb-4">
            <div className="flex items-center">
              <div className="flex-auto">
                <h1 className="text-sm font-semibold leading-6 text-gray-900">{businessUnit.business_unit}</h1>
              </div>
            </div>
          </div>
          <div className="px-2 mt-4 mb-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-700">
                        Code
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                        Account Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                        Currency
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {businessUnit.accounts.map((account) => (
                      <tr key={account.code} className="hover:bg-gray-50">
                        <td
                          className={classNames((account.detected ? "text-gray-500" : "font-medium text-red-500"),
                            "whitespace-nowrap py-4 pl-1 pr-3 text-sm")}
                        >
                          {account.code}
                        </td>
                        <td
                          className={classNames((account.detected ? "text-gray-600" : "text-red-500"),
                            "whitespace-nowrap px-3 py-4 text-sm font-medium")}
                        >
                          {account.name}
                          </td>
                        <td
                          className={classNames((account.detected ? "text-gray-500" : "font-medium text-red-500"),
                            "whitespace-nowrap px-3 py-4 text-sm")}
                        >
                          {account.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Card>
  )
}