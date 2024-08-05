import Layout from '@/app/components/layout';
import { NotificationCard } from '@/app/components/notifications/notification_card'
import { convertMsToTimeAgo } from '@/app/utils/dates'
import { notifications } from '@/app/constants/mockdata/notification_mockdata'
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function NotificationsPage() {
  return (
      <Layout>
        <div className="bg-stone-100 min-h-full pb-16">
          <main className="mx-auto max-w-7xl pt-16 px-8">
            <NotificationHeader />
            <NotificationsList notifications={notifications}/>
          </main>
        </div>
      </Layout>
    )
  }
  
function NotificationHeader() {
  return (
    <div className="flex items-baseline border-b border-gray-200">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Notifications</h1>
            </div>
          </header>
        </div>
      </div>
      <div className="flex items-center">
        <button
          className="h-10 flex text-nowrap items-center rounded px-3 text-sm font-semibold text-gray-500 hover:text-sky-600"
        >
          Mark all as read
        </button>
        <div className="h-6 w-px bg-gray-900/10" aria-hidden="true" />
        <a href="/settings?tab=notifications" className="px-3">
          <Cog6ToothIcon className="h-5 w-5 text-gray-500 hover:text-sky-600" />
        </a>
      </div>
    </div>
  );
}

function NotificationsList({ notifications }) {
  return (
    <div className="flex flex-col mt-8 gap-y-5">
      {notifications.map(notification => (
        <div>
          <p className="text-sm text-gray-400 py-3">{convertMsToTimeAgo(notification.ageMs)}</p>
          <NotificationCard data={notification} displayedIn="page"/>
        </div>
      ))}
    </div>
  )
}