'use client'
import { useState } from 'react'
import { Layout } from '../app/components/layout';
import { Dropdown } from '../app/components/dropdown';
import Breadcrumbs from '../app/components/breadcrumbs';
import { BigIntToString } from '../app/utils';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// mock data start

// assuming bigInt
const capitals = {
  accounts: [
  { code: "C001", name: 'Treasury', data_source: "Manual", amount: 1234567812345678n},
  { code: "C002", name: 'Hibah Kementerian Perhutanan', data_source: "Manual", amount: 1234567812345678n},
  { code: "C003", name: 'Dana Camping Pecinta Alam', data_source: "Manual", amount: 1234567812345678n},
  { code: "C004", name: 'Rika\'s Rainy Day Savings', data_source: "Manual", amount: 991234567812345678n},
  ],
  total: 8765432112345678n
}
const assets = {
  accounts: [
  { code: "A001", name: 'CAMP Hot Wallet', data_source: "Blockchain", amount: 1234567812345678n},
  { code: "A002", name: 'Fireblocks Cold Storage', data_source: "API", amount: 1234567812345678n},
  { code: "A003", name: 'Anchorage Cold Storage', data_source: "API", amount: 1234567812345678n},
  { code: "A004", name: 'Coinbase Cold Storage', data_source: "API", amount: 1234567812345678n},
  { code: "A005", name: 'INDODAX Balance', data_source: "API", amount: 1234567812345678n},
  { code: "A006", name: 'FalconX Balance', data_source: "API", amount: 1234567812345678n},
  ],
  total: 8765432112345678n
}
const liabilities = {
  accounts: [
  { code: "L001", name: 'FalconX Pending Settlement', data_source: "API", amount: 1234567812345678n},
  { code: "L002", name: 'Customer Funds', data_source: "API", amount: 1234567812345678n},
  ],
  total: 8765432112345678n
}

const currencies = [
  { name: 'Bitcoin', symbol: 'BTC', href: '#', discrepancy:8123412345678n, current: true },
  { name: 'Ethereum', symbol: 'ETH', href: '#', discrepancy:0n, current: false },
  { name: 'USD Tether', symbol: 'USDT', href: '#', discrepancy:6285267819928n, current: false },
  { name: 'Solana', symbol: 'SOL', href: '#', discrepancy:-35412345678n, current: false },
  { name: 'Indonesian Rupiah', symbol: 'IDR', href: '#', discrepancy:0n, current: false },
  { name: 'United States Dollar', symbol: 'USD', href: '#', discrepancy:22512345678n, current: false },
]

const discrepancyAlertConfig = {
  criticalHigh: 1000000000000n,
  acceptableHigh: 20000000000n,
  acceptableLow: -20000000000n,
  criticalLow: -1000000000000n,
}

// mock data end

const breadcrumbPages = [
  { name: 'Business Units', href: '#', current: false },
  { name: 'Exchange', href: '#', current: true },
]

export default function CurrenciesPage() {
  const [selectedCurrency, setSelectedCurrency] = useState({name: 'Bitcoin', value: 'BTC'});
  
  return (
    <Layout>
      <main className="sm:px-6 lg:px-8">
        <Breadcrumbs breadcrumbPages={breadcrumbPages} />
        <CurrencyHeader selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
        <div className="min-h-60 flex flex-row mt-8">
          <div className="w-1/6 max-w-xs">
            <AssetPicker selectedCurrency={selectedCurrency}/>
          </div>
          <div className="flex-grow rounded-lg border border-gray-300">
            <ReconciliationTable selectedCurrency={selectedCurrency}/>
          </div>
        </div>
      </main>
    </Layout>
  );
}

function ReconciliationTable({ selectedCurrency }) {
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 p-4 flow-root bg-gray-100">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th scope="col" className="pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Total capital
                  </th>
                  <th scope="col" className="px-3 text-left text-sm font-semibold text-gray-900">
                    Total assets
                  </th>
                  <th scope="col" className="px-3 text-left text-sm font-semibold text-gray-900">
                    Total liabilities
                  </th>
                  <th scope="col" className="px-3 text-left text-sm font-semibold text-gray-900">
                    Discrepancy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">12345678.12345678 {(selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}</td>
                  <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">12345678.12345678 {(selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}</td>
                  <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">12345678.12345678 {(selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}</td>
                  <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">12345678.12345678 {(selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Table data={capitals}>
        <h1 className="text-base font-semibold leading-6 text-gray-900">Capitals</h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of capital sources from owners, stakeholders, etc.
        </p>
      </Table>
      <Table data={assets}>
        <h1 className="text-base font-semibold leading-6 text-gray-900">Assets</h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of available cryptocurrency resources.
        </p>
      </Table>
      <Table data={liabilities}>
        <h1 className="text-base font-semibold leading-6 text-gray-900">Liabilities</h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of obligations or debts owed to customers or counterparties.
        </p>
      </Table>
    </div>
  )

  function Table({ data, children }) {
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
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                      Amount &#40;converted&#41;
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                      Data source
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.accounts.map((item) => (
                    <tr key={item.email}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{item.code}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600">{item.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{"" + BigIntToString(item.amount) + " " + 'BTC'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{"" + BigIntToString(item.amount) + " " + (selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.data_source}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">{"" + BigIntToString(data.total) + " " + 'BTC'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">{"" + BigIntToString(data.total) + " " + (selectedCurrency.value == 'self' ? 'BTC' : selectedCurrency.value)}</td>
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
  var discrepancyColor = (selected, discrepancy) => {
    var color = ""
    if (selected) {
      if (discrepancy > discrepancyAlertConfig.criticalHigh || discrepancy < discrepancyAlertConfig.criticalLow) {color = "text-red-600"}
      else if (discrepancy > discrepancyAlertConfig.acceptableHigh || discrepancy < discrepancyAlertConfig.acceptableLow) {color = "text-amber-600"}
      else {color = "text-gray-500"}
    } else {
      if (discrepancy > discrepancyAlertConfig.criticalHigh || discrepancy < discrepancyAlertConfig.criticalLow) {color = "text-red-500"}
      else if (discrepancy > discrepancyAlertConfig.acceptableHigh || discrepancy < discrepancyAlertConfig.acceptableLow) {color = "text-amber-500"}
      else {color = "text-gray-400"}
    }
    return color
  }

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="space-y-2">
        <li className='text-gray-700 flex rounded-md py-1 text-md font-semibold leading-6'>Currency type</li>
        {currencies.map((item) => (
          <li
            key={item.name}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
            className={classNames(
              item.current || hoveredItem === item.name ? 'bg-gray-50' : '',
              'rounded-md py-2 mr-2'
            )}
            >
            <a
              href={item.href}
              className={classNames(
                item.current || hoveredItem === item.name ? 'text-indigo-600' : 'text-gray-500',
                "flex pl-4 text-sm font-semibold leading-6"
              )}
            >
              {item.name}
            </a>
            <a
              href={item.href}
              className={classNames(
                item.current || hoveredItem === item.name ? 'text-gray-600' : 'text-gray-400',
                "flex rounded-md pl-4 text-xs font-semibold leading-6"
              )}
            >Gap:&nbsp;
            <span className={discrepancyColor(item.current || hoveredItem === item.name ? true : false, item.discrepancy)}>
              {(item.discrepancy > 0n ? "+": "") + BigIntToString(item.discrepancy)}&nbsp;{(selectedCurrency.value == 'self' ? item.symbol : selectedCurrency.value)}
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

  const options = [{name:'None', value:'self'}].concat(currencies.map(currency => ({
    name: currency.name,
    value: currency.symbol
  })))

  return (
    <div className="flex items-center">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Exchange</h1>
              <p className="mt-2 text-sm text-gray-700">View your tracked currencies in this business unit and monitor their discrepancies.</p>
            </div>
          </header>
        </div>
      </div>
      <div className="flex items-end">
        <div className="grid justify-items-end">
          <Dropdown
            label='Reference Currency:'
            width='medium'
            options={options}
            selectedOption={selectedCurrency.name}
            onSelect={handleCurrencyChange}
          >
          </Dropdown>
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