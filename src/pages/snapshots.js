import React, { useState, useContext } from 'react';
import Layout, { RefCurContext, convertedCurrency } from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { ToastContext } from '@/app/components/toast';
import { snapshotBusinessUnits } from '@/app/constants/snapshot_mockdata';
import { quantizeDates } from '@/app/utils/snapshot/dates'
import { convertDateOnly, formatNumber } from '@/app/utils/utils'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const SnapshotContext = React.createContext({});

export default function SnapshotPage() {
  const breadcrumbPages = [
    { name: 'Snapshots', href: '#', current: true },
  ]

  const [filteredData, setFilteredData] = useState(snapshotBusinessUnits)
  const [translate, setTranslate] = useState(0)

  const sizeFactor = filteredData.length + 2

  const translateLeft = () => {
    if (translate < 0) {
      setTranslate(translate + 1)
    }
  }

  // 3 is the number of business units displayed at the same time
  const translateRight = () => {
    if (translate > 0 - filteredData.length + 3) {
      setTranslate(translate - 1)
    }
  }

  const allTimes = () => {
    const allTimesResult = []
    filteredData.forEach(unit => {
      unit.snapshots.forEach(snapshot => {
        const time = new Date(snapshot.date)
        allTimesResult.push(time)
      })
    })

    return quantizeDates(allTimesResult)
  }

  // const allBusinessUnits = () => {
  //   const allBuResult = []
  //   for (let i in filteredData) {
  //     const data = {index: i, snapshots: filteredData.snapshots}
  //     allBuResult.push(data)
  //   }

  //   return allBuResult
  // }

  // const allDates = extractDatesFromTimes(allTimes)

  return (
      <Layout>
        <SnapshotContext.Provider value={{ allTimes, filteredData, setFilteredData, sizeFactor, translate, translateLeft, translateRight }}>
          <main className="py-10 px-12 2xl:px-16">
            <Breadcrumbs breadcrumbPages={breadcrumbPages} />
            <SnapshotHeader />
            <SnapshotCarousel />
            <SnapshotTable />
          </main>
        </SnapshotContext.Provider>
      </Layout>
    )
  }
  
function SnapshotHeader() {
  const { referenceCurrency } = useContext(RefCurContext)
  const [index, setIndex] = useState(1)

  const changeIndex = () => {
    setIndex (index + 1)
    console.log(index)
  }
  return (
    <div className="flex items-center">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Snapshots</h1>
              <p className="mt-2 text-sm text-gray-700">lalalala</p>
            </div>
          </header>
        </div>
      </div>
      <div className="flex items-end">
        <button
        onClick={changeIndex}>
          Configure snapshots
        </button>
      </div>
    </div>
  );
}

function SnapshotCarousel() {
  const { filteredData, sizeFactor, translate, translateLeft, translateRight } = useContext(SnapshotContext)

  return (
  <div className="relative border-y-2 border-gray-100 overflow-hidden">  
    <div
      style={{
        gridTemplateColumns: `repeat(${Math.max(sizeFactor, 5)}, minmax(0, 1fr))`,
        width: sizeFactor*20+"%",
        transition: 'all 0.3s ease-in-out',
        translate: translate*100/sizeFactor + "%"
        }}
      className="grid divide-x divide-gray-100 transition-all"
    >
      <div>{/* Empty column */}</div>
      {filteredData.map((bu) => {
        return (
          <div className="py-3 px-8">
            <div className="bg-white rounded-xl p-3 ring-1 ring-inset ring-gray-200 shadow-md">
              <p className="text-center font-semibold text-gray-900">{bu.name}</p>
            </div>
          </div>
        )
      })}
      <div>{/* Empty column */}</div>
    </div>
    <div className="absolute inset-y-0 w-full h-full grid grid-cols-5">
      <div className="flex col-start-1 size-full justify-center items-center bg-gradient-to-r from-white via-20% via-white/40 via-80% via-white/60 to-transparent">
        <div className="flex justify-end w-2/3">
          <button onClick={() => translateLeft()} className="group p-5">
            <div className="flex items-center justify-center rounded-full size-8 bg-indigo-100/40 group-hover:bg-indigo-200/40 shadow-sm transition-all group-hover:-translate-x-4">
              <ChevronLeftIcon className="text-indigo-600 size-5"/>
            </div>
          </button>
        </div>
      </div>
      <div className="flex col-start-5 size-full justify-center items-center bg-gradient-to-l from-white via-20% via-white/40 via-80% via-white/60 to-transparent">
        <div className="flex justify-start w-2/3">
          <button onClick={() => translateRight()} className="group p-5">
            <div className="flex items-center justify-center rounded-full size-8 bg-indigo-100/40 group-hover:bg-indigo-200/40 shadow-sm transition-all group-hover:translate-x-4">
              <ChevronRightIcon className="text-indigo-600 size-5"/>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

function SnapshotTable() {
  const { allTimes, filteredData, sizeFactor, translate } = useContext(SnapshotContext)
  const { referenceCurrency } = useContext(RefCurContext)

  const dataInDay = (day) => {
    let data = [...filteredData]

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

    return dayData.slice(0 - translate, 3 - translate)
  }

  const isSnapshotExistInSlice = (day) => {
    const slicedData = slicedDataInDay(day)

    return !(slicedData.every(data => data.snapshots?.length == 0))
  }

  return (
    <>
      {allTimes().map(day => { 
        return (isSnapshotExistInSlice(day) ?
          <div className="grid grid-cols-5">
            <div className="col-start-1 border-r-4 border-gray-100 translate-x-[2px]">
              <div className="flex justify-end items-center h-20 z-[1] translate-x-2">
                <p className="text-sm text-gray-400 pr-3">
                  {convertDateOnly(new Date(day))}
                </p>
                <svg viewBox="0 0 2 2" className="h-4 w-4 rounded-full fill-white stroke-[0.5] stroke-gray-200 translate-x-[2px]">
                  <circle cx={1} cy={1} r={1} />
                </svg>
              </div>
            </div>
            {slicedDataInDay(day).map((bu, index) => (
              <div
                key={index}
                className={`flex flex-col col-start-${index+2} justify-center py-3 px-8 gap-y-3`}
              >
                {bu.snapshots.map(snapshot => {
                  return (
                    <div className="flex items-center justify-center w-full bg-white rounded-xl p-3 ring-1 ring-inset ring-gray-200 shadow-md">
                      <p className="text-sm text-center font-semibold text-gray-700">{convertedCurrency(snapshot.value, bu.currency, referenceCurrency)}</p>
                    </div>
                  )})}
              </div>
            ))}
            <div className="col-span-5 w-full h-px bg-gray-100"></div>
          </div>
        : null
      )})}
    </>
  )
}