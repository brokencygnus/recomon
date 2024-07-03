import { notifications } from '@/app/constants/mockdata/notification_mockdata'
import { NotificationCard } from '@/app/components/notifications/notification_card'
import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function NotificationMenu() {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center -m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
        <a href="/notifications" type="button">
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </a>
      </MenuButton>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute -inset-x-48 top-12 z-10 mt-2.5 w-96 max-h-[36rem] overflow-y-auto py-0 origin-top-right rounded-md bg-gray-50 shadow-lg ring-1 ring-gray-900/5 focus:outline-none no-scrollbar">
          <div className="sticky top-0 bg-white z-40 border-b border-gray-200 shadow-sm">
            <p className="font-semibold text-sm text-gray-900 p-4 pb-3">Notifications</p>
          </div>
          {notifications.map(notification => (
            <NotificationCard data={notification} displayedIn="popover"/>
          ))}
          <div className="sticky bottom-0 flex bg-white z-40 border-t border-gray-200 shadow-sm p-4 pt-3">
            <a href="/notifications" className="grow font-semibold text-center text-sm text-gray-500 hover:text-indigo-700">View all</a>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
