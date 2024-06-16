'use client'
import "../globals.css";
import { Fragment, useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  Square3Stack3DIcon,
  HomeIcon,
  CodeBracketIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true},
  { name: 'Business Units', href: '#', icon: CodeBracketIcon, current: false},
  { name: 'Manage APIs', href: '#', icon: Square3Stack3DIcon, current: false},
]
const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Layout({ children }) {
  const [expanded, setExpanded] = useState(false)

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };

  return (
    <>
      <div>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={classNames(
            'transition-sidebar ease-in-out', expanded ? 'w-72' : 'w-20', 'duration-300',
            "fixed inset-y-0 left-0 z-50 block w-20 overflow-y-auto bg-indigo-600 pb-10"
          )}>
          <div className="flex flex-col h-full px-4 justify-start">
            <div className="flex pt-6 shrink-0 items-center justify-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>
            <div className="flex flex-col flex-grow justify-between">
              <nav className="mt-8">
                <ul role="list" className="flex flex-1 flex-col items-start gap-y-1">
                  {navigation.map((item) => (
                    <li key={item.name} className="w-full">
                      <a
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-indigo-700 text-white' : 'text-gray-400 hover:bg-indigo-700 hover:text-white',
                          'transition-sidebar ease-in-out', expanded ? 'w-60' : 'w-12', 'duration-300 delay-75',
                          'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        <p className={classNames(
                          'transition-sidebar ease-in-out', expanded ? 'opacity-100' : 'opacity-0', 'duration-200 delay-150',
                          'text-nowrap overflow-hidden',
                        )}>
                          {item.name}
                        </p>
                        <span className="sr-only">{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <ul role="list" className="flex h-full flex-1 flex-col items-start justify-end gap-y-3">
                  <li className="mt-auto">
                    <a
                      href="#"
                      className={classNames(
                        'transition-sidebar ease-in-out', expanded ? 'w-60' : 'w-12', 'duration-300 delay-75',
                        'group flex gap-x-3 rounded-md p-3 text-gray-400 hover:bg-indigo-700 hover:text-white text-sm font-semibold leading-6'
                      )}
                    >
                      <Cog6ToothIcon
                        className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                        aria-hidden="true"
                      />
                      <p className={classNames(
                        'transition-sidebar ease-in-out', expanded ? 'opacity-100' : 'opacity-0', 'duration-200 delay-150',
                        'text-nowrap overflow-hidden',
                      )}>
                        Settings
                      </p>
                    </a>
                  </li>
                </ul>
            </div>
          </div>
        </div>

        <div className="pl-20">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">

            {/* Separator */}
            {/* <div className="h-6 w-px bg-gray-900/10" aria-hidden="true" /> */}

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="relative flex flex-1" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  name="search"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                        Tom Cook
                      </span>
                      <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </MenuButton>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          {({ focus }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                focus ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-gray-900'
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-6 2xl:px-8 3xl:px-16">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}


export default function RootLayout({ children }) {
  return (
    //  <html lang="en">
    //    <body>
            <Layout>{children}</Layout>
    //    </body>
    //  </html>
  );
}
