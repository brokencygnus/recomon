import Layout from '@/app/components/layout';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { RetrievalFreqProvider, RetrievalFreqBody, RetrievalFreqButtons } from '@/app/components/sections/retrieval_frequency';
import { checkDataEdited } from '@/app/utils/utils';
import { Dropdown } from "@/app/components/dropdown";
import { NumberInput } from "@/app/components/numberinput"
import { UserIcon, BanknotesIcon, CameraIcon, CodeBracketIcon, BellAlertIcon, EnvelopeIcon, BellIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { ToastContext } from '@/app/components/toast'

// mock data start

import { APIs, businessUnits, defaultApiRetrievalSettings, defaultSnapshotSettings } from '@/app/constants/mockdata/mockdata'
import { exchangeCurrencies } from '@/app/constants/mockdata/exchange_mockdata'

// mock data end

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SettingsPage() {
  return (
      <Layout>
        <div className="bg-stone-100 min-h-full pb-16">
          <div className="mx-auto max-w-7xl pt-16 px-8">
            <SettingsHeader />
            <div className="flex gap-x-6">
              <aside className="mt-6 block shrink-0 py-4 w-64">
                <SettingsMenus />
              </aside>
              <main className="grow mt-6 pb-16 px-6 py-4 ">
                <div className="rounded-lg bg-white shadow-md p-8">
                  <CurrentSettings />
                </div>
              </main>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  
function SettingsHeader() {
  return (
    <div className="flex items-baseline border-b border-gray-200">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Organization Settings</h1>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
}

function SettingsMenus() {
  const router = useRouter()
  const query = { ...router.query };
  const { pathname } = router;
  const currentMenu = query.menu

  const changeMenu = (slug) => {
    // Clear query so more specific queries no longer apply
    for (let q in query) delete query[q];

    query.menu = slug
    router.replace({ pathname, query }, undefined, { shallow: true });
  }

  const menus = [
    { name: 'Organization', slug: "general", icon: UserIcon },
    { name: 'Currencies', slug: "currencies", icon: BanknotesIcon },
    { name: 'Snapshot Frequency', slug: "snapshot-freq", icon: CameraIcon },
    { name: 'API Retrieval Frequency', slug: "api-freq", icon: CodeBracketIcon },
    { name: 'Alerts', slug: "alerts", icon: BellAlertIcon },
  ]

  return (
      <nav className="px-4 sm:px-6 lg:px-0">
        <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
          {menus.map((menu) => (
            <li key={menu.name}>
              <button
                onClick={() => changeMenu(menu.slug)}
                className={classNames(
                  menu.slug === currentMenu
                    ? 'bg-stone-200 text-stone-600'
                    : 'text-gray-700 hover:bg-stone-200 hover:text-stone-600',
                  'group flex w-full gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6',
                )}
              >
                <menu.icon
                  aria-hidden="true"
                  className={classNames(
                    menu.slug === currentMenu
                      ? 'text-stone-600'
                      : 'text-gray-400 group-hover:text-stone-600',
                    'h-6 w-6 shrink-0',
                  )}
                />
                {menu.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
  )
}

function CurrentSettings() {
  const router = useRouter()
  const query = { ...router.query };
  const currentMenu = query.menu

  switch (currentMenu) {
    case 'general': return null
    case 'currencies': return null
    case 'api-freq': return <ApiRetrieval />
    case 'snapshot-freq': return <SnapshotRetrieval />
    case 'alerts': return <Alerts />
    default: return null
  }
}


function ApiRetrieval() {
  const router = useRouter()
  const query = { ...router.query };

  const defaultAPI = query.api && APIs.find(api => api.code === query.api)
  const defaultApiOption = query.api && { name:defaultAPI.name, value:defaultAPI.id }

  const [isDefault, setIsDefault] = useState(query.api ? false : true)
  const [currentAPI, setCurrentAPI] = useState(defaultApiOption)

  const apiOptions = APIs.map(api => ({ name:api.name, value:api.id }))

  const handleApiChange = (event) => {
    const { value } = event.target
    setCurrentAPI(value)
  }

  const currentApiData = () => {
    if (isDefault) {
      return defaultApiRetrievalSettings
    } else if (currentAPI) {
      let selectAPI = APIs.find(api => api.id === currentAPI.value)
      return selectAPI.apiRetrievalSettings
    } else {
      return null
    }
  }

  const handleSave = () => {
    // Do API things
    launchToast()
  }

  const { addToast } = useContext(ToastContext)

  const launchToast = () => {
    addToast({ color: "green", message: "Retrieval configuration saved!" })
  }

  return (
    <RetrievalFreqProvider 
      retrievalSettings={currentApiData()}
      defaultSettings={!isDefault && defaultApiRetrievalSettings}
      disabled={!isDefault && !currentAPI}
      onSave={handleSave}
    >
      <div className="flex flex-row justify-between pb-6">
        <div>
          <h2 className="text-base font-semibold leading-6 text-gray-900">API Retrieval Frequency</h2>
          <p className="mt-2 text-sm text-gray-600">Adjust how often to retrieve data from your API.</p>
        </div>
      </div>
      <div className="flex flex-col justify-start gap-y-6 pt-6 border-t border-gray-300">
        <div className="flex justify-between">
          <nav aria-label="Tabs" className="flex space-x-4">
            <button
              onClick={() => setIsDefault(true)}
              className={classNames(
                isDefault ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium',
              )}
            >
              Default
            </button>
            <button
              onClick={() => setIsDefault(false)}
              className={classNames(
                !isDefault ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium',
              )}
            >
              Select API
            </button>
          </nav>
          <RetrievalFreqButtons />
        </div>
        <div>
          {isDefault ?
            <p className="text-sm text-gray-600">
              Default API retrieval configuration will be used as fallback if an API does not have its own configuration.
              </p>
          :
            <p className="text-sm text-gray-600">
              Retrieval configuration specific to an API.
            </p>
          }
        </div>
        {!isDefault &&
          <div className="flex flex-row grow items-center">
            <p className="w-56 text-sm text-gray-600">API</p>
            <Dropdown
              options={apiOptions}
              selectedOption={currentAPI?.name}
              onSelect={handleApiChange}
              className="w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
            />
          </div>
        }
      </div>
      <RetrievalFreqBody/>
    </RetrievalFreqProvider>
  )
}

function SnapshotRetrieval() {
  const [isDefault, setIsDefault] = useState(true)
  const [currentBu, setCurrentBu] = useState(null)

  const buOptions = businessUnits.map(bu => ({ name:bu.name, value:bu.id }))

  const handleBuChange = (event) => {
    const { value } = event.target
    setCurrentBu(value)
  }

  const currentBuData = () => {
    if (isDefault) {
      return defaultSnapshotSettings
    } else if (currentBu) {
      let selectBu = businessUnits.find(bu => bu.id === currentBu.value)
      return selectBu.snapshotSettings
    } else {
      return null
    }
  }

  const handleSave = () => {
    // Do API things
    launchToast()
  }

  const { addToast } = useContext(ToastContext)
  
  const launchToast = () => {
    addToast({ color: "green", message: "Snapshot configuration saved!" })
  }
  return (
    <RetrievalFreqProvider
      retrievalSettings={currentBuData()}
      defaultSettings={!isDefault && defaultSnapshotSettings}
      disabled={!isDefault && !currentBu}
      onSave={handleSave}
    >
      <div className="flex flex-row justify-between pb-6">
        <div>
          <h2 className="text-base font-semibold leading-6 text-gray-900">Snapshot Frequency</h2>
          <p className="mt-2 text-sm text-gray-600">Adjust how often to take snapshot data of your business units.</p>
        </div>
      </div>
      <div className="flex flex-col justify-start gap-y-6 pt-6 border-t border-gray-300">
        <div className="flex justify-between">
          <nav aria-label="Tabs" className="flex space-x-4">
            <button
              onClick={() => setIsDefault(true)}
              className={classNames(
                isDefault ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium',
              )}
            >
              Default
            </button>
            <button
              onClick={() => setIsDefault(false)}
              className={classNames(
                !isDefault ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium',
              )}
            >
              Select business unit
            </button>
          </nav>
          <RetrievalFreqButtons />
        </div>
        <div>
          {isDefault ?
            <p className="text-sm text-gray-600">
              Default snapshot configuration will be used as fallback if a business unit does not have its own configuration.
              </p>
          :
            <p className="text-sm text-gray-600">
              Snapshot configuration specific to a business unit.
            </p>
          }
        </div>
        {!isDefault &&
          <div className="flex flex-row grow items-center">
            <p className="w-56 text-sm text-gray-600">Business unit</p>
            <Dropdown
              options={buOptions}
              selectedOption={currentBu?.name}
              onSelect={handleBuChange}
              className="w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
            />
          </div>
        }
      </div>
      <RetrievalFreqBody/>
    </RetrievalFreqProvider>
  )
}


function Alerts() {
  const [currentBu, setCurrentBu] = useState(null)
  const [currentCurrency, setCurrentCurrency] = useState(null)

  const buOptions = businessUnits.map(bu => ({ name:bu.name, value:bu.id }))
  const currencyOptions = exchangeCurrencies.map(cur => ({ name:cur.name, value:cur.symbol }))

  const handleBuChange = (event) => {
    const { value } = event.target
    setCurrentBu(value)
    // Reset currency to the first one in BU
    setCurrentCurrency(currencyOptions[0])
  }

  const handleCurrencyChange = (event) => {
    const { value } = event.target
    setCurrentCurrency(value)
  }

  const currentBuData = businessUnits.find(bu => bu.id === currentBu?.value)
  const buDiscrAlertConf = currentBuData?.discrAlertConf

  const currentCurrencyData = exchangeCurrencies.find(cur => cur.symbol == currentCurrency?.value)

  const { addToast } = useContext(ToastContext)

  const launchToast = () => {
    addToast({ color: "green", message: "Alert configuration saved!" })
  }

  const handleSave = () => {
    // Do API things
    launchToast()
  }

  return (
    <div className="flex flex-col space-y-14">
      <div className="mb-6">
        <div className="flex flex-row justify-between">
          <div>
            <h2 className="text-base font-semibold leading-6 text-gray-900">Alerts</h2>
            <p className="mt-2 text-sm text-gray-600">Alerts appear as desktop notifications as well as email notifications, and is configured on a business unit basis.</p>
          </div>
        </div>
        <div className="flex flex-row grow items-center mt-6 pt-6 border-t border-gray-300">
          <p className="w-56 text-sm font-medium text-gray-600">Business unit</p>
          <Dropdown
            options={buOptions}
            selectedOption={currentBu?.name}
            onSelect={handleBuChange}
            className="w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
          />
        </div>
      </div>

      {currentBu &&
        <>
          <div>
            <BuDiscrepancyHeader
              discrAlertConf={buDiscrAlertConf}
            />
            <DiscrepancyConfig
              discrAlertConf={buDiscrAlertConf}
              onSave={handleSave}
            />
          </div>
          <div>
            <CurrencyDiscrepancyHeader
              discrAlertConf={buDiscrAlertConf}
              currencyOptions={currencyOptions}
              currentCurrency={currentCurrency}
              handleCurrencyChange={handleCurrencyChange}
            />
            <DiscrepancyConfig
              discrAlertConf={currentCurrencyData?.discrAlertConf}
              currency={currentCurrencyData?.symbol}
              onSave={handleSave}
            />
          </div>
          <OtherAlerts />
        </>
      }
    </div>
  )
}

function BuDiscrepancyHeader({ discrAlertConf }) {
  const initialState = {
    buGapIsSendPush: discrAlertConf?.buSendPush ?? true,
    buGapIsSendEmail: discrAlertConf?.buSendEmail ?? true,
  }

  const [formState, setFormState] = useState(initialState);

  // Reset if data is changed
  useEffect(() => {
    setFormState(initialState)
  }, [discrAlertConf])

  const handleFormChange = (event) => {
    
    const { name, value } = event.target
    const updatedState = {
      ...formState,
      [name]: value,
    };
    setFormState(updatedState)
  }

  const handleToggle = (event) => {
    const { name } = event.target;
    const newValue = !formState[name]
    handleFormChange({target: { name, value: newValue }})
  }

  return (
    <div className="flex flex-row justify-between">
      <div>
        <h3 className="text-sm font-semibold leading-6 text-gray-900">Business unit gap</h3>
        <p className="mt-2 text-sm text-gray-600">Notify everyone in your organization if the gap in this business unit has reached the following thresholds.</p>
      </div>
      <div className="flex items-center -mt-1.5 gap-x-4 pl-6 pr-3">
        <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <BellIcon className="shrink-0 h-6 w-6 text-gray-400"/>
          <input
            id="buGapIsSendPush"
            name="buGapIsSendPush"
            type="checkbox"
            checked={formState.buGapIsSendPush}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
          />
        </label>
        <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <EnvelopeIcon className="shrink-0 h-6 w-6 text-gray-400"/>
          <input
            id="buGapIsSendEmail"
            name="buGapIsSendEmail"
            type="checkbox"
            checked={formState.buGapIsSendEmail}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
          />
        </label>
      </div>
    </div>
  )
}


function CurrencyDiscrepancyHeader({ discrAlertConf, currencyOptions, currentCurrency, handleCurrencyChange }) {
  const initialState = {
    curGapIsSendPush: discrAlertConf?.curSendPush ?? true,
    curGapIsSendEmail: discrAlertConf?.curSendEmail ?? true,
  }

  const [formState, setFormState] = useState(initialState);

  // Reset if data is changed
  useEffect(() => {
    setFormState(initialState)
  }, [discrAlertConf])

  const handleFormChange = (event) => {
    
    const { name, value } = event.target
    const updatedState = {
      ...formState,
      [name]: value,
    };
    setFormState(updatedState)
  }

  const handleToggle = (event) => {
    const { name } = event.target;
    const newValue = !formState[name]
    handleFormChange({target: { name, value: newValue }})
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div>
          <h3 className="text-sm font-semibold leading-6 text-gray-900">Currency gap</h3>
          <p className="mt-2 text-sm text-gray-600">Notify everyone in your organization if the gap in a currency has reached the following thresholds.</p>
        </div>
        <div className="flex items-center -mt-1.5 gap-x-4 pl-6 pr-3">
          <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
            <BellIcon className="shrink-0 h-6 w-6 text-gray-400"/>
            <input
              id="curGapIsSendPush"
              name="curGapIsSendPush"
              type="checkbox"
              checked={formState.curGapIsSendPush}
              onChange={handleToggle}
              className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
            />
          </label>
          <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
            <EnvelopeIcon className="shrink-0 h-6 w-6 text-gray-400"/>
            <input
              id="curGapIsSendEmail"
              name="curGapIsSendEmail"
              type="checkbox"
              checked={formState.curGapIsSendEmail}
              onChange={handleToggle}
              className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
            />
          </label>
        </div>
      </div>
      <div className="flex flex-row grow items-center mt-6 pt-6 border-t border-gray-300">
        <p className="w-56 text-sm font-medium text-gray-600">Currency</p>
        <Dropdown
          options={currencyOptions}
          selectedOption={currentCurrency?.name}
          onSelect={handleCurrencyChange}
          className="w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
        />
      </div>
    </div>
  )
}


// Set currency to currency.symbol if configuring currency instead of business unit as a whole
function DiscrepancyConfig({ discrAlertConf, onSave, currency=null }) {
  const gapBasisOptions = [{ name: "USD", value: "usd" }]
  currency && gapBasisOptions.push({ name: currency, value: "currency" })
  gapBasisOptions.push({ name: "% of capital", value: "percent" })

  const initialState = {
    gapBasis: discrAlertConf
      ? gapBasisOptions.find(basis => basis.value == discrAlertConf.basis)
      : { name: "USD", value: "usd" },
    critHigh: discrAlertConf?.critHigh ? true : false,
    critHighVal: discrAlertConf?.critHigh ?? null,
    acctbleHigh: discrAlertConf?.acctbleHigh ? true : false,
    acctbleHighVal: discrAlertConf?.acctbleHigh ?? null,
    acctbleLow: discrAlertConf?.acctbleLow ? true : false,
    acctbleLowVal: discrAlertConf?.acctbleLow 
      ? Math.abs(discrAlertConf?.acctbleLow) 
      : null,
    acctbleLowIsNeg: discrAlertConf?.acctbleLow 
      ? Math.sign(discrAlertConf?.acctbleLow) === -1
        ? true : false
      : true,
    critLow: discrAlertConf?.critLow ? true : false,
    critLowVal: discrAlertConf?.critLow ? 
      Math.abs(discrAlertConf?.critLow) 
      : null,
    critLowIsNeg: discrAlertConf?.critLow 
      ? Math.sign(discrAlertConf?.critLow) === -1
        ? true : false
      : true,
  }

  const [formState, setFormState] = useState(initialState);
  const [isDataEdited, setIsDataEdited] = useState(false)

  // Reset if data is changed
  useEffect(() => {
    setFormState(initialState)
  }, [discrAlertConf])

  const handleFormChange = (event) => {
    
    const { name, value } = event.target
    const updatedState = {
      ...formState,
      [name]: value,
    };
    setFormState(updatedState)
    checkDataEdited(initialState, updatedState, setIsDataEdited)
  }

  const handleToggle = (event) => {
    const { name } = event.target;
    const newValue = !formState[name]
    handleFormChange({target: { name, value: newValue }})
  }

  const handleSelectBasis = (event) => {
    const { value } = event.target;
    handleFormChange({target: { name: "gapBasis", value: value }})
  }

  const handleCancel = () => {
    setFormState(initialState)
  }

  const handleSave = () => {
    onSave()
    setIsDataEdited(false)
  }

  return (
    <div className="flex flex-col mt-6 border-t border-gray-300 divide-y divide-gray-100">
      <div className="flex justify-between py-6">
        <label className="flex group items-center rounded-md pl-2 pr-6 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <input
            id="critHigh"
            name="critHigh"
            type="checkbox"
            checked={formState.critHigh}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
          />
          <p className="text-sm font-medium text-gray-600">Critical high gap</p>
        </label>
        <div className="flex items-center gap-x-3">
          <p className="text-sm text-gray-500">Notify when above</p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500">
              <PlusIcon className="h-4 w-4" />
            </div>
            <NumberInput
              id="critHighVal"
              name="critHighVal"
              type="text"
              // maximum={formState?.gapBasis?.value === "percent" ? 100 : undefined}
              value={formState.critHighVal}
              onChange={handleFormChange}
              className="block w-48 text-right rounded-md border-0 py-1.5 pl-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
          </div>
          <Dropdown
            options={gapBasisOptions}
            selectedOption={formState?.gapBasis?.name}
            onSelect={handleSelectBasis}
            className="w-32 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
          />
        </div>
      </div>
      
      <div className="flex justify-between py-6">
        <label className="flex group items-center rounded-md pl-2 pr-6 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <input
            id="acctbleHigh"
            name="acctbleHigh"
            type="checkbox"
            checked={formState.acctbleHigh}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
          />
          <p className="text-sm font-medium text-gray-600">Unacceptable high gap</p>
        </label>
        <div className="flex items-center gap-x-3">
          <p className="text-sm text-gray-500">Notify when above</p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500">
              <PlusIcon className="h-4 w-4" />
            </div>
            <NumberInput
              id="acctbleHighVal"
              name="acctbleHighVal"
              type="text"
              // maximum={formState?.gapBasis?.value === "percent" ? 100 : undefined}
              value={formState.acctbleHighVal}
              onChange={handleFormChange}
              className="block w-48 text-right rounded-md border-0 py-1.5 pl-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
          </div>
          <Dropdown
            options={gapBasisOptions}
            selectedOption={formState?.gapBasis?.name}
            onSelect={handleSelectBasis}
            className="w-32 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
          />
        </div>
      </div>
      
      <div className="flex justify-between py-6">
        <label className="flex group items-center rounded-md pl-2 pr-6 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <input
            id="acctbleLow"
            name="acctbleLow"
            type="checkbox"
            checked={formState.acctbleLow}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
          />
          <p className="text-sm font-medium text-gray-600">Unacceptable low gap</p>
        </label>
        <div className="flex items-center gap-x-3">
          <p className="text-sm text-gray-500">Notify when below</p>
          <div className="relative">
            <button
              id="acctbleLowIsNeg"
              name="acctbleLowIsNeg"
              value={formState?.acctbleLowIsNeg}
              onClick={handleToggle}
              className="absolute inset-y-0 left-0 flex items-center p-1 m-1 text-gray-500 rounded-md hover:bg-sky-50 hover:text-sky-600"
            >
            { formState?.acctbleLowIsNeg ?
              <MinusIcon className="h-4 w-4 pointer-events-none" />
            :
              <PlusIcon className="h-4 w-4 pointer-events-none" />
            }
            </button>
            <NumberInput
              id="acctbleLowVal"
              name="acctbleLowVal"
              type="text"
              // maximum={formState?.gapBasis?.value === "percent" ? 100 : undefined}
              value={formState.acctbleLowVal}
              onChange={handleFormChange}
              className="block w-48 text-right rounded-md border-0 py-1.5 pl-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
          </div>
          <Dropdown
            options={gapBasisOptions}
            selectedOption={formState?.gapBasis?.name}
            onSelect={handleSelectBasis}
            className="w-32 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
          />
        </div>
      </div>
      
      <div className="flex justify-between py-6">
        <label className="flex group items-center rounded-md pl-2 pr-6 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <input
            id="critLow"
            name="critLow"
            type="checkbox"
            checked={formState.critLow}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
          />
          <p className="text-sm font-medium text-gray-600">Critical low gap</p>
        </label>
        <div className="flex items-center gap-x-3">
          <p className="text-sm text-gray-500">Notify when below</p>
          <div className="relative">
            <button
              id="critLowIsNeg"
              name="critLowIsNeg"
              value={formState?.critLowIsNeg}
              onClick={handleToggle}
              className="absolute inset-y-0 left-0 flex items-center p-1 m-1 text-gray-500 rounded-md hover:bg-sky-50 hover:text-sky-600"
            >
            { formState?.critLowIsNeg ?
              <MinusIcon className="h-4 w-4 pointer-events-none" />
            :
              <PlusIcon className="h-4 w-4 pointer-events-none" />
            }
            </button>
            <NumberInput
              id="critLowVal"
              name="critLowVal"
              type="text"
              // maximum={formState?.gapBasis?.value === "percent" ? 100 : undefined}
              value={formState.critLowVal}
              onChange={handleFormChange}
              className="block w-48 text-right rounded-md border-0 py-1.5 pl-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
          </div>
          <Dropdown
            options={gapBasisOptions}
            selectedOption={formState?.gapBasis?.name}
            onSelect={handleSelectBasis}
            className="w-32 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
          />
        </div>
      </div>

      <div className="flex justify-end py-6 gap-x-4">
        { isDataEdited ? 
          <button
            type="button" 
            onClick={handleCancel}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
        : null}
        <button
          type="button"
          onClick={handleSave}
          className={classNames(
            isDataEdited ? "bg-sky-600 hover:bg-sky-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            : "bg-gray-50 text-gray-600 pointer-events-none",
            "rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm"
          )}
        >
          Save
        </button>
      </div>

      {/* {JSON.stringify(formState)} */}
    </div>
  )
}


function OtherAlerts() {
  const initialState = {
    remindUpdateIsSendEmail: false,
    remindUpdateIsSendPush: false,
    remindUpdateDays: 60,
    apiFailedIsSendEmail: false,
    apiFailedIsSendPush: false,
    apiErrorIsSendEmail: false,
    apiErrorIsSendPush: false,
    repeatNotif: false
  }

  const [formState, setFormState] = useState(initialState);

  const handleFormChange = (event) => {
    
    const { name, value } = event.target
    const updatedState = {
      ...formState,
      [name]: value,
    };
    setFormState(updatedState)
  }

  const handleToggle = (event) => {
    const { name } = event.target;
    const newValue = !formState[name]
    handleFormChange({target: { name, value: newValue }})
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-semibold leading-6 text-gray-900">Other alerts</h3>

      <div className="flex flex-col mt-6 border-t border-gray-300 divide-y divide-gray-100">
        <div className="flex justify-between py-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600">Manual update reminder</p>
            <p className="mt-2 text-sm text-gray-600">Notify everyone in your organization if an account has not been updated for a period of time.</p>
          </div>
          <div className="flex items-center -mt-1.5 gap-x-4 pl-6 pr-3">
            <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
              <BellIcon className="shrink-0 h-6 w-6 text-gray-400"/>
              <input
                id="remindUpdateIsSendPush"
                name="remindUpdateIsSendPush"
                type="checkbox"
                checked={formState.remindUpdateIsSendPush}
                onChange={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
              />
            </label>
            <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
              <EnvelopeIcon className="shrink-0 h-6 w-6 text-gray-400"/>
              <input
                id="remindUpdateIsSendEmail"
                name="remindUpdateIsSendEmail"
                type="checkbox"
                checked={formState.remindUpdateIsSendEmail}
                onChange={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between py-6">
          <p className="text-sm font-medium text-gray-600">Remind to manually update accounts after</p>
          <div className="flex gap-x-3 pr-6">
            <NumberInput
              id="remindUpdateDays"
              name="remindUpdateDays"
              type="text"
              value={formState.remindUpdateDays}
              onChange={handleFormChange}
              className="block w-24 text-right rounded-md border-0 py-1.5 pl-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
            <p className="mt-2 text-sm text-gray-600">days</p>
          </div>
        </div>

        <div className="flex justify-between py-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600">Notify failed API retrieval</p>
            <p className="mt-2 text-sm text-gray-600 text-pretty">Notify everyone in your organization if a retrieval attempt to one of your APIs has failed.</p>
          </div>
          <div className="flex items-center -mt-1.5 gap-x-4 pl-6 pr-3">
            <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
              <BellIcon className="shrink-0 h-6 w-6 text-gray-400"/>
              <input
                id="apiFailedIsSendPush"
                name="apiFailedIsSendPush"
                type="checkbox"
                checked={formState.apiFailedIsSendPush}
                onChange={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
              />
            </label>
            <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
              <EnvelopeIcon className="shrink-0 h-6 w-6 text-gray-400"/>
              <input
                id="apiFailedIsSendEmail"
                name="apiFailedIsSendEmail"
                type="checkbox"
                checked={formState.apiFailedIsSendEmail}
                onChange={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-between py-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600">Notify API configuration error</p>
            <p className="mt-2 text-sm text-gray-600 text-pretty">Notify everyone in your organization if an API did not return data for every account that it is assigned to.</p>
          </div>
          <div className="flex items-center -mt-1.5 gap-x-4 pl-6 pr-3">
            <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
              <BellIcon className="shrink-0 h-6 w-6 text-gray-400"/>
              <input
                id="apiErrorIsSendPush"
                name="apiErrorIsSendPush"
                type="checkbox"
                checked={formState.apiErrorIsSendPush}
                onChange={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
              />
            </label>
            <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
              <EnvelopeIcon className="shrink-0 h-6 w-6 text-gray-400"/>
              <input
                id="apiErrorIsSendEmail"
                name="apiErrorIsSendEmail"
                type="checkbox"
                checked={formState.apiErrorIsSendEmail}
                onChange={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
              />
            </label>
          </div>
        </div>

        <div className="flex -ml-1.5 py-6 border-t border-gray-100">
          <label className="flex justify-between items-center w-full rounded-md pl-2 pr-6 py-1.5 hover:cursor-pointer hover:bg-gray-50">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Repeat notifications</h3>
              <p className="mt-2 text-sm text-gray-500 text-pretty">Send notifications even if the current gap has been reached during the previous snapshot.</p>
            </div>
            <input
              id="repeatNotif"
              name="repeatNotif"
              type="checkbox"
              checked={formState.repeatNotif}
              onChange={handleToggle}
              className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none"
            />
          </label>
        </div>    

      </div>
    </div>
  )
}