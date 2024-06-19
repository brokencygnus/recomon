import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import Layout from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { FiatIconSmall } from '@/app/components/fiaticons';
import { Dropdown } from '@/app/components/dropdown';
import { Modal } from '@/app/components/modal';
import { NumberInput } from '@/app/components/numberinput';
import { SymbolDictionary } from '@/app/utils/utils';
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { APIs, accounts, currencies } from '@/app/constants/mockdata'
import { accountTypes, dataSources } from '@/app/constants/types'

// TODO Route and intercept the /edit and /(.)edit pages so that it can be linked from summary 

const filterCurrencies = [
  { name: 'All', value: null },
  ...currencies.map(currency => ({
    name: currency.name,
    value: currency.symbol
  }))
]
const filterTypes = [{ name: "All", value: null}, ...accountTypes]
const filterDataSources = [{ name: "All", value: null}, ...dataSources]

// mock data start

const businessUnit = {name: "Exchange", slug: "exchange"}

// mock data end

export default function AccountPage() {
  const router = useRouter()
  const { pathname } = router;
  const query = { ...router.query };
  
  const breadcrumbPages = [
    { name: 'Business Units', href: '#', current: false },
    { name: businessUnit.name, href: `/${businessUnit.slug}/summary`, current: true },
    { name: 'Accounts', href: '#', current: true },
  ]

  //filters
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
  }, [accountFilters])

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

    router.push({ pathname, query });
  }

  const closeModal = () => {
    router.replace({
      pathname: '/[business_unit]/accounts',
      query: { business_unit: 'exchange'}}, 
      undefined, 
      {}
    );
  }

  return (
    
    <Layout currentTab="bu">
      <main className="py-10 px-12 2xl:px-16">
        <Breadcrumbs breadcrumbPages={breadcrumbPages} />
        <AccountHeader />
        <AccountFilter
          accountFilters={accountFilters}
          handleCurrencyFilter={handleCurrencyFilter}
          handleTypeFilter={handleTypeFilter}
          handleDataSourceFilter={handleDataSourceFilter}
          handleSearchChange={null}
          handleResetFilters={handleResetFilters}
          openModal={openModal}
        />
        <Modal
          open={isModalOpen}
          setOpen={closeModal}
          panelTitle={modalAction === "edit" ? "Edit Account" : "New Account"}
        >
          <EditAccount
            accountData={modalData}
            modalAction={modalAction}
          />
        </Modal>
      </main>
      <div className="flex-grow bg-gray-100 overflow-y-auto px-12 2xl:px-16">
        <AccountGrid 
          accounts={filteredAccounts}
          openModal={openModal}
        />
      </div>
    </Layout>
  )
}

function AccountHeader() {
  return (
    <div className="flex items-center mb-4">
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

export function AccountGrid({ accounts, openModal }) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 py-8 border-1 border-gray-200 md:grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3">
      {accounts.map((account) => (
        <li key={account.code} className="relative z-0 flex flex-row rounded-lg shadow">
          <div className="relative grow w-0 z-0 col-span-1 rounded-lg bg-white">
            <div className="flex w-full items-center justify-between p-6">
              <FiatIconSmall>{SymbolDictionary(account.currency)}</FiatIconSmall>
              <div className="w-5/12">
                <div className="flex items-end gap-x-3">
                  <p className="truncate mt-1 text-sm font-medium text-gray-900">{account.name}</p>
                  <p className="inline-flex flex-shrink-0 items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {account.currency}
                  </p>
                </div>
                <div className="mt-1 text-right text-xs text-gray-500 flex flex-cols-3 items-center">
                  <p className="mr-2">{accountTypes.find((data) => data.value == account.type).name}</p>
                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <p className="ml-2">{dataSources.find((data) => data.value == account.data_source).name}</p>
                </div>
              </div>
              <div className="w-5/12 grid justify-items-end">
                <p className="text-xs font-medium text-gray-500">{account.code}</p>
                <p className="mt-1 truncate text-xs text-gray-500">{account.balance + " " + account.currency}</p>
              </div>
            </div>
          </div>
          <div className="w-8 -z-10"></div>
          <div
            onClick={() => {openModal(account, "edit")}}
            className="absolute inset-y-0 right-0 w-12 -z-[1] grid items-center justify-items-end rounded-lg bg-indigo-100 hover:bg-indigo-400 hover:cursor-pointer"
          >
            <div className="w-8 grid items-center justify-items-center">
              <PencilSquareIcon className="h-5 w-5 text-white"></PencilSquareIcon>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function AccountFilter({ accountFilters, handleCurrencyFilter, handleTypeFilter, handleDataSourceFilter, handleSearchChange, handleResetFilters, openModal }) {
  return (
    <div className="flex justify-between">
      <div className="flex flex-row items-end mt-2 gap-x-3">
        <form className="flex rounded-md w-fit h-9 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <input
            id="search-accounts"
            className="border-0 py-0 px-0 mx-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search account"
            type="search"
            name="search"
          />
          <MagnifyingGlassIcon
            className="pointer-events-none w-5 mx-2 text-gray-400"
            aria-hidden="true"
          />
        </form>
        <div>
          <Dropdown
            labelText='Currency:'
            width='medium'
            options={filterCurrencies}
            selectedOption={accountFilters.currency.name}
            onSelect={handleCurrencyFilter}
          />
        </div>
        <div>
          <Dropdown
            labelText='Type:'
            width='small'
            options={filterTypes}
            selectedOption={accountFilters.type.name}
            onSelect={handleTypeFilter}
          />
        </div>
        <div>
          <Dropdown
            labelText='Data source:'
            width='small'
            options={filterDataSources}
            selectedOption={accountFilters.data_source.name}
            onSelect={handleDataSourceFilter}
          />
        </div>
        <div>
          <button
            type="button"
            className="h-10 rounded px-2 py-1 text-sm font-semibold text-indigo-600"
            onClick={handleResetFilters}
          >
            Reset filters
          </button>
        </div>
      </div>
        <div className="flex items-end">
          <a
            href={`/${businessUnit.slug}/summary`}
            className="h-10 flex items-center rounded px-2 py-1 text-sm font-semibold text-indigo-600"
          >
            View summary
          </a>
          <button
            type="button"
            onClick={() => openModal({}, "new")}
            className="ml-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add account
          </button>
        </div>
    </div>
  )
}

// accountData = accounts[index]
// mode = "edit" | "new"
function EditAccount({ accountData, modalAction }) {
  const [formState, setFormState] = useState({
    "code": accountData?.code ?? '',
    "account-name": accountData?.name ?? '',
    "currency": accountData?.currency ?? '', 
    "description": accountData?.description ?? '', 
    "data-source": accountData?.data_source ?? '', 
    "manual-balance": accountData?.balance ?? '',
    "api": accountData?.api ?? '',
    "network": accountData?.network ?? '',
    "blockchain-address": accountData?.blockchain_address ?? '', 
  });

  // Reset validations (if select X, all fields in Y will be emptied)
  const ifSelectXEmptyY = {
    "currency": ["data-source", "network", "blockchain-address"],
    "data-source": ["manual-balance", "network", "blockchain-address"],
    "network": ["blockchain-address"]
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    // Conditionally update formState and reset related fields based on validation config
    if (ifSelectXEmptyY[name]) {
      const updatedState = {
        ...formState,
        [name]: value,
      };

      // Reset related fields
      ifSelectXEmptyY[name].forEach(field => {
        updatedState[field] = '';
      });

      setFormState(updatedState);
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <div className="w-[50rem]">
      <form id="edit-account-form">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Account Details</h2>
            <p className="mt-1 mb-10 text-sm leading-6 text-gray-600">
              This information will be displayed on the business unit's summary and accounts page.
            </p>

            <div className="grid grid-cols-4 gap-x-6 gap-y-8">
              <div className="flex grid grid-cols-3 col-span-4 gap-x-6 ">
                <div className="">
                  <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">
                    Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="code"
                      id="code"
                      value={formState["code"]}
                      onChange={handleFormChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="A001"
                    />
                  </div>
                </div>

                <div className="grow-x col-span-2">
                  <label htmlFor="account-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Account name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="account-name"
                      id="account-name"
                      value={formState["account-name"]}
                      onChange={handleFormChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="My CAMP Account"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-3">
                <label htmlFor="currency" className="block text-sm font-medium leading-6 text-gray-900">
                  Currency
                </label>
                <div className="mt-2">
                  <select
                    name="currency"
                    id="currency"
                    value={formState["currency"]}
                    onChange={handleFormChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.symbol} value={currency.symbol}>{currency.name}</option>
                    ))}
                    <option hidden key="" value=""></option>
                  </select>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description &#40;optional&#41;
                </label>
                <div className="mt-2">
                  <textarea
                    name="description"
                    id="description"
                    value={formState["description"]}
                    onChange={handleFormChange}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a short description of the account.</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Data Source</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Configure the source from which we retrieve balance data for your account.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
              <div className="col-span-3">
                <label htmlFor="data-source" className="block text-sm font-medium leading-6 text-gray-900">
                  Data Source
                </label>
                <div className="mt-2">
                  <select
                    name="data-source"
                    id="data-source"
                    value={formState["data-source"]}
                    onChange={handleFormChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option key={"manual"} value={"manual"}>{"Manual"}</option>
                    <option key={"api"} value={"api"}>{"API"}</option>
                    <option
                      hidden={!currencies
                        .find(currency => currency.symbol === formState["currency"])
                        ?.is_blockchain}
                      key={"blockchain"} value={"blockchain"}>{"Blockchain"}</option>
                    <option hidden key="" value=""></option>
                  </select>
                </div>
              </div>

              <div
                hidden={formState["data-source"] !== "manual"}
                className="col-span-full"
              >
                <label htmlFor="manual-balance" className="block text-sm font-medium leading-6 text-gray-900">
                  Balance
                </label>
                <div className="relative mt-2">
                  <NumberInput
                    type="text"
                    name="manual-balance"
                    id="manual-balance"
                    value={formState["manual-balance"]}
                    onChange={handleFormChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 sm:text-sm">
                    {formState["currency"]}
                  </span>
                </div>
              </div>

              <div 
                hidden={formState["data-source"] !== "api"}
                className="col-span-3"
              >
                <label htmlFor="api" className="block text-sm font-medium leading-6 text-gray-900">
                  API name
                </label>
                <div className="mt-2">
                  <select
                    name="api"
                    id="api"
                    value={formState["api"]}
                    onChange={handleFormChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {APIs.map((api) => (
                        <option key={api.id} value={api.id}>{api.name}</option>
                    ))}
                    <option hidden key="" value=""></option>
                  </select>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Ensure that the account code matches the API response.&nbsp;
                    <a href='/api-list' className="font-semibold text-blue-600">View your API settings</a>
                  </p>
                </div>
              </div>

              <div 
                hidden={formState["data-source"] !== "blockchain"}
                className="col-span-3"
              >
                <label htmlFor="network" className="block text-sm font-medium leading-6 text-gray-900">
                  Network
                </label>
                <div className="mt-2">
                  <select
                    name="network"
                    id="network"
                    value={formState["network"]}
                    onChange={handleFormChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {currencies
                      .find(currency => currency.symbol === formState["currency"])
                      ?.networks
                      ?.map((network) => (
                        <option key={network} value={network}>{network}</option>
                    ))}
                    <option hidden key="" value=""></option>
                  </select>
                </div>
              </div>

              <div
                hidden={formState["data-source"] !== "blockchain"}
                className="col-span-full"
              >
                <label htmlFor="blockchain-address" className="block text-sm font-medium leading-6 text-gray-900">
                  Blockchain address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="blockchain-address"
                    id="blockchain-address"
                    onChange={handleFormChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {modalAction == "edit" ? "Save ": "Submit"}
          </button>
        </div>
      </form>

      {/* debug */}
      {/* {JSON.stringify(formState)} */}
    </div>
  )
}