import { notifications } from '@/app/constants/mockdata/notification_mockdata'
import { NotificationCard } from '@/app/components/notifications/notification_card'
import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react'
import { IconBell } from "@tabler/icons-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function NotificationMenu() {
  const notificationCount = notifications.unreadCount
  const displayBadge = notificationCount != 0
  const notificationCountClamped = Math.max(Math.min(notificationCount, 99), 0)

  return (
    <Menu as="div" className="relative">
      <MenuButton className="relative flex items-center p-0.5 mx-2 text-zinc-400 rounded-lg hover:bg-zinc-50 hover:text-zinc-500">
        <a type="button">
          <span className="sr-only">View notifications</span>
          <IconBell className="h-6 w-6" aria-hidden="true" />
        </a>
        {displayBadge &&
          <div className="absolute -top-1 -right-1 size-5 flex items-center justify-center rounded-full bg-red-500 border-2 border-white">
            <p className="text-white text-xs font-semibold leading-none">{notificationCountClamped}</p>
          </div>
        }
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
          <div className="sticky top-0 bg-white z-40 border-b border-zinc-200 shadow-sm">
            <p className="font-semibold text-sm text-zinc-900 p-4 pb-3">Notifications</p>
          </div>
          {notifications?.data.map(notification => (
            <NotificationCard data={notification} displayedIn="popover"/>
          ))}
          <div className="sticky bottom-0 flex bg-white z-40 border-t border-zinc-200 hover:bg-zinc-50 shadow-sm">
            <a href="/notifications" className="grow font-semibold text-center text-sm text-zinc-500 hover:text-sky-600 p-4 pt-3">View all</a>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
