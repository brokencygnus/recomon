import { useRouter } from 'next/router';
import { useState, useEffect, createContext, useContext } from 'react';
import Layout, { RefCurContext, convertedCurrency } from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { snapshotBusinessUnits, discrAlertConf } from '@/app/constants/mockdata/snapshot_mockdata';
import { quantizeDates } from '@/app/utils/dates'
import { convertDateOnly, convertTimeOnly } from '@/app/utils/dates'
import { discrepancyColor } from '@/app/utils/business-units/discrepancy-color'
import { DateRangePickerComp } from '@/app/components/datepicker'
import { NotificationBadges } from '@/app/components/notifications/notification_badges'
import { SearchFilter } from '@/app/utils/highlight_search';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { CameraIcon } from '@heroicons/react/16/solid';
import { config } from '@/app/constants/config'
import { Dropdown } from '@/app/components/dropdown';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const SnapshotContext = createContext({});

export default function SnapshotPage() {
  const router = useRouter()
  const { pathname } = router;
  const query = { ...router.query };

  const breadcrumbPages = [
    { name: 'Snapshots', href: '#', current: true },
  ]

  const [filteredSnapshots, setFilteredSnapshots] = useState(snapshotBusinessUnits);
  const [searchTerm, setSearchTerm] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [displayType, setDisplayType] = useState({ name:"Nominal", value: "nominal" })

  const resetRouter = () => {
    router.replace({
      pathname: '/snapshots',
    }, 
      undefined,
      { shallow: true }
    );
  }

  const handleDisplayType = ({ target: {value} }) => {
    setDisplayType(value)
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
    let tempFilteredSnapshots = snapshotBusinessUnits.filter(bu => SearchFilter(bu.name, searchTerm))

    if (dateRange) {
      const startDate = new Date(dateRange.start.year, dateRange.start.month - 1, dateRange.start.day)
      // End date should be included (e.g. when filtering for day 21, include snapshots on day 21)
      const endDate = new Date(dateRange.end.year, dateRange.end.month - 1, dateRange.end.day + 1)
      
      tempFilteredSnapshots = tempFilteredSnapshots.map(bu => {
        const filteredSnapshots = bu.snapshots.filter(snapshot => {
          const date = new Date(snapshot.date)
          return date < endDate && date > startDate
        })
        return {
          ...bu,
          snapshots: filteredSnapshots
        }
      })
    }

    setFilteredSnapshots(tempFilteredSnapshots)
  }

  useEffect(() => {
    if (!query["business-unit"]) {
      doFilter()
    }
  }, [snapshotBusinessUnits, searchTerm, dateRange])

  // Prevent race condition when page is loaded but router query is still undefined
  useEffect(() => {
    if (query["business-unit"]) {
      if (searchTerm[0] !== query["business-unit"]) {
        setSearchTerm([query["business-unit"]])
        setFilteredSnapshots(() => {
          let data = [snapshotBusinessUnits.find(bu => bu.slug == query["business-unit"])]
      
          if (!data) {
            data = snapshotBusinessUnits
          }
      
          return data
        })
      }
    } else {
      doFilter()
    }
  }, [router.query["business-unit"]])

  const [translate, setTranslate] = useState(0)

  const sizeFactor = filteredSnapshots.length + 2

  const allTimes = () => {
    const allTimesResult = []
    filteredSnapshots.forEach(bu => {
      bu?.snapshots.forEach(snapshot => {
        const time = new Date(snapshot.date)
        allTimesResult.push(time)
      })
    })

    return quantizeDates(allTimesResult)
  }

  return (
      <Layout currentTab="snap" breadcrumbPages={breadcrumbPages}>
        <SnapshotContext.Provider value={{ allTimes, filteredSnapshots, sizeFactor, translate, setTranslate, displayType, searchTerm, dateRange}}>
          <main className="relative min-h-full">
            <div className="pt-6 px-12 2xl:px-16">
              <SnapshotHeader />
            </div>
            
            <div className="sticky top-0 bg-white px-12 2xl:px-16 z-[3]">
              <SnapshotFilter 
                handleSearchChange={handleSearchChange}
                handleDateRangeChange={setDateRange}
                handleResetFilters={handleResetFilters}
                handleDisplayType={handleDisplayType}
              />
            </div>
            <div className="sticky top-6 bg-white z-[1] w-full h-10"></div>
            <div className="sticky top-16 bg-white z-[2]">
              <div className="px-12 2xl:px-16 overflow-hidden">
                <SnapshotCarousel />
              </div>
              <div className="w-full h-4 bg-white border-b border-1 z-10 shadow-md"></div>
            </div>
            {/* <div className="sticky top-[5.5rem] w-full h-10 bg-white z-[1] shadow-md"></div> */}
            <div className="px-12 2xl:px-16 bg-gray-100 overflow-hidden">
              <SnapshotTable />
            </div>
            <div className="h-16 sticky bottom-0 pointer-events-none bg-gradient-to-t from-white to-transparent"></div>
          </main>
        </SnapshotContext.Provider>
      </Layout>
    )
  }
  
function SnapshotHeader() {
  return (
    <div className="flex items-center">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Snapshots</h1>
              <p className="mt-2 text-sm text-gray-700">Snapshots are periodic captures of your business units' data at a given date and time.</p>
            </div>
          </header>
        </div>
      </div>
      <div className="flex items-end">
        {/* buttons go here later */}
      </div>
    </div>
  );
}

function SnapshotFilter({ handleSearchChange, handleDateRangeChange, handleResetFilters, handleDisplayType }) {
  const { searchTerm, dateRange, displayType } = useContext(SnapshotContext)

  const displayTypeOptions = [
    { name:"Nominal", value: "nominal" },
    { name:"% capital", value: "percent" },
  ]

  return (
    <div className="flex justify-between items-end">
      <div className="flex flex-row items-center mt-3 gap-x-3">
        <div className="flex rounded-md w-fit h-9 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6">
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
        </div>
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
            className="h-10 rounded px-2 py-1 text-sm font-semibold text-sky-600 hover:text-sky-900"
            onClick={handleResetFilters}
          >
            Reset filters
          </button>
        </div>
      </div>
        <div className="flex items-center gap-x-3 mt-3">
          <p className="text-sm text-gray-500">Display gap as</p>
          <Dropdown
            name='intervalType'
            options={displayTypeOptions}
            selectedOption={displayType.name}
            onSelect={handleDisplayType}
            className="w-36 rounded-md text-sm bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          />
          <a
            href='/settings?menu=snapshot-freq'
            className="h-10 flex items-center rounded px-2 py-1 text-sm font-semibold text-sky-600 hover:text-sky-900"
          >
            Configure snapshots
          </a>
        </div>
    </div>
  )
}

function SnapshotCarousel() {
  const { filteredSnapshots, sizeFactor, translate, setTranslate } = useContext(SnapshotContext)
  
  // 3 is the number of business units displayed at the same time
  const minTranslate = 0
  const maxTranslate = filteredSnapshots.length - Math.min(filteredSnapshots.length, 3)

  const canTranslateLeft = (amount = 1) => {
    if (translate > minTranslate + (amount - 1)) {
      return true
    } else {
      return false
    }
  }

  const translateLeft = (amount = 1) => {
    if (canTranslateLeft(amount)) {
      setTranslate(translate - amount)
    }
  }

  const canTranslateRight = (amount = 1) => {
    if (translate < maxTranslate - (amount - 1)) {
      return true
    } else {
      return false
    }
  }

  const translateRight = (amount = 1) => {
    if (canTranslateRight(amount)) {
      setTranslate(translate + amount)
    }
  }

  // If the amount of data changes, make sure that the current translate value is still valid
  useEffect(() => {
    if (translate < minTranslate) {
      translateRight(minTranslate - translate)
    }
    if (translate > maxTranslate) {
      translateLeft(translate - maxTranslate)
    }
  }, [sizeFactor])

  return (
  <div className="relative border-y border-gray-200 bg-gray-50 -mx-40 2xl:-mx-32 2.5xl:-mx-24">  
    <div
      style={{
        gridTemplateColumns: `repeat(${sizeFactor}, minmax(0, 1fr))`,
        width: sizeFactor*20+"%",
        transition: 'translate 0.3s ease-in-out',
        translate: -translate*100/sizeFactor + "%"
        }}
      className="grid divide-x divide-gray-200"
    >
      <div>{/* Empty column */}</div>
      {filteredSnapshots.map((bu) => (
          <div className="py-3 px-8">
            <div className="bg-white rounded-xl p-3 ring-1 ring-inset ring-gray-200 shadow">
              <p className="text-center font-semibold text-gray-900">{bu?.name}</p>
            </div>
          </div>
        )
      )}
      <div>{/* Empty column */}</div>
    </div>
    <div className="absolute inset-y-0 w-full h-full grid grid-cols-5">
      <div className="flex col-start-1 size-full justify-center items-center bg-gradient-to-r from-gray-100 via-70% via-gray-50/70 to-transparent">
        <div className="flex justify-end w-2/3">
          <button onClick={() => translateLeft()} className="group p-5">
            <div className={classNames(
              "transition-all", canTranslateLeft() ? "bg-sky-300/40 group-hover:bg-sky-400/40 group-hover:-translate-x-4" : "bg-gray-100/40 group-hover:translate-x-0",
              "flex items-center justify-center rounded-full size-8 shadow-sm"
            )}>
              <ChevronLeftIcon className={classNames(
                canTranslateLeft() ? "text-sky-600" : "text-gray-600",
                "size-5"
              )}/>
            </div>
          </button>
        </div>
      </div>
      <div className="flex col-start-5 size-full justify-center items-center bg-gradient-to-l from-gray-100 via-70% via-gray-50/70 to-transparent">
        <div className="flex justify-start w-2/3">
          <button onClick={() => translateRight()} className="group p-5">
            <div className={classNames(
              "transition-all", canTranslateRight() ? "bg-sky-300/40 group-hover:bg-sky-400/40 transition-all group-hover:translate-x-4" : "bg-gray-100/40 group-hover:translate-x-0",
              "flex items-center justify-center rounded-full size-8 shadow-sm"
            )}>
              <ChevronRightIcon className={classNames(
                canTranslateRight() ? "text-sky-600" : "text-gray-600",
                "size-5"
              )}/>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

function SnapshotTable() {
  const { allTimes, filteredSnapshots, sizeFactor, translate, displayType } = useContext(SnapshotContext)
  const { referenceCurrency } = useContext(RefCurContext)

  // Quantize snapshot data based on date grid
  const dataInDay = (day) => {
    let data = [...filteredSnapshots]

    let dateZero = new Date(day)
    let datePlusOneDay = new Date(day)
    datePlusOneDay.setTime(datePlusOneDay.getTime() + 86400000) 

    data = data.map(bu => {
      let filteredSnapshots = bu.snapshots
        .filter(snapshot => {
          let currentDate = new Date(snapshot.date)
          return (currentDate >= dateZero && currentDate < datePlusOneDay)
        })
        // Sort descending
        .sort((a, b) => new Date(b.date) - new Date(a.date))
      return { ...bu, snapshots: filteredSnapshots }
    })

    return data
  }

  // Slice dates from displayed business units 
  const slicedDataInDay = (data) => {
    const dayData = dataInDay(data)

    return dayData.slice(0 + translate, 3 + translate)
  }

  const isSnapshotExistInSlice = (day) => {
    const slicedData = slicedDataInDay(day)

    return !(slicedData.every(data => data.snapshots?.length == 0))
  }

  const colors = {
    crit: "text-red-500",
    acctble: "text-amber-500",
    default: "text-gray-700"
  }
  
  // For animation
  // Scroll height doesn't seem to work with grids for some reason
  const getHeight = (day) => {
    let maxLength = 0;
    slicedDataInDay(day).forEach(bu => {
      if (bu.snapshots.length > maxLength) {
        maxLength = bu.snapshots.length
      }
    })
    return maxLength
  }

  // Animate collapse when translate is changed
  // Some data will disappear, appear, expand, or shrink
  useEffect(() => {
    allTimes().forEach(day => {
      const element = document.getElementById(day)

      if (isSnapshotExistInSlice(day)) {
        element.style.height = (16 + getHeight(day) * 76) + 'px'
        element.style.opacity = 1
      } else {
        element.style.height = '0px'
        element.style.opacity = 0
      }
    })
  }, [translate, filteredSnapshots])

  return (
    <>
      {allTimes().map(day => (
          <div
            id={day}
            key={day}
            style={{
              height: (16 + getHeight(day) * 76) + 'px',
              opacity: 0,
              transition: "all 0.2s ease-in",
            }}
            className="grid grid-cols-5 divide-x divide-gray-300 hover:bg-sky-200/20 -mx-40 2xl:-mx-32 2.5xl:-mx-24"
          >
            <div className="flex justify-end col-start-1 border-r-4 border-gray-300 translate-x-[2px]">
              <div className="flex justify-end items-center h-[5.5rem] z-[1] translate-x-2">
                <p className="text-sm text-gray-400 pr-3">
                  {convertDateOnly(new Date(day))}
                </p>
                <svg viewBox="0 0 2 2" className="h-3.5 w-3.5 rounded-full fill-white stroke-1 stroke-gray-300 translate-x-[1.25px]">
                  <circle cx={1} cy={1} r={1} />
                </svg>
              </div>
            </div>
            {slicedDataInDay(day).map((bu, index) => (
              <div
                key={index}
                className={`flex flex-col col-start-${index+2} py-3 px-8 gap-y-3`}
              >
                {bu.snapshots.map(snapshot => {
                  return (
                    <a
                      href={`business-units/${bu.slug}/snapshot/${snapshot.id}`}
                      className="h-16 relative group flex flex-col items-start justify-center w-full bg-white hover:bg-gray-50 rounded-xl p-3 px-6 ring-1 ring-inset ring-gray-200 shadow-md"
                    >
                      <div className="flex w-full justify-between">
                        <div className="flex items-center pb-1">
                          <span><CameraIcon className="mr-1.5 h-4 w-4 fill-gray-300"/></span>
                          <p className="text-xs text-gray-500">Snapshot {snapshot.id}</p>
                        </div>
                        <p className="text-xs text-gray-500">{convertTimeOnly(new Date(snapshot.date))}</p>
                      </div>
                      <div className="flex w-full justify-between items-center">
                        <p className={classNames(
                            discrepancyColor({
                              discrepancy:snapshot.gap,
                              discrAlertConf:discrAlertConf[bu.slug],
                              colors:colors
                            }),
                            "text-sm font-semibold break-all"
                          )}
                        >
                          {
                            displayType.value === "nominal" ?
                              convertedCurrency(snapshot.gap, config.collateCurrency, referenceCurrency, true)
                            :
                              (snapshot.gap / snapshot.capital * 100).toFixed(4) + '%'
                          }
                        </p>
                        {snapshot.alerts && snapshot.alerts.length !== 0 &&
                          <div className="flex items-center gap-x-1 h-4">
                              <NotificationBadges size="sm" alerts={snapshot.alerts}/>
                          </div>
                        }
                      </div>
                    </a>
                  )})}
              </div>
            ))}
            <div>{/* Empty column */}</div>
            {isSnapshotExistInSlice(day) &&
              <div className="col-start-1 col-span-5 h-px bg-gray-300 w-full px-36 2xl:px-20">
                <div className=""></div>
              </div>
            }
          </div>
      ))}
    </>
  )
}