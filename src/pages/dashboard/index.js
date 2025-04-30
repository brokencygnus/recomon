import { useState } from 'react';
import Layout from '@/app/components/layout';
import { config } from '@/app/constants/config';
import ClientOnly from '@/app/components/csr';
import { convertMsToTimeAgo, getTimeGreeting } from '@/app/utils/dates'
import { GradientBackground } from '@/app/components/GradientBackground'
import './react-grid-layout.css'
import './react-resizable.css'
import { SquaresFour, ArrowCounterClockwise } from '@phosphor-icons/react';

// grid layout
import RGL, { WidthProvider }  from "react-grid-layout";
const ReactGridLayout = WidthProvider(RGL);
//

// chart
import { ChartProvider, TimelineChart, Legend, RangeSelector } from '@/app/components/charts'
import { stringToColor } from '@/app/components/stringToColor';
//

// activity log
import { activity } from '@/app/utils/activity-log/activity';
//

// notifications
import { NotificationCard } from '@/app/components/notifications/notification_card'
//

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// mock data
import { snapshotBusinessUnits } from '@/app/constants/mockdata/snapshot_mockdata'
import { activityLogs } from '@/app/constants/mockdata/activity_log_mockdata'
import { notifications } from '@/app/constants/mockdata/notification_mockdata'
import { user } from '@/app/constants/mockdata/user_mockdata'
//

export default function DashboardPage() {
  const [isEditing, setEditing] = useState(false)
  
  const defaultLayout = [
    { i: "a", x: 0, y: 0, w: 8, h: 6, static: true },
    { i: "b", x: 8, y: 0, w: 3, h: 2, static: true },
    { i: "c", x: 4, y: 6, w: 1, h: 2, static: true }
  ]

  const [layout, setLayout] = useState(defaultLayout)

  const onLayoutChange = (layout) => {
    setLayout(layout)
  }

  const toggleEdit = () => {
    if (isEditing) {
      setLayout(layout.map(i => ({...i, static: true})))
    } else {
      setLayout(layout.map(i => ({...i, static: false})))
    }
    setEditing(!isEditing)
  }

  const resetLayout = () => {
    setLayout(defaultLayout.map(i => ({...i, static: !isEditing})))
  }

  return (
    <Layout>
      <main className="relative flex flex-col min-h-full pt-6 pb-12 px-12 2xl:px-16 bg-zinc-100">
        {/* Background */}
        <GradientBackground />
        <div className="relative flex z-10">
          <div className="flex flex-col w-full">
            <DashboardHeader
              toggleEdit={toggleEdit}
              resetLayout={resetLayout}
            />
            <div className={classNames("transition-all duration-500 origin-top", isEditing ? "scale-[0.75]" : "scale-100")}>
              {/* Background */}
              <div className={classNames("absolute inset-0 z-0 bg-zinc-500 rounded-xl transition-opacity", isEditing ? "opacity-10" : "opacity-0")}/>
              <ReactGridLayout
                onLayoutChange={onLayoutChange}
                className="layout w-full"
                layout={layout}
                cols={12}
                rowHeight={56}
                transformScale={isEditing ? 0.75 : 1}
              >
                <div key="a">
                <GridCard title="test" interactable={!isEditing}>
                  <ChartSection />
                </GridCard>

                </div>
                <div key="b">
                <GridCard title="test" interactable={!isEditing}/>

                </div>
                <div key="c">
                  <GridCard title="test" interactable={!isEditing}/>
                </div>
              </ReactGridLayout>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}


function Card({ children, className, ...props }) {
  return (
    <div className={classNames("rounded-lg bg-white shadow-md px-8 py-6", className)} {...props}>
      {children}
    </div>
  )
}

  
function DashboardHeader({ toggleEdit, resetLayout }) {
  return (
    <div className="flex items-center mb-4 bg-white rounded-xl border p-6 border-zinc-200 gap-x-12 shadow-sm">
      <div className="flex-auto">
        <header>
          <div className="max-w-7xl">
            <h1 className="text-2xl font-medium leading-tight tracking-tight text-gray-900">
              {getTimeGreeting() + ", " + user.name}
            </h1>
            {/* <p className="mt-2 text-sm text-gray-700">This is 404, by the way</p> */}
          </div>
        </header>
      </div>
      <div className="flex items-end">
        <button
          onClick={toggleEdit}
          className="flex rounded-lg hover:bg-zinc-50"
        >
          <SquaresFour
            className="size-5 m-1 shrink-0 text-zinc-500 hover:text-zinc-700"
            aria-hidden="true"
          />
        </button>
        <button
          onClick={resetLayout}
          className="flex rounded-lg hover:bg-zinc-50"
        >
          <ArrowCounterClockwise
            className="size-5 m-1 shrink-0 text-zinc-500 hover:text-zinc-700"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

function GridCard({ title, children, interactable=true }) {
  return (
    <div className={classNames("relative flex flex-col grow bg-zinc-50 size-full rounded-xl border border-zinc-200 shadow-sm",
      !interactable && "pointer-events-none"
    )}>
      <div className="px-5 py-4">
        <p className="text-base font-semibold text-zinc-800">{title}</p>
      </div>
      <div className="flex flex-col grow overflow-hidden rounded-xl bg-white border-t border-zinc-200">
        {children}
      </div>
    </div>

  )
}

function ChartSection() {
  const chartSeries = snapshotBusinessUnits.map(bu => (
    {
      name: bu.name,
      color: stringToColor(bu.slug, {maxLum:70, minLum:40, maxSat:60, minSat:30}),
      data:bu.snapshots.map(snap => (
        {x:snap.date, y:snap.gap*100/snap.capital}
      ))
    }
  ))

  return (
    <ChartProvider
      id={"snapshotsTimelineChart"}
      series={chartSeries}
      showOnLoad={3}
    >
      <Card className="flex flex-col grow">
        <div className="flex gap-x-6 items-center">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Snapshot gap over time</h3>
          <RangeSelector />
        </div>
        <div className="flex justify-between gap-x-6 h-0 grow">
          <div className="grow">
            <TimelineChart
              defaultZoomDays={60}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="flex-none text-sm font-medium text-gray-600">Business units</p>
            <div className="h-0 grow overflow-y-auto">
              <Legend />
            </div>
          </div>
        </div>
      </Card>
    </ChartProvider>
  )
}


function ActivityLogSection() {
  const { dashboardShowNLogs } = config

  const renderActivity = (log) => {
    const category = activity[log.eventCategory]
    const action = category[log.eventName]
    return action({ ...log.details, isOneLine:true});
  };

  const slicedActivityLogs = activityLogs.slice(0, dashboardShowNLogs)

  return (
    
    <Card className="flex flex-col grow">
      <div className="flex gap-x-6 mb-6 items-center">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Latest Activity</h3>
      </div>

      <div className="h-0 grow overflow-y-auto">
        <div className="-my-2">
          <div className="inline-block w-full py-2 align-middle">
            <table className="table-fixed w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="w-36 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 border-b border-gray-300">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {slicedActivityLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                      <ClientOnly>
                        {convertMsToTimeAgo(log.ageMS)}
                      </ClientOnly>
                    </td>
                    <td className="w-24 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <p className="inline text-wrap">{log.userName} {renderActivity(log)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="h-16 sticky bottom-0 pointer-events-none bg-gradient-to-t from-white to-transparent"></div>
      </div>

    </Card>
        
  )
}

function NotificationSection() {
  const { dashboardShowNNotifs } = config
  const slicedNotifs = notifications?.data.slice(0, dashboardShowNNotifs)

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-x-6 items-center">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Latest alerts</h3>
      </div>
      <div className="h-0 grow overflow-y-auto mt-4 p-2 pb-0">
        <div className="flex flex-col gap-y-5">
          {slicedNotifs.map((notification) => (
            <NotificationCard data={notification} displayedIn="dashboard"/>
          ))}
        </div>
        <div className="h-16 sticky bottom-0 pointer-events-none bg-gradient-to-t from-stone-100 to-transparent"></div>
      </div>
    </div>
  )
}