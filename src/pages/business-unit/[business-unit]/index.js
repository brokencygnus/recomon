import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link';
import Layout, { RefCurContext, convertedCurrency } from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { discrepancyColor, formatNumber, convertCurrency, convertMsToTime, convertAgeMsToDateTime } from '@/app/utils/utils';
import { PopoverComp } from '@/app/components/popover';
import { businessUnits, currencies, accounts, exchangeData, discrAlertConf } from '@/app/constants/mockdata'
import { dataSources } from '@/app/constants/types'
import { EditableField } from '@/app/components/editablefield'
import { ToastContext } from '@/app/components/toast';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Mock data start

const capitals = accounts.filter(account => account.type === "capital");
const assets = accounts.filter(account => account.type === "asset");
const liabilities = accounts.filter(account => account.type === "liability");

// API should provide this as well but I don't have it and I'm too lazy to mock realistic data
const getTotal = (data) => {
  const total = data.reduce((total, account) => {
    return total + parseFloat(account.balance);
  }, 0);
  return total;
};

const totalCapital = getTotal(capitals)
const totalAssets = getTotal(assets)
const totalLiabilities = getTotal(liabilities)
const gap = totalCapital - totalAssets + totalLiabilities

// Mock data end

export default function SummaryPage() {
  const router = useRouter();

  const businessUnitSlug = router.query["business-unit"];
  const currentCurrency = router.query.currency

  const changeCurrency = (currency) => {
    router.replace({
      pathname: '/business-unit/[business-unit]',
      query: {
        'business-unit': businessUnitSlug,
        'currency': currency
      }
    }, 
    `/business-unit/${businessUnitSlug}?currency=${currency}`, 
    { shallow: true });
  };

  // Get default currency on page load if not defined
  useEffect(() => {
    if (!router.query.currency && businessUnitSlug) {
      changeCurrency(exchangeData[0].symbol);
    }
  }, [router, businessUnitSlug]);

  // Fetch data for this business unit
  const businessUnit = () => {
    try {
      return businessUnits.find((businessUnit) => businessUnit.slug == businessUnitSlug)
    } catch (error) {
      // TODO should give 404
    }
  }

  const breadcrumbPages = [
    { name: 'Business Units', href: '/business-units', current: false },
    { name: businessUnit()?.name, href: '#', current: true },
  ]
  
  return (
    <Layout currentTab="bu">
      <main className="py-10 px-12 2xl:px-16">
        <Breadcrumbs breadcrumbPages={breadcrumbPages} />
        <ReconciliationHeader
          businessUnit={businessUnit()}
        />
        <div className="min-h-60 flex flex-row mt-8">
          <div className="w-1/6 max-w-xs">
            <AssetPicker
              currentCurrency={currentCurrency}
              changeCurrency={changeCurrency}
            />
          </div>
          <div className="flex-grow rounded-lg overflow-hidden border border-gray-300">
            <ReconciliationSummary
              currentCurrency={currentCurrency}
              businessUnit={businessUnit()}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}

function ReconciliationSummary({ businessUnit, currentCurrency }) {
  const { referenceCurrency } = useContext(RefCurContext)

  const convert = (amount) => convertedCurrency(amount, currentCurrency, referenceCurrency)
  const convertSigned = (amount) => convertedCurrency(amount, currentCurrency, referenceCurrency, true)
  
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 p-4 flow-root bg-gray-100 border-b border-gray-200">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="grid grid-cols-4">
              <div>
                <p scope="col" className="pr-3 text-left text-sm font-medium leading-6 text-gray-500">
                  Total capital
                </p>
                <p className="whitespace-nowrap text-lg font-medium text-gray-900 sm:pl-0">{convert(totalCapital)}</p>
              </div>
              <div>
                <p scope="col" className="pr-3 text-left text-sm font-medium leading-6 text-gray-500">
                  Total assets
                </p>
                <p className="whitespace-nowrap text-md font-medium text-gray-700">{convert(totalAssets)}</p>
              </div>
              <div>
                <p scope="col" className="pr-3 text-left text-sm font-medium leading-6 text-gray-500">
                  Total liabilities
                </p>
                <p className="whitespace-nowrap text-md font-medium text-gray-700">{convert(totalLiabilities)}</p>
              </div>
              <div>
                <p scope="col" className="pr-3 text-left text-sm font-medium leading-6 text-gray-500">
                  Gap
                </p>
                <p className={classNames(discrepancyColor(false, 12345678.12345678, discrAlertConf),
                  "whitespace-nowrap text-md font-medium text-gray-700")}>
                  {convertSigned(gap)}
                </p>
              </div>
              <div className="divide-y divide-gray-200">
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReconciliationTable businessUnit={businessUnit} data={capitals}>
        <h1 className="text-base font-semibold leading-6 text-gray-900">Capitals</h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of capital sources from owners, stakeholders, etc.
        </p>
      </ReconciliationTable>
      <ReconciliationTable businessUnit={businessUnit} data={assets}>
        <h1 className="text-base font-semibold leading-6 text-gray-900">Assets</h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of available cryptocurrency resources.
        </p>
      </ReconciliationTable>
      <ReconciliationTable businessUnit={businessUnit} data={liabilities}>
        <h1 className="text-base font-semibold leading-6 text-gray-900">Liabilities</h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of obligations or debts owed to customers or counterparties.
        </p>
      </ReconciliationTable>
    </div>
  )

  function ReconciliationTable({ businessUnit, data, children }) {
    const { referenceCurrency } = useContext(RefCurContext)
  
    const convert = (amount) => convertedCurrency(amount, currentCurrency, referenceCurrency)

    const { addToast } = useContext(ToastContext)
    const launchToast = () => {
      addToast({ color: "green", message: "Account balance saved!" })
    }

    const handleSave = () => {
      // Insert API implementation here
      launchToast()
    }

    return (
      <div>
        <div className="px-4 sm:px-6 lg:px-8 mt-8 mb-4">
          <div className="flex items-center">
            <div className="flex-auto">
              {children}
            </div>
            <div className="flex items-end">

              <Link
                href={{
                  pathname: `/business-unit/${businessUnit?.slug}/accounts`,
                  query: { action: 'new' },
                }}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <button className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  Add account
                </button>
              </Link>
            </div>
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
                  {data.map((item) => (
                    <tr key={item.code} className="bg-white hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-2 pr-3 text-sm text-gray-500">{item.code}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600">{item.name}</td>
                      { item.dataSource == "manual" ?
                        <td className="whitespace-nowrap px-1 py-2 text-sm text-gray-500">
                          <EditableField
                            onSave={handleSave}
                            inputClass="block w-52 px-2 py-1 rounded-md border-0 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6"
                            pClass="text-sm px-2 py-2 text-gray-500"
                            defaultValue={item.balance}
                            unit={currentCurrency}
                          />
                        </td>
                      : 
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatNumber(+parseFloat(item.balance).toFixed(8)) + " " + currentCurrency}
                        </td>
                      }
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{convert(item.balance)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dataSources.find((data) => data.value == item.dataSource).name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600">
                        <PopoverComp>
                          <p className="hover:text-indigo-900">{convertMsToTime(item.ageMS)}</p>
                          <p className="text-sm text-gray-900">{convertAgeMsToDateTime(item.ageMS).toString()}</p>
                        </PopoverComp>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-2 text-right text-sm font-semibold">
                        <Link
                          href={{
                            pathname: `/business-unit/${businessUnit?.slug}/accounts`,
                            query: { action: 'edit', edit: item.code },
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Configure<span className="sr-only">, {item.name}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                  <td className="py-4 pl-4 pr-3 sm:pl-0"></td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">Total</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">{formatNumber(+parseFloat(getTotal(data)).toFixed(8)) + " " + currentCurrency}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">{convert(getTotal(data))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function AssetPicker({ changeCurrency, currentCurrency }) {
  const { referenceCurrency } = useContext(RefCurContext)

  const convertSigned = (amount, currency) => convertedCurrency(amount, currency, referenceCurrency, true)

  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="space-y-2">
        <li className='text-gray-700 flex rounded-md py-1 text-md font-semibold leading-6'>Filter currency</li>
        {exchangeData.map((currency) => (
          <li
            onClick={() => changeCurrency(currency.symbol)}
            onMouseEnter={() => setHoveredItem(currency.symbol)}
            onMouseLeave={() => setHoveredItem(null)}
            className={classNames(
              currency.symbol === currentCurrency || currency.symbol === hoveredItem ? 'bg-gray-50' : '',
              'rounded-md py-2 mr-2 hover:cursor-pointer'
            )}
            >
            <a
              onClick={() => changeCurrency(currency.symbol)}
              className={classNames(
                currency.symbol === currentCurrency || currency.symbol === hoveredItem ? 'text-indigo-600' : 'text-gray-500',
                "flex pl-4 text-sm font-semibold leading-6"
              )}
            >
              {currency.name}
            </a>
            <a
              onClick={() => changeCurrency(currency.symbol)}
              className={classNames(
                currency.symbol === currentCurrency || currency.symbol === hoveredItem ? 'text-gray-600' : 'text-gray-400',
                "flex rounded-md pl-4 text-xs font-semibold leading-6"
              )}
            >Gap:&nbsp;
            <span className={discrepancyColor(
                currency.symbol === currentCurrency || currency.symbol === hoveredItem ? true : false,
                convertCurrency(currency.discrepancy, currency.symbol, "USD"),
                discrAlertConf)}>
              {convertSigned(currency.discrepancy, currency.symbol)}
            </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function ReconciliationHeader({ businessUnit }) {
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
      <div className="flex items-end">
        <div className="flex flex-row justify-items-end">
          <div className="flex mx-4 items-end">
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
    </div>
  );
}