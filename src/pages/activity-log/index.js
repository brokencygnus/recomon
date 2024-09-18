import { useRouter } from 'next/router';
import { useState, useContext, useEffect, createContext } from 'react';
import Layout from '@/app/components/layout';
import { DateRangePickerComp } from '@/app/components/datepicker'
import { convertAgeMsToDateTime } from '@/app/utils/dates'
import { SearchFilter, HighlightSearch } from '@/app/utils/highlight_search';
import ClientOnly from '@/app/components/csr'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { activity } from '@/app/utils/activity-log/activity';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// mock data start

import { activityLogs } from '@/app/constants/mockdata/activity_log_mockdata'

// mock data end

const ActivityLogContext = createContext({})

export default function ActivityLogPage() {
  const router = useRouter()
  const { pathname } = router;
  const query = { ...router.query };

  const breadcrumbPages = [
    { name: 'Activity Log', href: '#', current: true },
  ]

  const [filteredActivityLogs, setFilteredActivityLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState([]);
  const [dateRange, setDateRange] = useState(null);

  const resetRouter = () => {
    router.replace({
      pathname: '/activity-log',
    }, 
      undefined,
      { shallow: true }
    );
  }

  const handleSearchChange = (event) => {
    resetRouter()

    const { value } = event.target
    const searchArray = value.split(" ")
    setSearchTerm(searchArray)
  }

  const handleResetFilters = () => {
    resetRouter()
    // TODO set default date range based on API later
    setDateRange(null)
    setSearchTerm([])
  }

  const doFilter = () => {
    let tempFilteredActivityLogs = activityLogs.filter(activity => SearchFilter(activity.buName, searchTerm) || SearchFilter(activity.buCode, searchTerm))

    if (dateRange) {
      const startDate = new Date(dateRange.start.year, dateRange.start.month - 1, dateRange.start.day)
      // End date should be included (e.g. when filtering for day 21, include activities on day 21)
      const endDate = new Date(dateRange.end.year, dateRange.end.month - 1, dateRange.end.day + 1)
      
      // Mockdata only
      const startDateAgoMS = startDate.getTime() - (new Date()).getTime()
      const endDateAgoMS = endDate.getTime() - (new Date()).getTime()

      tempFilteredActivityLogs = tempFilteredActivityLogs.filter(activity => (activity.ageMS > startDateAgoMS && activity.ageMS < endDateAgoMS))
    }

    setFilteredActivityLogs(tempFilteredActivityLogs)
  }

  useEffect(() => {
    if (!query["business-unit"]) {
      doFilter()
    }
  }, [activityLogs, searchTerm, dateRange])

  return (
      <Layout currentTab='log' breadcrumbPages={breadcrumbPages}>
        <ActivityLogContext.Provider value={{ searchTerm, dateRange, filteredActivityLogs }}>
          <main>
            <div className="pt-6 px-12 2xl:px-16">
              <ActivityLogHeader />
            </div>
            <div className="sticky top-0 bg-white px-12 2xl:px-16">
              <ActivityLogFilter
                handleSearchChange={handleSearchChange}
                handleDateRangeChange={setDateRange}
                handleResetFilters={handleResetFilters}
              />
            </div>
            <div className="pb-10 px-12 2xl:px-16">
              <ActivityLogTable />
            </div>
          </main>
        </ActivityLogContext.Provider>
      </Layout>
    )
  }
  
function ActivityLogHeader() {
  return (
    <div className="flex items-center">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Activity Log</h1>
              <p className="mt-2 text-sm text-gray-700">Lists every action a user has taken in your organization.</p>
            </div>
          </header>
        </div>
      </div>
      <div className="flex items-end">
      {/* Buttons etc. go here */}
      </div>
    </div>
  );
}

function ActivityLogTable() {
  const { searchTerm, filteredActivityLogs } = useContext(ActivityLogContext)
  
  const renderActivity = (log) => {
    const category = activity[log.eventCategory]
    const action = category[log.eventName]
    return action({ ...log.details, oneLine:false});
  };
  
  return (
    <div className="mt-8 flow-root">
      <div className="-my-2 overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="table-fixed min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="max-w-full">
                <th scope="col" className="min-w-56 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 border-b border-gray-300">
                  Date
                </th>
                <th scope="col" className="min-w-56 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">
                  Business unit
                </th>
                <th scope="col" className="min-w-56 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">
                  User
                </th>
                <th scope="col" className="w-full px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredActivityLogs.map((log) => (
                <tr key={log.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                    <ClientOnly>
                      {convertAgeMsToDateTime(log.ageMS)}
                    </ClientOnly>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{HighlightSearch(log.buCode, searchTerm, {highlight: "bg-sky-300"})} {HighlightSearch(log.buName, searchTerm, {highlight: "bg-sky-300"})}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{log.userName}</td>
                  <td className="w-24 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="text-wrap">{renderActivity(log)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


function ActivityLogFilter({ handleSearchChange, handleDateRangeChange, handleResetFilters }) {
  const { searchTerm, dateRange } = useContext(ActivityLogContext)

  return (
    <div className="flex justify-between">
      <div className="flex flex-row items-end my-2 gap-x-3">
        <form className="flex rounded-md w-fit h-9 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6">
          <input
            id="search-business-units"
            className="border-0 py-0 px-0 mx-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search business unit"
            value={searchTerm.join(" ")}
            onChange={handleSearchChange}
            type="text"
            name="search"
          />
          <MagnifyingGlassIcon
            className="pointer-events-none w-5 mx-2 text-gray-400"
            aria-hidden="true"
          />
        </form>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <DateRangePickerComp
              className="block w-72 rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 sm:text-sm sm:leading-6"
              value={dateRange}
              onChange={handleDateRangeChange}
            />
          </div>
        <div>
          <button
            type="button"
            className="h-10 rounded px-2 py-1 text-sm font-semibold text-sky-600"
            onClick={handleResetFilters}
          >
            Reset filters
          </button>
        </div>
      </div>
    </div>
  )
}