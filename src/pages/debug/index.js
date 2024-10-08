import Layout from '@/app/components/layout';
import { useEffect, useContext, useState } from 'react';
import { config } from '@/app/constants/config'
import { useRouter } from 'next/router';
import { ToastContext, toastColors } from '@/app/components/toast'
import { AlertContext } from '@/app/components/notifications/alert'
import { Dropdown } from '@/app/components/dropdown'
import { notificationTypes } from '@/app/constants/notifications'
import { stringToColor } from '@/app/components/stringToColor';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function APIPage() {
  const router = useRouter()

  // Redirect to 404 if 
  useEffect(() => {
    if (config.env === 'prod') {
      router.replace('/404');
    }
  }, []);

  if (config.env === 'prod') {
    return null;
  }

  return (
      <Layout>
        <main className="min-h-full relative bg-gray-100">
          <div className="bg-white pt-10 px-12 2xl:px-16">
            <DebugHeader />
            {/* Content */}
          </div>
          <div className="sticky top-6 w-full h-10 bg-white z-[1] shadow-md"></div>
          <div className="relative flex-grow grid grid-cols-4 gap-x-6 gap-y-8 2xl:gap-x-8 py-8 px-12 2xl:px-16">
            <div className="col-span-1 h-96">
              <Card>
                <ToastModule />
              </Card>
            </div>
            <div>
              <Card>
                <AlertModule />
              </Card>
            </div>
            <div>
              <Card>
                <ColorModule />
              </Card>
            </div>
            <div className="col-span-1 h-96"><Slot>Slot 4</Slot></div>
            <div className="col-span-1 h-96"><Slot>Slot 5</Slot></div>
            <div className="col-span-1 h-96"><Slot>Slot 6</Slot></div>
            <div className="col-span-1 h-96"><Slot>Slot 7</Slot></div>
            <div className="col-span-1 h-96"><Slot>Slot 8</Slot></div>            
          </div>
        </main>
      </Layout>
    )
  }

function DebugHeader() {
  return (
    <div className="flex items-center">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Debug Dashboard</h1>
              <p className="mt-2 text-sm text-gray-700">Remove this page by modifying /pages/constants/config.js</p>
            </div>
          </header>
        </div>
      </div>
      <div className="flex items-end">
      {/* Buttons etc. go here */}
      </div>
    </div>
  );
}
  
function Slot({ children }) {
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(-45deg, #e5e7eb 10%, transparent 10%, transparent 50%, #e5e7eb 50%, #e5e7eb 60%, transparent 60%, transparent)",
        backgroundSize: "20px 20px"
      }}
      className="flex h-full items-center justify-center rounded-xl border-2 border-gray-200"
    >
      <div className="bg-gray-100 px-2 py-1.5 rounded-md font-semibold text-gray-400 border-2 border-gray-200">
        {children}
      </div>
    </div>
  )
}


function Card({ children }) {
  return (
    <div className="rounded-lg h-full bg-white shadow-md">
      <div className="flex flex-col px-8 py-8 gap-y-8">
        {children}
      </div>
    </div>
  )
}

function ToastModule() {
  const { addToast } = useContext(ToastContext)

  const toastColorOptions = toastColors.map(color => {
    return {
      ...color,
      value: color.name
    }
  })

  var [toastContents, setToastContents] = useState("Hi, I'm a new toast!")
  var [toastColor, setToastColor] = useState(toastColorOptions[0])

  const launchToast = () => {
    addToast({ color: toastColor.name, message: toastContents })
  }

  const handleToastContent = ({ target: {value} }) => {
    setToastContents(value)
  }

  const handleToastColor = ({ target: {value} }) => {
    setToastColor(value)
  }

  return (
    <div>
      <div className="flex justify-between gap-x-3">
        <div className="flex flex-col">
          <p className="text-md font-medium text-gray-700">Toast Launcher</p>
          <p className="text-sm text-gray-500">Launch a new toast based on the parameters below.</p>
        </div>
        <div>
          <button
            type="button"
            onClick={launchToast}
            className="rounded-md text-nowrap bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Launch toast!
          </button>
        </div>
      </div>
      <div className="flex mt-4 gap-x-3">
        <div className="flex grow flex-col">
          <p className="mb-1 block text-sm font-medium text-gray-900">Content</p>
          <input
            type="text"
            value={toastContents}
            onChange={handleToastContent}
            className="block w-full rounded-md border-0 py-1.5 text-sm text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
          />
        </div>
        <Dropdown
          labelText="Color"
          name='intervalType'
          options={toastColorOptions}
          selectedOption={toastColor.name}
          onSelect={handleToastColor}
          className="w-24 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        />
      </div>
    </div>
  )
}


function AlertModule() {
  const { addAlert } = useContext(AlertContext)

  return (
    <div>
      <div className="flex flex-col">
        <p className="text-md font-medium text-gray-700">Alert Launcher</p>
        <p className="text-sm text-gray-500">Launch a new preset alert.</p>
        <div className="grid grid-cols-2 3xl:grid-cols-3 gap-x-3 gap-y-2 mt-4">
          <button
            type="button"
            onClick={() => addAlert(notificationTypes["gap_critical_entireBU"]({ buName: "Exchange", buSlug: "exchange" }))}
            className="rounded-md text-nowrap bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
            Critical gap
          </button>
          <button
            type="button"
            onClick={() => addAlert(notificationTypes["gap_unacceptable_currency"]({ buName: "Fixed Deposit", buSlug: "fixed-deposit", curSymbol:"BTC" }))}
            className="rounded-md text-nowrap bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
            Medium gap
          </button>
          <button
            type="button"
            onClick={() => addAlert(notificationTypes["new_snapshot"]({ snapshotID:"14045", buName: "Loan", buSlug: "loan" }))}
            className="rounded-md text-nowrap bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
            New snapshot
          </button>
          <button
            type="button"
            onClick={() => addAlert(notificationTypes["api_config_error"]({ apiID: "14045" }))}
            className="rounded-md text-nowrap bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
            Config error
          </button>
          <button
            type="button"
            onClick={() => addAlert(notificationTypes["api_request_failed"]({ apiID: "14045" }))}
            className="rounded-md text-nowrap bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
            Stale API data
          </button>
          <button
            type="button"
            onClick={() => addAlert(notificationTypes["blockchain_connection_failed"]({ buSlug: "staking", networkName: "ERC-20", currencyName: "ETH" }))}
            className="rounded-md text-nowrap bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
            Blockchain
          </button>
          <button
            type="button"
            onClick={() => addAlert(notificationTypes["too_long_since_last_update"]({ buName: "Contract Market", buSlug: "contract-market", accountName: "Hedging Cold Wallet in Fireblocks", daysSinceLastUpdate: "60" }))}
            className="rounded-md text-nowrap bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
            High data age
          </button>
        </div>
      </div>
    </div>
  )
}


function ColorModule() {
  const [text, setText] = useState(null)

  const handleTextChange = ({ target: {value} }) => {
    setText(value)
  }

  return (
    <div>
      <div className="flex flex-col">
        <p className="text-md font-medium text-gray-700">Color Generator</p>
        <p className="text-sm text-gray-500">Generate a color from an arbitrary string. This color generation method is used as fallback if a currency has no icons, as it's chaotic &#40;but deterministic!&#41;.</p>
        <div className="grid grid-cols-3 gap-x-3 gap-y-2 mt-4"></div>
        <div className="flex mt-2 gap-x-3">
          <div className="flex grow flex-col">
            <p className="mb-1 block text-sm font-medium text-gray-900">Arbitrary string</p>
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              className="block w-full rounded-md border-0 py-1.5 text-sm text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
              placeholder="Enter absolutely anything"
            />
          </div>
        </div>
        <div className="flex items-center justify-center mt-8">
          <div style={{ backgroundColor:stringToColor(text) }} className="size-24 rounded-xl ring-4 ring-offset-4 ring-gray-300"/>
        </div>
      </div>
      </div>
  )
}