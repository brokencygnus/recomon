import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react';
import Layout, { RefCurContext, convertedCurrency } from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { snapshotBusinessUnits } from '@/app/constants/snapshot_mockdata';
import { quantizeDates } from '@/app/utils/snapshot/dates'
import { convertDateOnly, convertTimeOnly } from '@/app/utils/utils'
import { HighlightSearch, SearchFilter } from '@/app/utils/highlight_search';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { CameraIcon } from '@heroicons/react/16/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const SnapshotContext = React.createContext({});

export default function SnapshotPage() {
  const router = useRouter()
  const { pathname } = router;
  const query = { ...router.query };

  const breadcrumbPages = [
    { name: 'Snapshots', href: '#', current: true },
  ]

  const [filteredSnapshots, setFilteredSnapshots] = useState(snapshotBusinessUnits);
  const [searchTerm, setSearchTerm] = useState([]);

  const resetRouter = () => {
    router.replace({
      pathname: '/snapshots',
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
    setSearchTerm([])
  }

  const doFilter = () => {
    const tempFilteredSnapshots = snapshotBusinessUnits.filter(bu => SearchFilter(bu.name, searchTerm))
    
    setFilteredSnapshots(tempFilteredSnapshots)
  }

  useEffect(() => {
    if (!query["business-unit"]) {
      doFilter()
    }
  }, [snapshotBusinessUnits, searchTerm])

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
      <Layout currentTab="snap">
        <SnapshotContext.Provider value={{ allTimes, filteredSnapshots, sizeFactor, translate, setTranslate, searchTerm }}>
          <main className="flex-1 relative bg-white h-full">
            <div className="bg-white pt-10 px-12 2xl:px-16">
              <Breadcrumbs breadcrumbPages={breadcrumbPages} />
              <SnapshotHeader
                handleSearchChange={handleSearchChange}
                handleResetFilters={handleResetFilters}
              />
            </div>
            
            <div className="sticky top-16 bg-white px-12 2xl:px-16 z-[2]">
              <SnapshotFilter 
                handleSearchChange={handleSearchChange}
                handleResetFilters={handleResetFilters}
              />
            </div>
            <div className="sticky top-[5.5rem] bg-white z-[1] w-full h-10"></div>
            <div className="sticky top-[8rem] bg-white z-[2]">
              <div className="px-12 2xl:px-16 ">
                <SnapshotCarousel />
              </div>
              <div className="w-full h-4 bg-white border-b border-1 z-10 shadow-sm"></div>
            </div>
            {/* <div className="sticky top-[5.5rem] w-full h-10 bg-white z-[1] shadow-md"></div> */}
            <div className="px-12 2xl:px-16 overflow-hidden">
              <SnapshotTable />
            </div>
            <div className="h-16 sticky bottom-0 z-10 pointer-events-none bg-gradient-to-t from-white to-transparent"></div>
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

function SnapshotFilter({ handleSearchChange, handleResetFilters }) {
  const { searchTerm } = useContext(SnapshotContext)

  return (
    <div className="flex justify-between">
      <div className="flex flex-row items-end mt-2 gap-x-3">
        <form className="flex rounded-md w-fit h-9 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
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

        <div>
          <button
            type="button"
            className="h-10 rounded px-2 py-1 text-sm font-semibold text-indigo-600"
            onClick={handleResetFilters}
          >
            Reset search
          </button>
        </div>
      </div>
        <div className="flex items-end">
          <a
            href='#'
            className="h-10 flex items-center rounded px-2 py-1 text-sm font-semibold text-indigo-600"
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
  <div className="relative border-y-2 border-gray-100 bg-gray-50 -mx-40 2xl:-mx-24">  
    <div
      style={{
        gridTemplateColumns: `repeat(${sizeFactor}, minmax(0, 1fr))`,
        width: sizeFactor*20+"%",
        transition: 'translate 0.3s ease-in-out',
        translate: -translate*100/sizeFactor + "%"
        }}
      className="grid divide-x divide-gray-100 transition-all"
    >
      <div>{/* Empty column */}</div>
      {filteredSnapshots.map((bu) => {
        return (
          <div className="py-3 px-8">
            <div className="bg-white rounded-xl p-3 ring-1 ring-inset ring-gray-200 shadow">
              <p className="text-center font-semibold text-gray-900">{bu?.name}</p>
            </div>
          </div>
        )
      })}
      <div>{/* Empty column */}</div>
    </div>
    <div className="absolute inset-y-0 w-full h-full grid grid-cols-5">
      <div className="flex col-start-1 size-full justify-center items-center bg-gradient-to-r from-gray-100 via-70% via-gray-50/70 to-transparent">
        <div className="flex justify-end w-2/3">
          <button onClick={() => translateLeft()} className="group p-5">
            <div className={classNames(
              "transition-all", canTranslateLeft() ? "bg-indigo-100/40 group-hover:bg-indigo-200/40 group-hover:-translate-x-4" : "bg-gray-100/40 group-hover:translate-x-0",
              "flex items-center justify-center rounded-full size-8 shadow-sm"
            )}>
              <ChevronLeftIcon className={classNames(
                canTranslateLeft() ? "text-indigo-600" : "text-gray-600",
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
              "transition-all", canTranslateRight() ? "bg-indigo-100/40 group-hover:bg-indigo-200/40 transition-all group-hover:translate-x-4" : "bg-gray-100/40 group-hover:translate-x-0",
              "flex items-center justify-center rounded-full size-8 shadow-sm"
            )}>
              <ChevronRightIcon className={classNames(
                canTranslateRight() ? "text-indigo-600" : "text-gray-600",
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
  const { allTimes, filteredSnapshots, sizeFactor, translate } = useContext(SnapshotContext)
  const { referenceCurrency } = useContext(RefCurContext)

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

  const slicedDataInDay = (data) => {
    const dayData = dataInDay(data)

    return dayData.slice(0 + translate, 3 + translate)
  }

  const isSnapshotExistInSlice = (day) => {
    const slicedData = slicedDataInDay(day)

    return !(slicedData.every(data => data.snapshots?.length == 0))
  }

  return (
    <>
      {allTimes().map(day => { 
        return (
          <div key={day} className={classNames(isSnapshotExistInSlice(day) ? '' : 'hidden',
              "grid grid-cols-5 divide-x divide-gray-100 hover:bg-indigo-50 -mx-40 2xl:-mx-24"
            )}>
            <div className="flex justify-end col-start-1 border-r-4 border-gray-200 translate-x-[2px]">
              <div className="flex justify-end items-center h-20 z-[1] translate-x-2">
                <p className="text-sm text-gray-400 pr-3">
                  {convertDateOnly(new Date(day))}
                </p>
                <svg viewBox="0 0 2 2" className="h-4 w-4 rounded-full fill-white stroke-1 stroke-gray-200 translate-x-[2px]">
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
                      href='#'
                      className="relative group flex flex-col items-start justify-center w-full bg-white hover:bg-gray-50 rounded-xl p-3 pl-6 ring-1 ring-inset ring-gray-200 shadow-md"
                    >
                      <div className="flex w-full justify-between">
                        <div className="flex items-center pb-1">
                          <span><CameraIcon className="mr-1.5 h-4 w-4 fill-gray-300"/></span>
                          <p className="text-xs text-gray-500">Snapshot {snapshot.id}</p>
                        </div>
                        <p className="text-xs text-gray-500">{convertTimeOnly(new Date(snapshot.date))}</p>
                      </div>
                      <p className="text-sm font-semibold break-all text-gray-700">{convertedCurrency(snapshot.value, bu.currency, referenceCurrency)}</p>
                    </a>
                  )})}
              </div>
            ))}
            <div>{/* Empty column */}</div>
            <div className="col-start-1 col-span-5 w-full px-36 2xl:px-20">
              <div className="h-px bg-gray-200"></div>
            </div>
          </div>
      )})}
    </>
  )
}