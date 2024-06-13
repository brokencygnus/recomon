'use client'
import { useState, useEffect } from 'react'
import Layout from '../../app/components/layout';
import Breadcrumbs from '../../app/components/breadcrumbs';
import { FiatIconSmall } from '../../app/components/fiaticons';
import { Dropdown } from '../../app/components/dropdown';
import { BigIntToString, SymbolDictionary, DataSourceDictionary, AccountTypeDictionary } from '../../app/utils';
import { PencilSquareIcon } from '@heroicons/react/20/solid'

const breadcrumbPages = [
  { name: 'Business Units', href: '#', current: false },
  { name: 'Exchange', href: '#', current: true },
  { name: 'Accounts', href: '#', current: true },
]

const filterCurrencies = [
  { name: "All", value: null},
  { name: 'Bitcoin', value: 'BTC'},
  { name: 'Ethereum', value: 'ETH'},
  { name: 'USD Tether', value: 'USDT'},
  { name: 'Solana', value: 'SOL'},
  { name: 'Indonesian Rupiah', value: 'IDR'},
  { name: 'United States Dollar', value: 'USD'},
]
const filterTypes = [
  { name: "All", value: null},
  { name: AccountTypeDictionary("capital"), value: "capital"},
  { name: AccountTypeDictionary("asset"), value: "asset"},
  { name: AccountTypeDictionary("liability"), value: "liability"}
]
const filterDataSources = [
  { name: "All", value: null},
  { name: DataSourceDictionary("manual"), value: "manual"},
  { name: DataSourceDictionary("api"), value: "api"},
  { name: DataSourceDictionary("blockchain"), value: "blockchain"}
]

// mock data start
const accounts = [
  { code: "C001", name: 'Treasury', currency: 'BTC', data_source: "manual", type: "capital", amount: 1234567812345678n},
  { code: "C002", name: 'Hibah Kementerian Perhutanan', currency: 'BTC', data_source: "manual", type: "capital", amount: 1234567812345678n},
  { code: "C003", name: 'Dana Camping Pecinta Alam', currency: 'BTC', data_source: "manual", type: "capital", amount: 1234567812345678n},
  { code: "C004", name: 'Rika\'s Rainy Day Savings', currency: 'BTC', data_source: "manual", type: "capital", amount: 991234567812345678n},
  { code: "A001", name: 'CAMP Hot Wallet', currency: 'BTC', data_source: "blockchain", type: "asset", amount: 1234567812345678n},
  { code: "A002", name: 'Fireblocks Cold Storage', currency: 'BTC', data_source: "api", type: "asset", amount: 1234567812345678n},
  { code: "A003", name: 'Anchorage Cold Storage', currency: 'BTC', data_source: "api", type: "asset", amount: 1234567812345678n},
  { code: "A004", name: 'Coinbase Cold Storage', currency: 'BTC', data_source: "api", type: "asset", amount: 1234567812345678n},
  { code: "A005", name: 'INDODAX Balance', currency: 'BTC', data_source: "api", type: "asset", amount: 1234567812345678n},
  { code: "A006", name: 'FalconX Balance', currency: 'BTC', data_source: "api", type: "asset", amount: 1234567812345678n},
  { code: "L001", name: 'FalconX Pending Settlement', currency: 'BTC', data_source: "api", type: "liability", amount: 1234567812345678n},
  { code: "L002", name: 'Customer Funds', currency: 'BTC', data_source: "api", type: "liability", amount: 1234567812345678n},
]
// mock data end

export default function AccountPage() {
  const defaultFilters = {currency:{name: "All", value:null}, type:{name: "All", value:null}, data_source:{name: "All", value:null}}
  const [filteredAccounts, setFilteredAccounts] = useState(accounts);
  const [accountFilters, setAccountFilters] = useState(defaultFilters);

  const handleCurrencyFilter = (value) => {
    let tempAccountFilters = structuredClone(accountFilters)
    tempAccountFilters.currency = value
    setAccountFilters(tempAccountFilters)
  };
  
  const handleTypeFilter = (value) => {
    let tempAccountFilters = structuredClone(accountFilters)
    tempAccountFilters.type = value
    setAccountFilters(tempAccountFilters)
  };

  const handleDataSourceFilter = (value) => {
    let tempAccountFilters = structuredClone(accountFilters)
    tempAccountFilters.data_source = value
    setAccountFilters(tempAccountFilters)
  };

  const handleResetFilters = () => {
    setAccountFilters(defaultFilters)
  }

  useEffect(() => {
    let tempFilteredAccounts = []
    for (let i in accounts) {
      if (accountFilters.currency.value == null || accounts[i].currency == accountFilters.currency.value){
        if (accountFilters.type.value == null || accounts[i].type == accountFilters.type.value){
          if (accountFilters.data_source.value == null || accounts[i].data_source == accountFilters.data_source.value){
            tempFilteredAccounts.push(accounts[i])
          }
        }
      }
    }
    setFilteredAccounts(tempFilteredAccounts)
    console.log(filteredAccounts)
  }, [accountFilters])

  return (
    <Layout>
      <main>
        <Breadcrumbs breadcrumbPages={breadcrumbPages} />
        <AccountHeader />
        <AccountFilter
          accountFilters={accountFilters}
          handleCurrencyFilter={handleCurrencyFilter}
          handleTypeFilter={handleTypeFilter}
          handleDataSourceFilter={handleDataSourceFilter}
          handleResetFilters={handleResetFilters}
        />
        <AccountGrid 
          filteredAccounts={filteredAccounts}
        />
      </main>
    </Layout>
  )
}

function AccountHeader() {
  return (
    <div className="flex items-center">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Accounts</h1>
              <p className="mt-2 text-sm text-gray-700">View and manage your accounts in this business unit.</p>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
}

export function AccountGrid({ filteredAccounts }) {
  return (
    <ul role="list" className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3">
      {filteredAccounts.map((account) => (
        <li key={account.code} className="relative z-0 flex flex-row rounded-lg shadow">
          <div className="relative grow w-0 z-0 col-span-1 rounded-lg bg-white">
            <div className="flex w-full items-center justify-between p-6">
              <FiatIconSmall>{SymbolDictionary(account.currency)}</FiatIconSmall>
              <div className="w-5/12">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm text-gray-500">{account.code}</h3>
                  <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {account.currency}
                  </span>
                </div>
                <h3 className="truncate mt-1 text-md font-medium text-gray-900">{account.name}</h3>
              </div>
              <div className="w-5/12 grid justify-items-end">
                <div className="mt-1 text-right text-sm text-gray-500 flex flex-cols-3 items-center">
                  <p className="mr-2">{AccountTypeDictionary(account.type)}</p>
                  <p className="block h-1.5 w-1.5 rounded-full bg-gray-300 hover:bg-gray-400"></p>
                  <p className="ml-2">{DataSourceDictionary(account.data_source)}</p>
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">{BigIntToString(account.amount) + " " + account.currency}</p>
              </div>
            </div>
          </div>
          <div className="w-8 -z-10"></div>
          <div className="absolute inset-y-0 right-0 w-12 -z-[1] grid items-center justify-items-end rounded-lg bg-gray-200 hover:bg-indigo-400 hover:cursor-pointer">
            <div className="w-8 grid items-center justify-items-center">
              <PencilSquareIcon className="h-5 w-5 text-white"></PencilSquareIcon>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function AccountFilter({ accountFilters, handleCurrencyFilter, handleTypeFilter, handleDataSourceFilter, handleResetFilters }) {
  return (
    <div className="flex flex-row items-end mt-2 gap-x-3">
      <div>
        <Dropdown
          label='Currency:'
          width='medium'
          options={filterCurrencies}
          selectedOption={accountFilters.currency.name}
          onSelect={handleCurrencyFilter}
        />
      </div>
      <div>
        <Dropdown
          label='Type:'
          width='small'
          options={filterTypes}
          selectedOption={accountFilters.type.name}
          onSelect={handleTypeFilter}
        />
      </div>
      <div>
        <Dropdown
          label='Data source:'
          width='small'
          options={filterDataSources}
          selectedOption={accountFilters.data_source.name}
          onSelect={handleDataSourceFilter}
        />
      </div>
      <div>
        <button
          type="button"
          className="h-10 rounded px-2 py-1 text-sm font-semibold text-indigo-600 shadow-sm"
          onClick={handleResetFilters}
        >
          Reset filters
        </button>
      </div>
    </div>
  )
}