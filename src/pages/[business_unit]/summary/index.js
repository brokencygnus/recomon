import { useState } from 'react'
import Layout from '@/app/components/layout';
import { Dropdown } from '@/app/components/dropdown';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { convertMsToTime, convertAgeMsToDateTime } from '@/app/utils';
import { PopoverComp } from '@/app/components/popover';
import { accounts, currencies } from '@/app/constants/mockdata'
import { dataSources } from '@/app/constants/types'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Mock data start

const businessUnit = {name: "Exchange", slug: "exchange"}

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
const discrAlertConf = {
  critHigh: 10000,
  acctbleHigh: 200,
  acctbleLow: -200,
  critLow: -10000,
}

// Mock data end

var discrepancyColor = (highlight, discrepancy) => {
  var color = ""
  if (highlight) {
    if (parseFloat(discrepancy) > discrAlertConf.critHigh || parseFloat(discrepancy) < discrAlertConf.critLow) {color = "text-red-600"}
    else if (parseFloat(discrepancy) > discrAlertConf.acctbleHigh || parseFloat(discrepancy) < discrAlertConf.acctbleLow) {color = "text-amber-600"}
    else {color = "text-gray-500"}
  } else {
    if (parseFloat(discrepancy) > discrAlertConf.critHigh || parseFloat(discrepancy) < discrAlertConf.critLow) {color = "text-red-500"}
    else if (parseFloat(discrepancy) > discrAlertConf.acctbleHigh || parseFloat(discrepancy) < discrAlertConf.acctbleLow) {color = "text-amber-500"}
    else {color = "text-gray-400"}
  }
  return color
}

export default function SummaryPage() {
  const [selectedCurrency, setSelectedCurrency] = useState({name: 'Bitcoin', value: 'BTC'});

  const breadcrumbPages = [
    { name: 'Business Units', href: '#', current: false },
    { name: businessUnit.name, href: '#', current: true },
  ]
  
  return (
    <Layout>
      <main className="py-10 px-12 2xl:px-16">
        <Breadcrumbs breadcrumbPages={breadcrumbPages} />
        <CurrencyHeader selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
        <div className="min-h-60 flex flex-row mt-8">
          <div className="w-1/6 max-w-xs">
            <AssetPicker selectedCurrency={selectedCurrency}/>
          </div>
          <div className="flex-grow rounded-lg border border-gray-300">
            <ReconciliationSummary selectedCurrency={selectedCurrency}/>
          </div>
        </div>
      </main>
    </Layout>
  );
}

function ReconciliationSummary({ selectedCurrency }) {
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 p-4 flow-root bg-gray-100">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th scope="col" className="pr-3 text-left text-sm font-medium leading-6 text-gray-500">
                    Total capital
                  </th>
                  <th scope="col" className="pr-3 text-left text-sm font-medium leading-6 text-gray-500">
                    Total assets
                  </th>
                  <th scope="col" className="pr-3 text-left text-sm font-medium leading-6 text-gray-500">
                    Total liabilities
                  </th>
                  <th scope="col" className="pr-3 text-left text-sm font-medium leading-6 text-gray-500">
                    Discrepancy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="whitespace-nowrap text-lg font-medium text-gray-900 sm:pl-0">12345678.12345678 {(selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}</td>
                  <td className="whitespace-nowrap text-md font-medium text-gray-700">12345678.12345678 {(selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}</td>
                  <td className="whitespace-nowrap text-md font-medium text-gray-700">12345678.12345678 {(selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}</td>
                  <td className={classNames(discrepancyColor(false, 12345678.12345678),
                    "whitespace-nowrap text-md font-medium text-gray-700")}>
                    {12345678.12345678 > 0 ? "+": ""}12345678.12345678 {(selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ReconciliationTable data={capitals}>
        <h1 className="text-base font-semibold leading-6 text-gray-900">Capitals</h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of capital sources from owners, stakeholders, etc.
        </p>
      </ReconciliationTable>
      <ReconciliationTable data={assets}>
        <h1 className="text-base font-semibold leading-6 text-gray-900">Assets</h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of available cryptocurrency resources.
        </p>
      </ReconciliationTable>
      <ReconciliationTable data={liabilities}>
        <h1 className="text-base font-semibold leading-6 text-gray-900">Liabilities</h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of obligations or debts owed to customers or counterparties.
        </p>
      </ReconciliationTable>
    </div>
  )

  function ReconciliationTable({ data, children }) {
    return (
      <div>
        <div className="px-4 sm:px-6 lg:px-8 mt-8 mb-4">
          <div className="flex items-center">
            <div className="flex-auto">
              {children}
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Add account
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 mt-4 mb-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-0">
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
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.balance + " " + 'BTC'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.balance + " " + (selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dataSources.find((data) => data.value == item.data_source).name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600">
                        <PopoverComp>
                          <p className="hover:text-indigo-900">{convertMsToTime(item.ageMS)}</p>
                          <p className="text-sm text-gray-900">{convertAgeMsToDateTime(item.ageMS).toString()}</p>
                        </PopoverComp>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-2 text-right text-sm font-semibold">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Configure<span className="sr-only">, {item.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                  <td className="py-4 pl-4 pr-3 sm:pl-0"></td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">Total</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">{getTotal(data) + " " + 'BTC'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">{getTotal(data) + " " + (selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}</td>
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

function AssetPicker({ selectedCurrency }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="space-y-2">
        <li className='text-gray-700 flex rounded-md py-1 text-md font-semibold leading-6'>Currency type</li>
        {currencies.map((currency) => (
          <li
            key={currency.name}
            onMouseEnter={() => setHoveredItem(currency.name)}
            onMouseLeave={() => setHoveredItem(null)}
            className={classNames(
              currency.current || hoveredItem === currency.name ? 'bg-gray-50' : '',
              'rounded-md py-2 mr-2'
            )}
            >
            <a
              href={currency.href}
              className={classNames(
                currency.current || hoveredItem === currency.name ? 'text-indigo-600' : 'text-gray-500',
                "flex pl-4 text-sm font-semibold leading-6"
              )}
            >
              {currency.name}
            </a>
            <a
              href={currency.href}
              className={classNames(
                currency.current || hoveredItem === currency.name ? 'text-gray-600' : 'text-gray-400',
                "flex rounded-md pl-4 text-xs font-semibold leading-6"
              )}
            >Gap:&nbsp;
            <span className={discrepancyColor(currency.current || hoveredItem === currency.name ? true : false, currency.discrepancy)}>
              {(parseFloat(currency.discrepancy) > 0 ? "+": "") + currency.discrepancy}&nbsp;{(selectedCurrency.value == 'self' ? currency.symbol : selectedCurrency.value)}
            </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function CurrencyHeader({ selectedCurrency, setSelectedCurrency }) {
  const handleCurrencyChange = (value) => {
    setSelectedCurrency(value);
  };

  const options = [
    { name: 'None', value: 'self' },
    ...currencies.map(currency => ({
      name: currency.name,
      value: currency.symbol
    }))
  ]

  return (
    <div className="flex items-center mb-4">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <div className="flex items-baseline">
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Exchange</h1>
                <p className="pl-3 text-xl font-medium leading-tight tracking-tight text-gray-400">EXCG</p>
              </div>
              <p className="mt-2 text-sm text-gray-700">View your tracked currencies in this business unit and monitor their discrepancies.</p>
            </div>
          </header>
        </div>
      </div>
      <div className="flex items-end">
        <div className="grid grid-cols-2 justify-items-end">
          <Dropdown
            labelText='Reference Currency:'
            width='medium'
            options={options}
            selectedOption={selectedCurrency.name}
            onSelect={handleCurrencyChange}
          >
          </Dropdown>
          <div className="flex mx-4 items-end">
            <a
              href={`/${businessUnit.slug}/accounts`}
              className="h-10 flex items-center rounded px-2 py-1 text-sm font-semibold text-indigo-600"
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