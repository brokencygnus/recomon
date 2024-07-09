import Layout from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { convertAgeMsToDateTime } from '@/app/utils/dates'
import ClientOnly from '@/app/components/csr'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// mock data start

import { activityLogs } from '@/app/constants/mockdata/activity_log_mockdata'
import { activity } from '@/app/utils/activity-log/activity';

// mock data end

export default function ActivityLogPage() {
  const breadcrumbPages = [
    { name: 'Activity Log', href: '#', current: true },
  ]

  return (
      <Layout>
        <main className="py-10 px-12 2xl:px-16">
          <Breadcrumbs breadcrumbPages={breadcrumbPages} />
          <ActivityLogHeader />
          <ActivityLogTable activityLogs={activityLogs}/>
        </main>
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

function ActivityLogTable({ activityLogs }) {
  const renderActivity = (log) => {
    const category = activity[log.event_category]
    const action = category[log.event_name]
    return action(log.details);
  };
  
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="table-fixed min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="max-w-full">
                <th scope="col" className="min-w-56 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                  Date
                </th>
                <th scope="col" className="min-w-56 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Business unit
                </th>
                <th scope="col" className="min-w-56 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th scope="col" className="w-full px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activityLogs.map((log) => (
                <tr key={log.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                    <ClientOnly>
                      {convertAgeMsToDateTime(log.ageMS)}
                    </ClientOnly>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{log.buCode} {log.buName}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{log.user_name}</td>
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