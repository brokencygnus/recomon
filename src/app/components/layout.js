'use client'
import "../globals.css";
import React, { Fragment, useState } from 'react'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import {
  BellIcon,
  Cog6ToothIcon,
  Square3Stack3DIcon,
  HomeIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { businessUnits, currencies } from "@/app/constants/mockdata";
import { formatNumber, convertCurrency } from '@/app/utils/utils';
import { ToastProvider, ToastGroup } from '@/app/components/toast'
import { Dropdown } from "./dropdown";

const businessUnitNav = structuredClone(businessUnits)
  .concat({ id: 0, name: 'View All', href: '/business-units' })

const navigation = [
  { slug: 'dash', name: 'Dashboard', href: '#', icon: HomeIcon, submenus: []},
  { slug: 'bu', name: 'Business Units', href: '/business-units', icon: Square3Stack3DIcon, submenus: businessUnitNav},
  { slug: 'api', name: 'Manage APIs', href: '/api-list', icon: CodeBracketIcon, submenus: []},
]
const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Context to configure reference currency on the sticky header
export const RefCurContext = React.createContext({ name:"None", value:"self", dropdownName:"None"});

// Import this if you want to use RefCurContext
export const convertedCurrency = (amount, currency, referenceCurrency, signed=false) => {
  let convertedAmount = ""
  let currencySymbol = ""
  let approxSymbol = ""
  let sign = ""

  if (signed && amount > 0) {
    sign = "+"
  }

  if (referenceCurrency?.value !== 'self' && currency !== referenceCurrency?.symbol) {
    convertedAmount = formatNumber(convertCurrency(amount, currency, referenceCurrency?.symbol))
    currencySymbol = referenceCurrency?.symbol
    approxSymbol = "≈ "
  } else {
    let amountRounded = +parseFloat(amount).toFixed(8)
    convertedAmount = formatNumber(amountRounded)
    currencySymbol = currency
  }
  return approxSymbol + sign + convertedAmount + " " + currencySymbol
}

export default function Layout({ children, currentTab }) {
  const [expanded, setExpanded] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [referenceCurrency, setReferenceCurrency] = useState({ name:"None", value:"self", dropdownName:"None"})

  const nullRefCur = { name:"None", value:"self", dropdownName:"None"}

  const handleMouseEnterSidebar = () => {
    setExpanded(true);
  };

  const handleMouseLeaveSidebar = () => {
    setExpanded(false);
  };

  const handleMouseEnterMenu = (name) => {
    const id = name;
    setHoveredMenu(id);
  };

  const handleMouseLeaveMenu = () => {
    setHoveredMenu(null);
  };

  const handleReferenceCurrency = (event) => {
    const { value } = event.target
    setReferenceCurrency(value)
  }

  return (
    <>
      <div>
        <div className={classNames(
          'transition-opacity ease-in-out', expanded ? 'w-screen opacity-75' : 'w-0 opacity-0', 'duration-300',
          "fixed inset-0 max-w-screen h-screen z-[45] bg-gray-500")}/>
        <div
          onMouseEnter={handleMouseEnterSidebar}
          onMouseLeave={handleMouseLeaveSidebar}
          className={classNames(
            'transition-all ease-in-out', expanded ? 'w-72' : 'w-20', 'duration-300',
            "fixed inset-y-0 left-0 z-50 block w-20 overflow-visible bg-indigo-600 pb-10"
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
                    <li
                      onMouseEnter={() => handleMouseEnterMenu(item.name)}
                      onMouseLeave={handleMouseLeaveMenu}
                      key={item.name}
                      className="relative w-full">
                      <a
                        href={item.href}
                        className={classNames(
                          item.slug == currentTab ? 'bg-indigo-700 text-white' : hoveredMenu === item.name ? 'bg-indigo-700 text-white' : 'text-indigo-200',
                          'transition-all ease-in-out', expanded ? 'w-64 delay-75' : 'w-12', 'duration-300',
                          'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.slug == currentTab ? 'text-white' : hoveredMenu === item.name ? 'text-white' : 'text-indigo-200',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        <p className={classNames(
                          'transition-all ease-in-out', expanded ? 'opacity-100 delay-150' : 'opacity-0', 'duration-200',
                          'text-nowrap overflow-hidden',
                        )}>
                          {item.name}
                        </p>
                        <span className="sr-only">{item.name}</span>
                      </a>
                      { item.submenus.length > 0 ? (
                        <div className={classNames(
                          'transition-all ease-in-out', hoveredMenu === item.name ? 'opacity-100 translate-x-52' : 'opacity-0 translate-x-48', 'duration-200',
                          "absolute left-12 top-0"
                          )}>{/* Hacky way to extend the hover surface */}
                          <div
                            hidden = {hoveredMenu !== item.name}
                            className={classNames(
                              "ml-8",
                              "rounded-md bg-white shadow-sm border border-gray-200 overflow-hidden"
                          )}>
                            <dl className="grid grid-cols-1 divide-y-2 divide-gray-200 text-sm leading-6">
                              { item.submenus.map((item) => (
                                <a
                                  key={item.id}
                                  href={"/business-unit/" + item.slug}
                                  className="group flex items-center pl-6 pr-20 py-3 hover:bg-gray-100"
                                >
                                  <dt className="h-6 text-gray-600 text-nowrap font-medium group-hover:text-gray-800">{item.name}</dt>
                                </a>
                              ))}
                            </dl>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </nav>
              <ul role="list" className="flex h-full flex-1 flex-col items-start justify-end gap-y-3">
                  <li
                    className="mt-auto"
                  >
                    <a
                      href="#"
                      className={classNames(
                        'transition-all ease-in-out', expanded ? 'w-60 delay-75' : 'w-12', 'duration-300',
                        'group flex gap-x-3 rounded-md p-3 text-indigo-200 hover:bg-indigo-700 hover:text-white text-sm font-semibold leading-6'
                      )}
                    >
                      <Cog6ToothIcon
                        className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                        aria-hidden="true"
                      />
                      <p className={classNames(
                        'transition-all ease-in-out', expanded ? 'opacity-100 delay-150' : 'opacity-0', 'duration-200',
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

        <div className="relative flex flex-col pl-20 h-screen">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">

            {/* Separator */}
            {/* <div className="h-6 w-px bg-gray-900/10" aria-hidden="true" /> */}

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="relative flex flex-1" action="#" method="GET">
                {/* <label htmlFor="search-field" className="sr-only">
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
                /> */}
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">

                <div className="flex flex-row items-center">
                  <p className="text-sm text-gray-400 pr-3">Reference currency:</p>
                  <Dropdown
                    name='intervalType'
                    options={currencies}
                    nullOption={nullRefCur}
                    selectedOption={referenceCurrency.name}
                    onSelect={handleReferenceCurrency}
                    className="w-40 rounded-md bg-white hover:bg-gray-50"
                  />
                </div>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

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
                              href={item.slug}
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
            <RefCurContext.Provider value={{ referenceCurrency }}>
              <ToastProvider>
                {children}
                <ToastGroup />
              </ToastProvider>
            </RefCurContext.Provider>

        </div>
      </div>
    </>
  )
}


// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <Layout>{children}</Layout>
//       </body>
//     </html>
//   );
// }
