import Layout from '@/app/components/layout';
import { config } from '@/app/constants/config';
import ClientOnly from '@/app/components/csr';
import { convertMsToTimeAgo, getTimeGreeting } from '@/app/utils/dates'

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

// mock data start

import { snapshotBusinessUnits } from '@/app/constants/mockdata/snapshot_mockdata'
import { activityLogs } from '@/app/constants/mockdata/activity_log_mockdata'
import { notifications } from '@/app/constants/mockdata/notification_mockdata'
import { user } from '@/app/constants/mockdata/user_mockdata'

// mock data end

const chartSeries = snapshotBusinessUnits.map(bu => (
  {
    name: bu.name,
    color: stringToColor(bu.slug, {maxLum:70, minLum:40, maxSat:60, minSat:30}),
    data:bu.snapshots.map(snap => (
      {x:snap.date, y:snap.gap*100/snap.capital}
    ))
  }
))

export default function DashboardPage() {
  return (
    <Layout>
      <main className="relative flex flex-col min-h-full pt-6 pb-12 px-12 2xl:px-16 bg-stone-100">
        {/* Background */}
        <GradientBackground />
        <div className="relative flex gap-x-6 grow z-10">
          <div className="w-3/5 min-h-0 grow flex flex-col">
            <DashboardHeader />
            <div className="flex h-1/2 pt-4">
              <ChartSection />
            </div>
            <div className="flex h-1/2 pt-4">
              <ActivityLogSection />
            </div>
          </div>
          <div className="w-px bg-gray-900/10 mt-8" aria-hidden="true" />
          <div className="flex-none w-96 mt-8">
            <NotificationSection />
          </div>
        </div>
      </main>
    </Layout>
  )
}

function GradientBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 translate-x-[-10%] translate-y-[-10%] opacity-30 blur-3xl overflow-hidden"
      >
        <div
          style={{
            clipPath:
              'polygon(30% 0%, 49% 18%, 100% 11%, 100% 46%, 50% 100%, 44% 51%, 0% 61%, 0 0)',
          }}
          className={`size-[120%] bg-gradient-to-br bg-sky-500 to-blue-500`}
        />
      </div>
      <div className="absolute inset-0 size-full bg-gradient-to-l from-stone-100/40 via-50% via-stone-100/70 to-80% to-transparent z-[1]"/>
    </>
  )
}


function Card({ children, className, ...props }) {
  return (
    <div className={classNames("rounded-lg bg-white shadow-md px-8 py-6", className)} {...props}>
      {children}
    </div>
  )
}

  
function DashboardHeader() {
  return (
    <div className="flex">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-medium leading-tight tracking-tight text-gray-900">
                {getTimeGreeting() + ", " + user.name}
              </h1>
              {/* <p className="mt-2 text-sm text-gray-700">This is 404, by the way</p> */}
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

function ChartSection() {
  const { dashboardShowNLogs } = config

  const renderActivity = (log) => {
    const category = activity[log.eventCategory]
    const action = category[log.eventName]
    return action({ ...log.details, oneLine:true});
  };

  const slicedActivityLogs = activityLogs.slice(0, dashboardShowNLogs)

  return (
    <ChartProvider
      id={"snapshotsTimelineChart"}
      series={chartSeries}
      showOnLoad={3}
    >
      <Card className="flex flex-col grow">
        <div className="flex gap-x-6 mb-6 items-center">
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
    return action({ ...log.details, oneLine:true});
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
  const slicedNotifs = notifications.slice(0, dashboardShowNNotifs)

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