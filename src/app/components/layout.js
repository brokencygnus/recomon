'use client'
import "../globals.css";
import { createContext, useCallback, useEffect, useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { SidebarSimple, HouseSimple, Package, Camera, Code, Newspaper, BugBeetle, Gear, List} from "@phosphor-icons/react"
import { enabledCurrencies as currencies } from '@/app/utils/currencies'
import { CurrencyIcon } from "@/app/components/currency_icon";
import { formatNumber, convertCurrency } from '@/app/utils/utils';
import { ToastProvider, ToastGroup } from '@/app/components/toast'
import { AlertProvider, AlertGroup } from '@/app/components/notifications/alert'
import { NotificationMenu } from '@/app/components/notifications/notification_menu'
import { Breadcrumbs } from "@/app/components/breadcrumbs";
import { Dropdown } from "@/app/components/dropdown";
import { KeyboardHotkey } from "@/app/components/KeyboardHotkey";
import { config } from "@/app/constants/config";
import { NotificationBadges } from "./notifications/notification_badges";


// mock data start

import { businessUnits } from "@/app/constants/mockdata/mockdata";
import { menusNotifications } from "@/app/constants/mockdata/notification_mockdata";

// mock data end


const businessUnitNav = structuredClone(businessUnits)
  .concat({ id: 0, name: 'View All', href: '/business-units' })


const navigation = [
  { code: 'dash', name: 'Dashboard', href: '/dashboard', icon: HouseSimple, submenus: []},
  { code: 'bu', name: 'Business Units', href: '/business-units', icon: Package, submenus: businessUnitNav},
  { code: 'snap', name: 'Snapshots', href: '/snapshots', icon: Camera, submenus: []},
  { code: 'api', name: 'Manage APIs', href: '/api-list', icon: Code, submenus: []},
  { code: 'log', name: 'Activity Log', href: '/activity-log', icon: Newspaper, submenus: []},
]


config.env !== 'prod' && navigation.push({ code: 'dbug', name: 'Debug', href: '/debug', icon: BugBeetle, submenus: []})


const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


// Context to configure reference currency on the sticky header
export const RefCurContext = createContext({});


// Import this if you want to use RefCurContext
export const convertedCurrency = (amount, currency, referenceCurrency, signed=false) => {
  let convertedAmount = ""
  let currencySymbol = ""
  let approxSymbol = ""
  let sign = ""

  if (signed && amount > 0) {
    sign = "+"
  }

  if (referenceCurrency?.value !== 'self' && currency !== referenceCurrency?.value) {
    convertedAmount = formatNumber(convertCurrency(amount, currency, referenceCurrency?.value))
    currencySymbol = referenceCurrency?.value
    approxSymbol = "≈ "
  } else {
    let amountRounded = +parseFloat(amount).toFixed(8)
    convertedAmount = formatNumber(amountRounded)
    currencySymbol = currency
  }
  return approxSymbol + sign + convertedAmount + " " + currencySymbol
}


export default function Layout({ children, breadcrumbPages, currentTab }) {
  const [isExpanded, setExpanded] = useState(false)
  const [keepExpanded, setKeepExpanded] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [referenceCurrency, setReferenceCurrency] = useState({ noSelectionLabel:"None", name:"None", value:"self" })

  const nullRefCur = { noSelectionLabel:"None", name:"None", value:"self"}

  const currencyOptions = currencies.map(currency => ({ name: currency.name, value: currency.symbol, icon: <CurrencyIcon size="xs" symbol={currency.symbol} /> }))

  const openSidebar = () => {
    !isExpanded && setKeepExpanded(false)
    setExpanded(true)
  };

  const openSidebarAndKeepOpen = () => {
    setExpanded(true)
    setKeepExpanded(true)
  };

  const closeSidebar = () => {
    !keepExpanded && setExpanded(false)
  };

  const forceCloseSidebar = () => {
    setExpanded(false)
    setHoveredMenu(null)
  };

  const handleMouseEnterMenu = (name) => {
    const id = name
    setHoveredMenu(id)
  };

  const handleMouseLeaveMenu = () => {
    setHoveredMenu(null)
  };

  const handleReferenceCurrency = (event) => {
    const { value } = event.target
    setReferenceCurrency(value)
  }
  
  return (
    <>
      <div>
        <KeyboardHotkey hotkey={"Escape"} callback={forceCloseSidebar}/>
        <div 
          onClick={forceCloseSidebar}
          className={classNames(
            'transition-opacity ease-in-out', isExpanded ? 'w-screen opacity-75' : 'w-0 opacity-0', 'duration-300',
            "fixed inset-0 max-w-screen h-screen z-[60] bg-gray-500")}
        />
        <div
          onMouseEnter={openSidebar}
          onMouseLeave={closeSidebar}
          className={classNames(
            'transition-all ease-in-out', isExpanded ? 'w-72' : 'w-20', 'duration-300',
            "fixed inset-y-0 left-0 z-[61] block w-20 overflow-visible bg-stone-600 pb-10"
          )}>
          <div className="flex flex-col h-full px-4 justify-start">
            <div className="flex pt-6 shrink-0 items-center justify-center">
              <svg
                className="h-8 w-auto fill-stone-400"
                width="208" height="199" viewBox="0 0 224 199" fill="none" xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M166 0H191C199.284 0 206 6.71573 206 15V30C206 38.2843 199.284 45 191 45H166V0Z" fill=""/>
                <path d="M186 154H209C217.284 154 224 160.716 224 169V184C224 192.284 217.284 199 209 199H186V154Z" fill=""/>
                <path d="M148 77H173C181.284 77 188 83.7157 188 92V107C188 115.284 181.284 122 173 122H148V77Z" fill=""/>
                <rect x="18" width="160" height="45" fill=""/>
                <rect x="36" y="154" width="160" height="45" fill=""/>
                <rect y="77" width="160" height="45" fill=""/>
              </svg>
            </div>
            <div className="flex flex-col flex-grow justify-between">
              <nav className="mt-8">
                <ul role="list" className="flex flex-1 flex-col items-start gap-y-1">
                  {navigation.map((navMenu) => (
                    <li
                      onMouseEnter={() => handleMouseEnterMenu(navMenu.name)}
                      onMouseLeave={handleMouseLeaveMenu}
                      key={navMenu.name}
                      className="relative w-full">
                      <a
                        href={navMenu.href}
                        className={classNames(
                          navMenu.code == currentTab ? 'bg-stone-700 text-white' : hoveredMenu === navMenu.name ? 'bg-stone-700 text-white' : 'text-stone-200',
                          'transition-all ease-in-out', isExpanded ? 'w-64 delay-75' : 'w-12', 'duration-300',
                          'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6'
                        )}
                      >
                        <navMenu.icon
                          weight="bold" className={classNames(
                            navMenu.code == currentTab ? 'text-white' : hoveredMenu === navMenu.name ? 'text-white' : 'text-stone-200',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {menusNotifications.find(menu => menu.code === navMenu.code).notifications && (
                          <div className="absolute top-1.5 right-1.5">
                            <svg viewBox="0 0 2 2" className="h-2.5 w-2.5 rounded-full fill-red-500">
                              <circle cx={1} cy={1} r={1} />
                            </svg>
                          </div>
                        )}
                        <p className={classNames(
                          'transition-all ease-in-out duration-200', isExpanded ? 'opacity-100' : 'opacity-0 invisible',
                          'text-nowrap',
                        )}>
                          {navMenu.name}
                        </p>
                        <span className="sr-only">{navMenu.name}</span>
                      </a>
                      { navMenu.code === "bu" ?
                          <Transition
                            show={hoveredMenu === navMenu.name}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-x-56"
                            enterTo="opacity-100 translate-x-52"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-x-52"
                            leaveTo="opacity-0 translate-x-56"
                          >
                            { navMenu.submenus && navMenu.submenus.length > 0 && (
                              <div className="absolute left-12 top-0">
                                {/* Hacky way to extend the hover surface */}
                                <div
                                  className={classNames(
                                    "ml-8",
                                    "rounded-md bg-white shadow-sm border border-gray-200"
                                )}>
                                  <dl className="flex flex-col divide-y-2 divide-gray-200 text-sm leading-6">
                                    { navMenu.submenus.map((submenu) => (
                                      <a
                                        key={submenu.id}
                                        href={submenu.href ?? "/business-units/" + submenu.slug}
                                        className="group flex items-center px-6 py-3 hover:bg-gray-100"
                                      >
                                        <dt className="h-6 text-gray-600 text-nowrap font-medium group-hover:text-gray-800">
                                          <div className="flex w-48 items-center justify-between gap-x-3">
                                            {submenu.name}
                                            {submenu.alerts && submenu.alerts.length !== 0 &&
                                              <div className="flex gap-x-1">
                                                <NotificationBadges size="sm" alerts={submenu.alerts}/>
                                              </div>
                                            }
                                          </div>
                                        </dt>
                                      </a>
                                    ))}
                                  </dl>
                                </div>
                              </div>
                            )}
                          </Transition>
                        :
                        // If for some reason other menus other than business unit
                        // needs their submenus, add their logic here.
                        null}
                      </li>
                    ))}
                  </ul>
                </nav>
                <ul role="list" className="flex h-full flex-1 flex-col items-start justify-end gap-y-3">
                  <li
                    className="mt-auto"
                  >
                    <a
                      href="/settings"
                      className={classNames(
                        'transition-all ease-in-out', isExpanded ? 'w-60 delay-75' : 'w-12', 'duration-300',
                        'group flex gap-x-3 rounded-md p-3 text-stone-200 hover:bg-stone-700 hover:text-white text-sm font-semibold leading-6'
                      )}
                    >
                      <Gear
                        weight="bold"
                        className="h-6 w-6 shrink-0 text-stone-200 group-hover:text-white"
                        aria-hidden="true"
                      />
                      <p className={classNames(
                        'transition-all ease-in-out', isExpanded ? 'opacity-100 delay-150' : 'opacity-0', 'duration-200',
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

        <div style={{ scrollbarGutter: "stable" }} className="relative flex flex-col pl-20 bg-white h-screen w-screen overflow-auto">
          <div className="fixed w-full top-0 -ml-20 pr-8 pl-28 h-16 z-50 flex shrink-0 items-center gap-x-1 border-b border-zinc-200 bg-white shadow-sm">
            <button
              onClick={openSidebarAndKeepOpen}
              className="flex rounded-lg hover:bg-zinc-50"
            >
              <SidebarSimple
                weight="bold" 
                className="size-5 m-1 shrink-0 text-zinc-500 hover:text-zinc-700"
                aria-hidden="true"
              />
            </button>
            <div
              name="separator"
              className="flex justify-center items-center size-4 m-1"
              aria-hidden="true"
            >
              <div className="h-4 w-0.5 bg-zinc-300" aria-hidden="true" />
            </div>

            <div className="flex flex-1 self-stretch lg:gap-x-6">
              <div className="flex items-center flex-1">
                <Breadcrumbs breadcrumbPages={breadcrumbPages} />
              </div>
              {/* <div className="relative flex flex-1" action="#" method="GET">
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
              </div> */}
              <div className="flex items-center gap-x-2">

                <div className="flex flex-row items-center gap-x-1">
                  <p className="text-sm text-zinc-600">Reference currency:</p>
                  <Dropdown
                    name='intervalType'
                    options={currencyOptions}
                    nullOption={nullRefCur}
                    selectedOption={referenceCurrency.name}
                    selectedIcon={referenceCurrency.icon}
                    onSelect={handleReferenceCurrency}
                    className="w-40 rounded-md bg-white hover:bg-gray-50"
                  />
                </div>

                <NotificationMenu />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="group flex items-center gap-x-2">
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center outline outline-1 outline-zinc-200 py-1 p-1 gap-x-1 rounded-full group-hover:bg-zinc-50 group-hover:outline-zinc-300">
                      <List
                        weight="bold"
                        className="size-5 shrink-0 text-zinc-500 hover:text-zinc-500 group-hover:text-zinc-700"
                        aria-hidden="true"
                      />
                      <img
                        className="h-7 w-7 rounded-full bg-gray-50 object-cover"
                        src="/profile.jpg"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col items-start gap-y-1">
                      <p className="text-sm font-semibold leading-6 text-zinc-800 leading-none">
                          Christian Hsieh
                      </p>
                      <p className="text-xs leading-6 text-zinc-600 leading-none">
                        IP: 127.0.0.1
                      </p>
                    </div>
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

          <div className="grow pt-16">
            <RefCurContext.Provider value={{ referenceCurrency }}>
              <ToastProvider>
                <AlertProvider>
                  {children}
                  <ToastGroup />
                  <AlertGroup />
                </AlertProvider>
              </ToastProvider>
            </RefCurContext.Provider>
          </div>

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
