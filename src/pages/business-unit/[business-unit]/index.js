import { useRouter } from 'next/router';
import { useEffect, useContext, useMemo } from 'react'
import Link from 'next/link';
import { formatNumber, convertCurrency } from '@/app/utils/utils';
import { convertMsToTimeAgo, convertAgeMsToDateTime } from '@/app/utils/dates';
import { discrepancyColor } from '@/app/utils/business-units/discrepancy-color'
import { dataSources } from '@/app/constants/types'
import Layout, { RefCurContext, convertedCurrency } from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { PopoverComp } from '@/app/components/popover';
import ClientOnly from '@/app/components/csr'
import { EditableField } from '@/app/components/editablefield'
import { ToastContext } from '@/app/components/toast';
import { config } from '@/app/constants/config';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Mock data start

import { businessUnits } from '@/app/constants/mockdata/mockdata'
import { exchangeCurrencies, exchangeSummary } from "@/app/constants/mockdata/exchange_mockdata";
import { ChevronRightIcon } from '@heroicons/react/24/outline';

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
  
  return (
    <Layout currentTab="bu">
      <main className="min-h-full pt-10 py-10 px-12 2xl:px-16 bg-zinc-50">
        <Breadcrumbs breadcrumbPages={breadcrumbPages} />
        <ReconciliationHeader
          businessUnit={businessUnit}
        />
        <div className="flex grow flex-col mt-8">
          <ReconciliationSection
            businessUnit={businessUnit}
            currencyData={exchangeCurrencies}
            summaryData={exchangeSummary}
          />
        </div>
      </main>
    </Layout>
  );
}

export function ReconciliationHeader({ businessUnit, snapshotID=undefined }) {
  return (
    <div className="flex items-center mb-4">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <div className="flex items-baseline">
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">{businessUnit?.name}</h1>
                <p className="pl-3 text-xl font-medium leading-tight tracking-tight text-gray-400">{businessUnit?.code}</p>
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
                className="h-10 flex text-nowrap items-center rounded px-2 mx-4 py-1 text-sm font-semibold text-indigo-600"
              >
                View snapshots
              </a>
              <a
                href={`/business-unit/${businessUnit?.slug}/accounts`}
                className="h-10 flex text-nowrap items-center rounded px-2 py-1 text-sm font-semibold text-indigo-600"
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

export function ReconciliationSection({ businessUnit, currencyData, summaryData, snapshotID, snapshotTime }) {
  const { referenceCurrency } = useContext(RefCurContext)

  const colors = {
    crit: "text-red-500",
    acctble: "text-amber-500",
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
        pathname: '/business-unit/[business-unit]',
        query: {
          'business-unit': businessUnit.slug,
          'currency': newCurrency
        }
      }, 
      `/business-unit/${businessUnit.slug}?currency=${newCurrency}`, 
      { shallow: true })
    } else {
      router.replace({
        pathname: '/business-unit/[business-unit]/snapshot/[snapshot-id]',
        query: {
          'business-unit': businessUnit.slug,
          'snapshot-id': snapshotID,
          'currency': newCurrency
        }
      }, 
      `/business-unit/${businessUnit.slug}/snapshot/${snapshotID}?currency=${newCurrency}`, 
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
      } else {
        element.style.height = '0px';
      }
    })
  }, [currentCurrency])
  
  return (
    <>
      <div id={"summary"} key={"summary"}>
        <div className="w-full px-4 sm:px-6 lg:px-8 p-4 rounded-lg mb-4">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="grid grid-cols-6">
                <div className="flex col-span-2 items-center">
                  <p className="whitespace-nowrap text-lg text-gray-600">All currencies</p>
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
                  <p className={classNames(discrepancyColor(convertCurrency(summaryData.discrepancy, config.collateCurrency, config.collateCurrency), summaryData.discrAlertConf, colors),
                    "whitespace-nowrap text-md font-medium")}>
                    {convertedCurrency(summaryData.discrepancy, config.collateCurrency, referenceCurrency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      {exchangeCurrencies.map(currency => 
      <div id={currency.symbol} key={currency.symbol}>
        <DetailsHeader 
          currency={currency}
          referenceCurrency={referenceCurrency}
          businessUnit={businessUnit}
          changeCurrency={changeCurrency}
        />
        <div className="px-3">
          <div 
            id={currency.symbol + "-table"}
            style={{
              height: '0px',
              marginBottom: currentCurrency == currency.symbol? '48px' : '36px',
              transition: 'height 0.5s ease-in-out'
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

  function DetailsHeader({ currency, referenceCurrency, changeCurrency }) {
    const convert = (amount) => convertedCurrency(amount, currency.symbol, referenceCurrency)
    const convertSigned = (amount) => convertedCurrency(amount, currency.symbol, referenceCurrency, true)
    const convertUSD = (amount) => convertCurrency(amount, currency.symbol, config.collateCurrency)
    
    return (
      <button 
        onClick={() => changeCurrency(currency.symbol)}
        className="w-full px-4 sm:px-6 lg:px-8 p-4 rounded-lg border border-gray-200 shadow-md bg-white hover:bg-gray-50"
      >
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="grow grid grid-cols-6">
              <div className="flex col-span-2 items-center">
                <div className="flex items-center pr-3">
                  <ChevronRightIcon className={classNames(
                      "h-5 w-5 text-gray-500", currency.symbol == currentCurrency ? "rotate-90" : "rotate-0"
                    )}
                  />
                </div>
                <p className="whitespace-nowrap text-lg text-gray-600">{currency.name} &#40;{currency.symbol}&#41;</p>
              </div>
              <div className="flex flex-col justify-start text-left">
                <p scope="col" className="pr-3 text-xs leading-6 text-gray-500">
                  Total capital
                </p>
                <p className="whitespace-nowrap text-sm font-medium text-gray-700">{convert(currency.capitalTotal)}</p>
              </div>
              <div className="flex flex-col justify-start text-left">
                <p scope="col" className="pr-3 text-xs leading-6 text-gray-500">
                  Total assets
                </p>
                <p className="whitespace-nowrap text-sm font-medium text-gray-700">{convert(currency.assetTotal)}</p>
              </div>
              <div className="flex flex-col justify-start text-left">
                <p scope="col" className="pr-3 text-xs leading-6 text-gray-500">
                  Total liabilities
                </p>
                <p className="whitespace-nowrap text-sm font-medium text-gray-700">{convert(currency.liabilityTotal)}</p>
              </div>
              <div className="flex flex-col justify-start text-left">
                <p scope="col" className="pr-3 text-xs leading-6 text-gray-500">
                  Gap
                </p>
                <p className={classNames(discrepancyColor(convertUSD(currency.discrepancy), currency.discrAlertConf, colors),
                  "whitespace-nowrap text-sm font-medium")}>
                  {convertSigned(currency.discrepancy)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </button>
    )
  }

  function DetailsTable({ businessUnit, accounts, total, type, symbol, snapshotID=undefined, snapshotTime=new Date(), children }) {
    const { referenceCurrency } = useContext(RefCurContext)
  
    const convert = (amount) => convertedCurrency(amount, symbol, referenceCurrency)

    const { addToast } = useContext(ToastContext)
    const launchToast = () => {
      addToast({ color: "green", message: "Account balance saved!" })
    }

    const handleSave = () => {
      // Insert API implementation here
      launchToast()
    }

    return (
      <>
        <div className="bg-gray-100 border-y border-gray-200 px-4 sm:px-6 lg:px-6 mb-4 py-4">
          <div className="flex items-center">
            <div className="flex-auto">
              {children}
            </div>
            {!snapshotID ? 
              <div className="flex items-end">
                <Link
                  href={{
                    pathname: `/business-unit/${businessUnit?.slug}/accounts`,
                    query: { action: 'new', "account-type": type, currency: symbol },
                  }}
                  className="text-indigo-600 hover:text-indigo-900"
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
                      Data age
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr key={account.code} className="bg-white hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-2 pr-3 text-sm text-gray-500">{account.code}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600">{account.name}</td>
                      { !snapshotID && account.dataSource == "manual" ?
                        <td className="whitespace-nowrap px-1 py-2 text-sm text-gray-500">
                          <EditableField
                            onSave={handleSave}
                            inputClass="block w-52 px-2 py-1 rounded-md border-0 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6"
                            pClass="text-sm px-2 py-2 text-gray-500"
                            defaultValue={account.balance}
                            unit={symbol}
                          />
                        </td>
                      : 
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatNumber(+parseFloat(account.balance).toFixed(8)) + " " + symbol}
                        </td>
                      }
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{convert(account.balance)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dataSources.find((data) => data.value == account.dataSource).name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <ClientOnly>
                          <PopoverComp position="top">
                            {/* TODO when converting to API-consumed data, please implement snapshot time instead of new Date() for snapshots */}
                            <p className="hover:text-indigo-600">{convertMsToTimeAgo(account.ageMS - (new Date().getMilliseconds() + snapshotTime.getMilliseconds()))}</p>
                            <p className="text-sm text-gray-900">{convertAgeMsToDateTime(account.ageMS - (new Date().getMilliseconds() + snapshotTime.getMilliseconds())).toString()}</p>
                          </PopoverComp>
                        </ClientOnly>
                      </td>
                      {!snapshotID ?
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-2 text-right text-sm font-semibold">
                          <Link
                            href={{
                              pathname: `/business-unit/${businessUnit?.slug}/accounts`,
                              query: { action: 'edit', edit: account.code },
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
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
//               "summary" === currentCurrency || "summary" === hoveredItem ? 'text-indigo-600' : 'text-gray-500',
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
//                 currency.symbol === currentCurrency || currency.symbol === hoveredItem ? 'text-indigo-600' : 'text-gray-500',
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