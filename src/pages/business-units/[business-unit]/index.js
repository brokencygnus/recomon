import { useRouter } from 'next/router';
import { useEffect, useContext, useMemo, useState, createContext } from 'react'
import Link from 'next/link';
import { formatNumber } from '@/app/utils/utils';
import { convertMsToTimeAgo, convertAgeMsToDateTime } from '@/app/utils/dates';
import { discrepancyColor, getDiscrLvl } from '@/app/utils/business-units/discrepancy-color'
import { dataSources } from '@/app/constants/types'
import Layout, { RefCurContext, convertedCurrency } from '@/app/components/layout';
import { PopoverComp } from '@/app/components/popover';
import ClientOnly from '@/app/components/csr';
import { EditableField } from '@/app/components/editablefield'
import { ToastContext } from '@/app/components/toast';
import { CurrencyIcon } from '@/app/components/currency_icon';
import { config } from '@/app/constants/config';
import { ChevronRightIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import { NotificationBadges } from '@/app/components/notifications/notification_badges';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Mock data start

import { businessUnits } from '@/app/constants/mockdata/mockdata'
import { exchangeCurrencies, exchangeSummary } from "@/app/constants/mockdata/exchange_mockdata";

// Mock data end

export default function SummaryPage() {
  const router = useRouter()

  const businessUnitSlug = router.query["business-unit"];

  // Fetch data for this business unit
  const businessUnit = useMemo(() => {
    try {
      return businessUnits.find((businessUnit) => businessUnit.slug == businessUnitSlug)
    } catch (error) {
      // TODO should give 404
    }
  }, [businessUnitSlug])

  const breadcrumbPages = [
    { name: 'Business Units', href: '/business-units', current: false },
    { name: businessUnit?.name, href: '#', current: true },
  ]

  const [buAlerts, setBuAlerts] = useState([])

  const addBuAlerts = (newAlert) => {
    if (!buAlerts.some(alert => alert === newAlert)) {

      // Critical currency blocks unacceptable currency
      if (!(newAlert === "gap_unacceptable_currency" && buAlerts.some(alert => alert === "gap_critical_currency"))) {
        setBuAlerts([...buAlerts, newAlert])
      }
      // Critical currency replaces unacceptable currency
      if (newAlert === "gap_critical_currency" && buAlerts.some(alert => alert === "gap_unacceptable_currency")) {
        const newBuAlerts = buAlerts.filter(alert => alert !== "gap_unacceptable_currency")
        setBuAlerts([...newBuAlerts, newAlert])
      }
    }
  }

  switch (getDiscrLvl({
    discrepancy: exchangeSummary.discrepancy,
    discrAlertConf: exchangeSummary.discrAlertConf,
    capital: exchangeSummary.capital
  })) {
    case "critical":
      addBuAlerts("gap_critical_entireBU")
      break
    case "unacceptable":
      addBuAlerts("gap_unacceptable_entireBU")
      break
  }
  
  return (
    <Layout currentTab="bu" breadcrumbPages={breadcrumbPages} >
      <main className="min-h-full pt-6 pb-12 px-12 2xl:px-16 bg-stone-100">
        <ReconciliationHeader
          businessUnit={businessUnit}
          buAlerts={buAlerts}
        />
        <div className="flex grow flex-col">
          <ReconciliationSection
            businessUnit={businessUnit}
            currencyData={exchangeCurrencies}
            summaryData={exchangeSummary}
            addBuAlerts={addBuAlerts}
          />
        </div>
      </main>
    </Layout>
  );
}

export function ReconciliationHeader({ businessUnit, snapshotID=undefined, buAlerts }) {
  return (
    <div className="flex items-center mb-4">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <div className="flex items-center gap-x-3">
                <div className="flex items-baseline gap-x-3">
                  <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">{businessUnit?.name}</h1>
                  <p className="text-xl font-medium leading-tight tracking-tight text-gray-400">{businessUnit?.code}</p>
                </div>
                <div className="flex gap-x-2">
                  <ClientOnly>
                    <NotificationBadges size="md" alerts={buAlerts} />
                  </ClientOnly>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700">
                {businessUnit?.description ?? "View your tracked currencies in this business unit and monitor their discrepancies."}
              </p>
            </div>
          </header>
        </div>
      </div>
      {!snapshotID ?
        <div className="flex items-end">
          <div className="flex flex-row justify-items-end">
            <div className="flex mx-4 items-end">
              <a
                href={`/snapshots?business-unit=${businessUnit?.slug}`}
                className="h-10 flex text-nowrap items-center rounded px-2 mx-4 py-1 text-sm font-semibold text-sky-600 hover:text-sky-900"
              >
                View snapshots
              </a>
              <a
                href={`/business-units/${businessUnit?.slug}/accounts`}
                className="h-10 flex text-nowrap items-center rounded px-2 py-1 text-sm font-semibold text-sky-600 hover:text-sky-900"
              >
                View all accounts
              </a>
            </div>
          </div>
          {/* <button
            type="button"
            className="ml-4 block rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Add currency
          </button> */}
        </div>
      : null }
    </div>
  );
}

export function ReconciliationSection({ businessUnit, currencyData, summaryData, snapshotID=undefined, snapshotTime, addBuAlerts }) {
  const { referenceCurrency } = useContext(RefCurContext)

  const colors = {
    crit: "text-red-600",
    acctble: "text-amber-600",
    default: "text-gray-700"
  }

  const router = useRouter()
  const currentCurrency = router.query.currency

  const changeCurrency = (currency) => {
    let newCurrency = null
    if (currentCurrency == currency) {
      newCurrency = null
    } else {
      newCurrency = currency
    }

    if (!snapshotID) {
      router.replace({
        pathname: '/business-units/[business-unit]',
        query: {
          'business-unit': businessUnit.slug,
          'currency': newCurrency
        }
      }, 
      `/business-units/${businessUnit.slug}?currency=${newCurrency}`, 
      { shallow: true })
    } else {
      router.replace({
        pathname: '/business-units/[business-unit]/snapshot/[snapshot-id]',
        query: {
          'business-unit': businessUnit.slug,
          'snapshot-id': snapshotID,
          'currency': newCurrency
        }
      }, 
      `/business-units/${businessUnit.slug}/snapshot/${snapshotID}?currency=${newCurrency}`, 
      { shallow: true })
    }
  };

  // Wipe effect
  // I needed to scour stackoverflow for this
  // https://stackoverflow.com/a/26476282
  useEffect(() => {
    currencyData.forEach(currency => {
      const element = document.getElementById(currency.symbol + "-table")

      if (currentCurrency == currency.symbol) { 
        element.style.height = element.scrollHeight + 'px'
        element.style.opacity = 1
      } else {
        element.style.height = '0px';
        element.style.opacity = 0
      }
    })
  }, [currentCurrency])

  const stats = [
    { name: 'Total capital', value: convertedCurrency(summaryData.capital, config.collateCurrency, referenceCurrency) },
    { name: 'Total assets', value: convertedCurrency(summaryData.assets, config.collateCurrency, referenceCurrency) },
    { name: 'Total liabilities', value: convertedCurrency(summaryData.liabilities, config.collateCurrency, referenceCurrency) },
    { name: 'Gap',
      value: convertedCurrency(summaryData.discrepancy, config.collateCurrency, referenceCurrency, true),
      change: (summaryData.discrepancy / summaryData.capital * 100).toFixed(2) + '%'
    },
  ]  

  const bgColors = {
    crit: "from-red-500 to-pink-500",
    acctble: "from-amber-500 to-orange-500",
    default: "from-sky-500 to-blue-500"
  }
  
  return (
    <>
      <div id={"summary"} key={"summary"}>

        <div className="relative bg-white rounded-lg ring-1 ring-inset ring-gray-300/5 shadow-md overflow-hidden">
          <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5 z-[12]">
            <dl className="mx-auto grid max-w-7xl grid-cols-4">
              {stats.map((stat, statIdx) => (
                <div
                  key={stat.name}
                  className={classNames(
                    statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
                    'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 z-[12] px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8',
                  )}
                >
                  <dt className="text-sm font-medium leading-6 text-gray-500">{stat.name}</dt>
                  {stat.change && 
                    <dd className='text-xs font-medium'>
                      <span className={classNames(
                        stat.name === 'Gap' && discrepancyColor({
                          discrepancy: summaryData.discrepancy,
                          discrAlertConf: summaryData.discrAlertConf,
                          capital: summaryData.capital,
                          colors: colors
                        })
                      )}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500"> of capital</span>
                    </dd>
                  }
                  <dd className={classNames(
                    stat.name === 'Gap' && discrepancyColor({
                      discrepancy: summaryData.discrepancy,
                      discrAlertConf: summaryData.discrAlertConf,
                      capital: summaryData.capital,
                      colors: colors
                    }), "w-full flex-none text-2xl font-medium leading-10 tracking-tight"
                  )}>
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          
          {/* Header */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 transform-gpu opacity-20 blur-3xl sm:transform-gpu sm:opacity-50"
          >
            <div
              style={{
                clipPath:
                  'polygon(30% 0%, 64% 7%, 72% 35%, 100% 21%, 100% 100%, 31% 100%, 39% 22%, 0% 15%)',
              }}
              className={`size-full h-96 bg-gradient-to-br ${discrepancyColor({
                discrepancy: summaryData.discrepancy,
                discrAlertConf: summaryData.discrAlertConf,
                capital: summaryData.capital,
                colors: bgColors
              })}`}
            />
          </div>
        
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-50% via-white/80 to-80% to-transparent z-[11]"/>
        </div>

        {/* Old header */}
        {/* <div className="w-full px-4 sm:px-6 lg:px-8 p-4 rounded-lg mb-4">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="grid grid-cols-6">
                <div className="flex col-span-2 items-center gap-x-3">
                  <p className="whitespace-nowrap text-lg text-gray-600">All currencies</p>
                  <div className="flex gap-x-2 pl-2">
                    <ClientOnly>
                      <NotificationBadges size="md" alerts={buAlerts} />
                    </ClientOnly>
                </div>
                </div>
                <div className="flex flex-col justify-start text-left">
                  <p scope="col" className="pr-3 text-sm font-medium leading-6 text-gray-500">
                    Total capital
                  </p>
                  <p className="whitespace-nowrap text-md font-medium text-gray-700">{convertedCurrency(summaryData.capital, config.collateCurrency, referenceCurrency)}</p>
                </div>
                <div className="flex flex-col justify-start text-left">
                  <p scope="col" className="pr-3 text-sm font-medium leading-6 text-gray-500">
                    Total assets
                  </p>
                  <p className="whitespace-nowrap text-md font-medium text-gray-700">{convertedCurrency(summaryData.assets, config.collateCurrency, referenceCurrency)}</p>
                </div>
                <div className="flex flex-col justify-start text-left">
                  <p scope="col" className="pr-3 text-sm font-medium leading-6 text-gray-500">
                    Total liabilities
                  </p>
                  <p className="whitespace-nowrap text-md font-medium text-gray-700">{convertedCurrency(summaryData.liabilities, config.collateCurrency, referenceCurrency)}</p>
                </div>
                <div className="flex flex-col justify-start text-left">
                  <p scope="col" className="pr-3 text-sm font-medium leading-6 text-gray-500">
                    Gap
                  </p>
                  <p className={classNames(
                    discrepancyColor({
                      discrepancy: summaryData.discrepancy,
                      discrAlertConf: summaryData.discrAlertConf,
                      capital: summaryData.capital,
                      colors: colors
                    }),
                    "whitespace-nowrap text-md font-medium")}>
                    {convertedCurrency(summaryData.discrepancy, config.collateCurrency, referenceCurrency, true)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="px-3 mb-8">
          <div 
            id={"summary-table"}
            style={{ height: '0px', transition: 'height 0.5s ease-in-out' }}
            className="bg-white rounded-b-lg border-x border-b border-gray-200 shadow-md overflow-hidden"
          >
            charts here maybe?
          </div>
        </div> */}
      </div>
      {currencyData.map(currency => 
      <div id={currency.symbol} key={currency.symbol}>
        <DetailsHeader 
          currency={currency}
          referenceCurrency={referenceCurrency}
          changeCurrency={changeCurrency}
          addBuAlerts={addBuAlerts}
        />
        <div className="px-3">
          <div 
            id={currency.symbol + "-table"}
            style={{
              height: '0px',
              opacity: 0,
              marginBottom: currentCurrency == currency.symbol? '48px' : '0px',
              transition: currentCurrency == currency.symbol? ['height 0.3s ease-in-out', "opacity 0.2s"] : ['height 0.5s ease-in-out', "opacity 1s"]
            }}
            className="bg-white rounded-b-lg border-x border-b border-gray-200 shadow-md overflow-hidden"
          >
            <DetailsTable
              businessUnit={businessUnit}
              accounts={currency.capitals}
              total={currency.capitalTotal}
              type={"capital"}
              symbol={currency.symbol}
              snapshotID={snapshotID}
            >
              <h1 className="text-base font-semibold leading-6 text-gray-900">Capitals</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of capital sources from owners, stakeholders, etc.
              </p>
            </DetailsTable>
            <DetailsTable
              businessUnit={businessUnit}
              accounts={currency.assets}
              total={currency.assetTotal}
              type={"asset"}
              symbol={currency.symbol}
              snapshotID={snapshotID}
              snapshotTime={snapshotTime}
            >
              <h1 className="text-base font-semibold leading-6 text-gray-900">Assets</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of available cryptocurrency or fiat resources.
              </p>
            </DetailsTable>
            <DetailsTable
              businessUnit={businessUnit}
              accounts={currency.liabilities}
              total={currency.liabilityTotal}
              type={"liability"}
              symbol={currency.symbol}
              snapshotID={snapshotID}
              snapshotTime={snapshotTime}
            >
              <h1 className="text-base font-semibold leading-6 text-gray-900">Liabilities</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of obligations or debts owed to customers or counterparties.
              </p>
            </DetailsTable>
          </div>
        </div>
      </div>
      )}
    </>
  )

  function DetailsHeader({ currency, referenceCurrency, changeCurrency, addBuAlerts }) {
    const convert = (amount) => convertedCurrency(amount, currency.symbol, referenceCurrency)
    const convertSigned = (amount) => convertedCurrency(amount, currency.symbol, referenceCurrency, true)
    // const convertUSD = (amount) => convertCurrency(amount, currency.symbol, config.collateCurrency)

    const [currencyAlerts, setCurrencyAlerts] = useState([])

    const addCurrencyAlerts = (newAlert) => {
      if (!currencyAlerts.some(alert => alert === newAlert)) {
          setCurrencyAlerts([...currencyAlerts, newAlert])
      }
    }
    
    switch (getDiscrLvl({
      discrepancy: currency.discrepancy,
      discrAlertConf: currency.discrAlertConf,
      capital: currency.capitalTotal,
      symbol: currency.symbol
    })) {
      case "critical":
        addCurrencyAlerts("gap_critical_currency")
        addBuAlerts("gap_critical_currency")
        break
      case "unacceptable":
        addCurrencyAlerts("gap_unacceptable_currency")
        addBuAlerts("gap_unacceptable_currency")
        break
    }

    const accountAlert = (accountGroup) => {
      accountGroup.forEach(account => {
        if (account.alerts) {
          account.alerts.forEach(newAlert => {
            addBuAlerts(newAlert)
            addCurrencyAlerts(newAlert)
          })
        }
      })
    }

    accountAlert(currency.capitals)
    accountAlert(currency.assets)
    accountAlert(currency.liabilities)

    // TODO tooltip is cut off if unexpanded, z index does not work.
    return (
      <div className="sticky top-0 mt-3 z-10">
        <div className="w-full h-3 bg-stone-100"/>
        <div
          onClick={() => changeCurrency(currency.symbol)}
          className="w-full px-4 sm:px-6 lg:px-8 p-4 rounded-lg border border-gray-200 shadow-md bg-white hover:bg-gray-50"
        >
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="grow grid grid-cols-6">
                <div className="flex col-span-2 items-center gap-x-3">
                  <ChevronRightIcon className={classNames(
                      "h-5 w-5 text-gray-500", currency.symbol == currentCurrency ? "rotate-90" : "rotate-0"
                    )}
                  />
                  <CurrencyIcon size="sm" symbol={currency.symbol}/>
                  <p className="whitespace-nowrap text-lg text-gray-600">{currency.name} &#40;{currency.symbol}&#41;</p>
                  <div className="flex gap-x-2 pl-2">
                    <ClientOnly>
                      <NotificationBadges size="md" message={"currency"} alerts={currencyAlerts} />
                    </ClientOnly>
                  </div>
                </div>
                <div className="flex flex-col justify-start text-left">
                  <p scope="col" className="pr-3 text-xs font-medium leading-6 text-gray-500">
                    Total capital
                  </p>
                  <p className="whitespace-nowrap text-sm 2xl:text-base text-gray-700">{convert(currency.capitalTotal)}</p>
                </div>
                <div className="flex flex-col justify-start text-left">
                  <p scope="col" className="pr-3 text-xs font-medium  leading-6 text-gray-500">
                    Total assets
                  </p>
                  <p className="whitespace-nowrap text-sm 2xl:text-base text-gray-700">{convert(currency.assetTotal)}</p>
                </div>
                <div className="flex flex-col justify-start text-left">
                  <p scope="col" className="pr-3 text-xs font-medium  leading-6 text-gray-500">
                    Total liabilities
                  </p>
                  <p className="whitespace-nowrap text-sm 2xl:text-base text-gray-700">{convert(currency.liabilityTotal)}</p>
                </div>
                <div className="flex flex-col justify-start text-left">
                  <p scope="col" className="pr-3 text-xs font-medium leading-6 text-gray-500">
                    Gap
                  </p>
                  <p className={classNames(discrepancyColor({
                    discrepancy: currency.discrepancy,
                    discrAlertConf: currency.discrAlertConf,
                    capital: currency.capitalTotal,
                    symbol: currency.symbol,
                    colors: colors
                  }),
                    "whitespace-nowrap text-sm 2xl:text-base")}>
                    {convertSigned(currency.discrepancy)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function DetailsTable({ businessUnit, accounts, total, type, symbol, snapshotID=undefined, snapshotTime=new Date(), children }) {
    const { referenceCurrency } = useContext(RefCurContext)
  
    const convert = (amount) => convertedCurrency(amount, symbol, referenceCurrency)

    const { addToast } = useContext(ToastContext)
    const launchSaveToast = () => {
      addToast({ color: "green", message: "Account balance saved!" })
    }
    const launchMarkToast = () => {
      addToast({ color: "sky", message: "Marked account as up-to-date." })
    }

    const handleSave = () => {
      // Insert API implementation here
      launchSaveToast()
    }

    const markAsUpdated = () => {
      // Insert API Implementation here
      launchMarkToast()
    }

    return (
      <>
        <div className="bg-zinc-50 border-y border-gray-200 px-4 sm:px-6 lg:px-6 mb-4 py-4">
          <div className="flex items-center">
            <div className="flex-auto">
              {children}
            </div>
            {!snapshotID ? 
              <div className="flex items-end">
                <Link
                  href={{
                    pathname: `/business-units/${businessUnit?.slug}/accounts`,
                    query: { action: 'new', "account-type": type, currency: symbol },
                  }}
                  className="text-sky-600 hover:text-sky-900"
                >
                  <button className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Add account
                  </button>
                </Link>
              </div>
            : null }
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 mt-4 mb-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-700">
                      Code
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                      Account Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                      Balance
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                      Balance &#40;converted&#41;
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                      Data source
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                      {snapshotID ? "Data age at snapshot" : "Data age"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr key={account.code} className="bg-white hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-2 pr-3 text-sm text-gray-500">{account.code}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600">
                        <div className="flex gap-x-3">
                          {account.name}
                          {account.alerts && account.alerts.length !== 0 &&
                          <div className="flex gap-x-2 pl-2">
                            <ClientOnly>
                              <NotificationBadges size="md" message={"account"} alerts={account.alerts} />
                            </ClientOnly>
                          </div>
                          }
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 text-sm text-gray-500">
                        { !snapshotID && account.dataSource == "manual" ?
                          <EditableField
                            onSave={handleSave}
                            inputClass="block px-2 py-1 rounded-md border-0 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
                            pClass="text-sm py-2 text-gray-500"
                            defaultValue={account.balance}
                            unit={symbol}
                          >                          
                            {formatNumber(+parseFloat(account.balance).toFixed(8)) + " " + symbol}
                          </EditableField>
                        : 
                          <>
                            {formatNumber(+parseFloat(account.balance).toFixed(8)) + " " + symbol}
                          </>
                        }
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{convert(account.balance)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dataSources.find((data) => data.value == account.dataSource).name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="w-fit flex gap-x-3">
                          <ClientOnly>
                            <PopoverComp position="top">
                              {/* TODO when converting to API-consumed data, please implement snapshot time instead of new Date() for snapshots */}
                              <p className="hover:text-sky-600">{convertMsToTimeAgo(account.ageMS - (new Date().getMilliseconds() + snapshotTime.getMilliseconds()))}</p>
                              <p className="text-sm text-gray-900">{convertAgeMsToDateTime(account.ageMS - (new Date().getMilliseconds() + snapshotTime.getMilliseconds()))}</p>
                            </PopoverComp>
                            {/* Somehow the following <button> needs to be CSR for some reason
                                The above <p>s are client only because of the data, there should
                                be no reason why the <button>s triggers hydration errors ??? */}
                            {!snapshotID && account.dataSource == "manual" &&
                              <PopoverComp position="top">
                                <button className="text-gray-500 hover:text-sky-600"
                                  onClick={markAsUpdated}
                                >  
                                  <DocumentCheckIcon 
                                    className="h-4 w-4"
                                  />
                                </button>
                                <p className="text-sm text-gray-900">Mark as up-to-date</p>
                              </PopoverComp>
                            }
                          </ClientOnly>
                        </div>
                      </td>
                      {!snapshotID ?
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-2 text-right text-sm font-semibold">
                          <Link
                            href={{
                              pathname: `/business-units/${businessUnit?.slug}/accounts`,
                              query: { action: 'edit', edit: account.code },
                            }}
                            className="text-sky-600 hover:text-sky-900"
                          >
                            Configure<span className="sr-only">, {account.name}</span>
                          </Link>
                        </td>
                      : null }
                    </tr>
                  ))}
                </tbody>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                  <td className="py-4 pl-4 pr-3 sm:pl-0"></td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">Total</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">{formatNumber(+parseFloat(total).toFixed(8)) + " " + symbol}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">{convert(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    )
  }
}

// Not used anymore since the last UI change

// function AssetPicker({ changeCurrency, currentCurrency }) {
//   const { referenceCurrency } = useContext(RefCurContext)

//   const convertSigned = (amount, currency) => convertedCurrency(amount, currency, referenceCurrency, true)

//   const [hoveredItem, setHoveredItem] = useState(null);
  
//   const baseColors = {
//     crit: "text-red-400",
//     acctble: "text-amber-400",
//     default: "text-gray-500"
//   }
  
//   const highlightColors = {
//     crit: "text-red-500",
//     acctble: "text-amber-500",
//     default: "text-gray-600"
//   }

//   return (
//     <nav className="flex flex-1 flex-col">
//       <ul role="list" className="space-y-2">
//         <li
//           onClick={() => changeCurrency("summary")}
//           onMouseEnter={() => setHoveredItem("summary")}
//           onMouseLeave={() => setHoveredItem(null)}
//           className={classNames(
//             "summary" === currentCurrency || "summary" === hoveredItem ? 'bg-gray-50' : '',
//             'rounded-md py-2 mr-2 hover:cursor-pointer'
//           )}
//           >
//           <a
//             className={classNames(
//               "summary" === currentCurrency || "summary" === hoveredItem ? 'text-sky-600' : 'text-gray-500',
//               "flex pl-4 text-sm font-semibold leading-6"
//             )}
//           >
//             Summary
//           </a>
//         </li>
//         <li className='text-gray-700 flex rounded-md py-1 text-md font-semibold leading-6'>Details per currency</li>
//         {exchangeCurrencies.map((currency) => (
//           <li
//             onClick={() => changeCurrency(currency.symbol)}
//             onMouseEnter={() => setHoveredItem(currency.symbol)}
//             onMouseLeave={() => setHoveredItem(null)}
//             className={classNames(
//               currency.symbol === currentCurrency || currency.symbol === hoveredItem ? 'bg-gray-50' : '',
//               'rounded-md py-2 hover:cursor-pointer'
//             )}
//             >
//             <a
//               className={classNames(
//                 currency.symbol === currentCurrency || currency.symbol === hoveredItem ? 'text-sky-600' : 'text-gray-500',
//                 "flex pl-4 text-sm font-semibold leading-6"
//               )}
//             >
//               {currency.name}
//             </a>
//             <a
//               className={classNames(
//                 currency.symbol === currentCurrency || currency.symbol === hoveredItem ? 'text-gray-600' : 'text-gray-400',
//                 "flex rounded-md pl-4 text-xs font-semibold leading-6"
//               )}
//             >
//               Gap:&nbsp;
//               <span className={discrepancyColor(
//                   convertCurrency(currency.discrepancy, currency.symbol, "USD"),
//                   discrAlertConf,
//                   currency.symbol === currentCurrency || currency.symbol === hoveredItem ? highlightColors : baseColors)}>
//                 {convertSigned(currency.discrepancy, currency.symbol)}
//               </span>
//             </a>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   )
// }