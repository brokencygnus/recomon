import { useRouter } from 'next/router';
import { useState, useEffect, createContext, useContext } from 'react'
import Layout, { RefCurContext, convertedCurrency } from '@/app/components/layout';
import { Dropdown } from '@/app/components/dropdown';
import { Modal } from '@/app/components/modal';
import { CurrencyIcon } from '@/app/components/currency_icon';
import { NumberInput } from '@/app/components/numberinput';
import { checkDataEdited } from '@/app/utils/utils';
import { HighlightSearch, SearchFilter } from '@/app/utils/highlight_search';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { accountTypes, dataSources } from '@/app/constants/types'
import { ToastContext } from '@/app/components/toast';
import { PencilSquareIcon } from '@heroicons/react/20/solid';

// mock data start 

import { businessUnits } from '@/app/constants/mockdata/mockdata'
import { APIs } from '@/app/constants/mockdata/api-list_mockdata';
import { enabledCurrencies as currencies } from '@/app/utils/currencies'
import { accounts } from '@/app/constants/mockdata/account_mockdata'

// mock data end

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ModalContext = createContext(null);

export default function AccountPage() {
  const router = useRouter()
  const { pathname } = router;
  const query = { ...router.query };

  const businessUnitSlug = router.query["business-unit"];

  const businessUnit = () => {
    try {
      return businessUnits.find((businessUnit) => businessUnit.slug == businessUnitSlug)
    } catch (error) {
      // TODO should give 404
    }
  }
  
  const breadcrumbPages = [
    { name: 'Business Units', href: '/business-units', current: false },
    { name: businessUnit()?.name, href: `/business-units/${businessUnit()?.slug}`, current: true },
    { name: 'Accounts', href: '#', current: true },
  ]

  //filters
  const defaultFilters = {
    currency: { noSelectionLabel: "Filter currency", name: "All", value: null },
    type: { noSelectionLabel: "Filter type", name: "All", value: null },
    dataSource: { noSelectionLabel: "Filter data source", name: "All", value: null }
  }

  const [filteredAccounts, setFilteredAccounts] = useState(accounts);
  const [accountFilters, setAccountFilters] = useState(defaultFilters);
  const [searchTerm, setSearchTerm] = useState([]);

  const handleCurrencyFilter = (event) => {
    const { value } = event.target
    
    let tempAccountFilters = structuredClone(accountFilters)
    tempAccountFilters.currency = value
    setAccountFilters(tempAccountFilters)
  };
  
  const handleTypeFilter = (event) => {
    const { value } = event.target
    
    let tempAccountFilters = structuredClone(accountFilters)
    tempAccountFilters.type = value
    setAccountFilters(tempAccountFilters)
  };

  const handleDataSourceFilter = (event) => {
    const { value } = event.target
    
    let tempAccountFilters = structuredClone(accountFilters)
    tempAccountFilters.dataSource = value
    setAccountFilters(tempAccountFilters)
  };

  const handleSearchChange = (event) => {
    const { value } = event.target
    const searchArray = value.split(" ")
    setSearchTerm(searchArray)
  }

  const handleResetFilters = () => {
    setAccountFilters(defaultFilters)
    setSearchTerm([])
  }

  useEffect(() => {
    const tempFilteredAccounts = accounts.filter(account => 
      (accountFilters.currency.value == null || account.currency === accountFilters.currency.value) &&
      (accountFilters.type.value == null || account.type === accountFilters.type.value) &&
      (accountFilters.dataSource.value == null || account.dataSource === accountFilters.dataSource.value) &&
      (SearchFilter(account.name, searchTerm))
    )
    
    setFilteredAccounts(tempFilteredAccounts)
  }, [accounts, accountFilters, searchTerm])

  // modal
  var isModalOpen = (router.query.action ? true : false)
  const [modalAction, setModalAction] = useState(router.query.action)
  var modalData = accounts.find((account) => account.code == router.query.edit)

  // modalData = accounts[index]
  // mode = "edit" | "new"
  const openModal = (modalData, mode) => {
    if (mode === "edit") {
      setModalAction("edit");
      query.action = "edit";
      query.edit = modalData.code;
    } else {
      setModalAction("new");
      query.action = "new";
    }

    router.replace({ pathname, query });
  }

  const closeModal = () => {
    setModalAction("");
    router.replace({
      pathname: '/business-units/[business-unit]/accounts',
      query: { 'business-unit': businessUnit()?.slug }
      }, 
      `/business-units/${businessUnit()?.slug}/accounts`, 
      {}
    );
  }

  // Prevent race condition when page is loaded but router query is still undefined
  useEffect(() => {
    if (!modalAction) {
      setModalAction(router.query.action)
    }
  }, [router.query.action])

  return (
    <Layout currentTab="bu" breadcrumbPages={breadcrumbPages}>
      <ModalContext.Provider value={{ modalData, modalAction }}>
        <main className="min-h-full relative bg-stone-100">
          <div className="bg-white pt-6 px-12 2xl:px-16">
            <AccountHeader />
          </div>
          <div className="sticky top-0 px-12 bg-white 2xl:px-16 z-[2]">
            <AccountFilter
              businessUnit={businessUnit()}
              accountFilters={accountFilters}
              handleCurrencyFilter={handleCurrencyFilter}
              handleTypeFilter={handleTypeFilter}
              handleDataSourceFilter={handleDataSourceFilter}
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              handleResetFilters={handleResetFilters}
              openModal={openModal}
            />
          </div>
          <div className="sticky top-6 w-full h-10 bg-white z-[1] shadow-md"></div>
          <Modal
            open={isModalOpen}
            setClose={closeModal}
            panelTitle={modalAction === "edit" ? "Edit Account" : "New Account"}
          >
            <EditAccount setClose={closeModal}/>
          </Modal>
          <div className="relative px-12 2xl:px-16">
            <AccountGrid 
              accounts={filteredAccounts}
              searchTerm={searchTerm}
              openModal={openModal}
            />
            <div className="h-16 sticky bottom-0 pointer-events-none bg-gradient-to-t from-gray-100 to-transparent"></div>
          </div>
        </main>
      </ModalContext.Provider>
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
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Accounts</h1>
              <p className="mt-2 text-sm text-gray-700">View and manage your accounts in this business unit.</p>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
}

function AccountFilter({ businessUnit, accountFilters, handleCurrencyFilter, handleTypeFilter, handleDataSourceFilter, searchTerm, handleSearchChange, handleResetFilters, openModal }) {
  const filterCurrencies = currencies.map(currency => ({
    name: currency.name,
    value: currency.symbol
  }))
  
  const nullCurrency = { noSelectionLabel: "Filter currency", name: "All", value: null }
  const nullType = { noSelectionLabel: "Filter type", name: "All", value: null }
  const nullDataSource = { noSelectionLabel: "Filter data source", name: "All", value: null }
  
  return (
    <div className="flex justify-between">
      <div className="flex flex-row items-end mt-2 gap-x-3">
        <div className="flex rounded-md w-fit h-9 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <input
            id="search-accounts"
            className="border-0 py-0 px-0 mx-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search account"
            value={searchTerm.join(" ")}
            onChange={handleSearchChange}
            type="text"
            name="search"
          />
          <MagnifyingGlassIcon
            className="pointer-events-none w-5 mx-2 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <div>
          <Dropdown
            options={filterCurrencies}
            nullOption={nullCurrency}
            selectedOption={accountFilters.currency.name}
            onSelect={handleCurrencyFilter}
            className="w-40 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          />
        </div>
        <div>
          <Dropdown
            options={accountTypes}
            nullOption={nullType}
            selectedOption={accountFilters.type.name}
            onSelect={handleTypeFilter}
            className="w-40 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          />
        </div>
        <div>
          <Dropdown
            options={dataSources}
            nullOption={nullDataSource}
            selectedOption={accountFilters.dataSource.name}
            onSelect={handleDataSourceFilter}
            className="w-40 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          />
        </div>
        <div>
          <button
            type="button"
            className="h-10 rounded px-2 py-1 text-sm font-semibold text-sky-600 hover:text-sky-900"
            onClick={handleResetFilters}
          >
            Reset filters
          </button>
        </div>
      </div>
        <div className="flex items-end">
          <a
            href={`/business-units/${businessUnit?.slug}`}
            className="h-10 flex items-center rounded px-2 py-1 text-sm font-semibold text-sky-600 hover:text-sky-900"
          >
            View summary
          </a>
          <button
            type="button"
            onClick={() => openModal({}, "new")}
            className="ml-4 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            Add account
          </button>
        </div>
    </div>
  )
}

export function AccountGrid({ accounts, openModal, searchTerm }) {
  const { referenceCurrency } = useContext(RefCurContext);

  const convert = (amount, currency) => convertedCurrency(amount, currency, referenceCurrency);

  return (
    <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 2xl:gap-x-8 py-8 xl:grid-cols-2 3xl:grid-cols-3">
      {accounts.map((account) => (
        <li key={account.code} className="relative z-0 flex flex-row rounded-lg shadow-md ring-1 ring-gray-900/5">
          <div className="relative grow w-0 z-0 col-span-1 rounded-lg bg-white">
            <div className="flex w-full items-center justify-between p-6">
              <div className="flex items-center">
                <CurrencyIcon size="md" symbol={account.currency} />
                <div className="flex flex-col justify-end pl-6 gap-x-3">
                  <p className="truncate mt-1 text-sm font-medium text-gray-900">{HighlightSearch(account.name, searchTerm, { base:'', highlight:'bg-sky-300' })}</p>
                  <div className="mt-1 text-right text-xs text-gray-500 flex flex-cols-3 items-center">
                    <p className="mr-2">{accountTypes.find((data) => data.value == account.type).name}</p>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <p className="ml-2">{dataSources.find((data) => data.value == account.dataSource).name}</p>
                  </div>
                </div>
              </div>
              <div className="grid justify-items-end">
                <div className="flex items-center">
                  <p className="text-xs font-medium text-gray-500 pr-2">{account.code}</p>
                  <p className="inline-flex flex-shrink-0 items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {account.currency}
                  </p>
                </div>
                <p className="mt-1 truncate text-xs text-gray-500">{convert(account.balance, account.currency)}</p>
              </div>
            </div>
          </div>
          <div className="w-8 -z-10"></div>
          <div
            onClick={() => { openModal(account, "edit"); }}
            className="absolute inset-y-0 right-0 w-12 -z-[1] grid items-center justify-items-end rounded-lg bg-sky-100 hover:bg-sky-400 hover:cursor-pointer"
          >
            <div className="w-8 grid items-center justify-items-center">
              <PencilSquareIcon className="h-5 w-5 text-white"></PencilSquareIcon>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}


// modalData = accounts[index]
// mode = "edit" | "new"
function EditAccount({ setClose }) {
  const router = useRouter()
  const query = router.query

  const { modalData, modalAction } = useContext(ModalContext)

  // Dropdown options 1
  const apiOptions = APIs.map(api => ({ name: api.name, code: api.code, value: api.id }))
  const currencyOptions = currencies.map(currency => ({ name: currency.name, value: currency.symbol }))

  const initialState = {
    code: modalData?.code ?? '',
    accountName: modalData?.name ?? '',
    accountType: accountTypes.find(type => type.value === modalData?.type || type.value === query["account-type"]),
    currency: currencyOptions.find(currency => currency.value === modalData?.currency || currency.value === query.currency), 
    description: modalData?.description ?? '', 
    dataSource: dataSources.find(source => source.value === modalData?.dataSource) ?? '', 
    manualBalance: modalData?.balance ?? '',
    api: apiOptions.find(api => api.value === modalData?.api),
    network: modalData?.network ?? '',
    blockchainAddress: modalData?.blockchainAddress ?? '', 
  }

  const [formState, setFormState] = useState(initialState);
  const [isDataEdited, setIsDataEdited] = useState(false)

  // Dropdown options 2
  const currentCurrencyData = currencies.find(currency => currency.symbol === formState?.currency?.value)
  // Hide blockchain as option for non-blockchain currencies
  const dataSourceOptions = currentCurrencyData?.is_blockchain === false ?
    dataSources.filter(source => source.value !== "blockchain") : dataSources
  const networkOptions = currentCurrencyData?.networks.map(network => ({ name: network, value: network }))

  // Reset validations (if select X, all fields in Y will be emptied)
  const ifSelectXEmptyY = {
    "currency": ["dataSource", "network", "blockchainAddress"],
    "dataSource": ["manualBalance", "network", "blockchainAddress"],
    "network": ["blockchainAddress"]
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    const updatedState = {
      ...formState,
      [name]: value,
    };

    // Conditionally update formState and reset related fields based on validation config
    if (ifSelectXEmptyY[name]) {
      // Reset related fields
      ifSelectXEmptyY[name].forEach(field => {
        updatedState[field] = '';
      });
    }

    setFormState(updatedState);
    checkDataEdited(initialState, updatedState, setIsDataEdited)
  };

  const { addToast } = useContext(ToastContext)
  const launchToast = () => {
    if (modalAction == "edit") {
      addToast({ color: "green", message: "Account details edited!" })
    } else if (modalAction == "new") {
      addToast({ color: "green", message: "New account created!" })
    }
  }
  
  const handleSubmit = () => {
    // Enter save logic here
    launchToast()
    setClose()
  }

  return (
    <div className="w-[50rem]">
      <div id="edit-account-form">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Account Details</h2>
            <p className="mt-1 mb-10 text-sm leading-6 text-gray-600">
              This information will be displayed on the business unit's summary and accounts page.
            </p>

            <div className="grid grid-cols-4 gap-x-6 gap-y-8">
              <div className="grid grid-cols-3 col-span-4 gap-x-6 ">
                <div className="">
                  <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">
                    Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="code"
                      id="code"
                      value={formState.code}
                      onChange={handleFormChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      placeholder="A001"
                    />
                  </div>
                </div>

                <div className="grow-x col-span-2">
                  <label htmlFor="accountName" className="block text-sm font-medium leading-6 text-gray-900">
                    Account name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="accountName"
                      id="accountName"
                      value={formState.accountName}
                      onChange={handleFormChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      placeholder="My CAMP Account"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <Dropdown
                  name="accountType"
                  id="accountType"
                  labelText="Account type"
                  options={accountTypes}
                  selectedOption={formState?.accountType?.name}
                  onSelect={handleFormChange}
                  className="block w-full mt-3 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600"
                />
              </div>

              <div className="col-span-2">
                <Dropdown
                  name="currency"
                  id="currency"
                  labelText="Currency"
                  options={currencyOptions}
                  selectedOption={formState?.currency?.name}
                  onSelect={handleFormChange}
                  className="block w-full mt-3 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600"
                />
              </div>

              <div className="col-span-full">
                <div className="flex justify-between">
                  <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </label>
                  <span className="text-sm leading-6 text-gray-500" id="email-optional">
                    Optional
                  </span>
                </div>
                <div className="mt-2">
                  <textarea
                    name="description"
                    id="description"
                    value={formState.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a short description of the account.</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Data Source</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Configure the source from which we retrieve balance data for your account.</p>

            <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-8">
              <div className="col-span-2">
                <Dropdown
                  name="dataSource"
                  id="dataSource"
                  labelText="Data Source"
                  options={dataSourceOptions}
                  selectedOption={formState?.dataSource?.name}
                  onSelect={handleFormChange}
                  className="block w-full mt-3 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600"
                />
              </div>

              <div
                hidden={formState.dataSource.value !== "manual"}
                className="col-span-full"
              >
                <label htmlFor="manualBalance" className="block text-sm font-medium leading-6 text-gray-900">
                  Balance
                </label>
                <div className="relative mt-2">
                  <NumberInput
                    type="text"
                    name="manualBalance"
                    id="manualBalance"
                    value={formState.manualBalance}
                    onChange={handleFormChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 sm:text-sm">
                    {formState?.currency?.value}
                  </span>
                </div>
              </div>
              
              <div 
                style={{ display: formState.dataSource.value !== "api" && "none" }}
                className="grid grid-cols-4 gap-x-6 col-span-full"
              >
                <div className="col-span-2">
                  <Dropdown
                    name="api"
                    id="api"
                    labelText="API name"
                    options={apiOptions}
                    selectedOption={formState?.api?.name}
                    onSelect={handleFormChange}
                    className="block w-full mt-3 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600"
                  />
                </div>
                <div className="col-span-full">
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Ensure that the account code matches the API response.&nbsp;
                    <a href='/api-list' className="font-semibold text-sky-600 hover:text-sky-900">View your API settings</a>
                  </p>
                </div>
              </div>

              <div 
                hidden={formState.dataSource.value !== "blockchain"}
                className="col-span-2"
              >
                <label htmlFor="blockchainAddress" className="block text-sm font-medium leading-6 text-gray-900">
                  Network
                </label>
                {formState?.currency?.value?
                <Dropdown
                  name="network"
                  id="network"
                  options={networkOptions}
                  selectedOption={formState?.network.name}
                  onSelect={handleFormChange}
                  className="block w-full mt-2 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600"
                />
                :
                  <p className="text-red-500 text-sm mt-2">Please select the account currency first.</p>
                }
              </div>

              <div
                hidden={formState.dataSource.value !== "blockchain"}
                className="col-span-full"
              >
                <label htmlFor="blockchainAddress" className="block text-sm font-medium leading-6 text-gray-900">
                  Blockchain address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="blockchainAddress"
                    id="blockchainAddress"
                    value={formState.blockchainAddress}
                    onChange={handleFormChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            onClick={setClose}
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className={classNames(
              isDataEdited ? "bg-sky-600 hover:bg-sky-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              : "bg-gray-300 text-gray-500 pointer-events-none",
              "rounded-md px-3 py-2 text-sm font-semibold shadow-sm"
            )}
          >
            {modalAction == "edit" ? "Save ": "Submit"}
          </button>
        </div>
      </div>

      {/* debug */}
      {/* {JSON.stringify(formState)} */}
    </div>
  )
}