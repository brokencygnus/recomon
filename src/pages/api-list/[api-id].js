import { useState, useContext } from 'react';
import Layout from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import ClientOnly from '@/app/components/csr';
import { TestConnectionDetails, LastConnectionDetails } from '@/app/sections/api-list/test_connection';
import { ToastContext } from '@/app/components/toast';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

// mock data start

import { APIs, accountsUsingAPI } from '@/app/constants/mockdata/api-list_mockdata';

// mock data end

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function APIPage() {
  const breadcrumbPages = [
    { name: 'Manage APIs', href: '/api-list', current: false },
    { name: 'Endpoint Details', href: '#', current: true },
  ]


  return (
    <Layout currentTab="api" breadcrumbPages={breadcrumbPages}>
      <main className="relative flex flex-rows">
        <div
          style={{ scrollbarGutter: "stable" }}
          className="h-screen w-full overflow-y-auto -mt-16 pt-[5.5rem] py-10"
        >
          <div className="w-3/5 pb-16 px-12 2xl:px-16">
            <APIDetails APIData={APIs[0]}/>
          </div>
        </div>
        <aside className="absolute inset-y-0 w-2/5 right-0 h-screen -mt-16 flex flex-col block gap-y-6 overflow-y-scroll bg-gray-100 border-l border-gray-200 px-4 pt-20 pb-16 xl:px-8">
          <LastRetrievalCard APIData={APIs[0]} />
          <AccountListCard />
        </aside>
      </main>
    </Layout>
  )
}

function APIDetails({ APIData }) {
  const [isEdit, setIsEdit] = useState(false);

  const [formState, setFormState] = useState({
    "code": APIData?.code ?? '',
    "api-name": APIData?.name ?? '',
    "url": APIData?.url.replace(/^https?:\/\//, '') ?? '',
    "custom-headers": APIData?.custom_headers ? JSON.stringify(JSON.parse(APIData?.custom_headers), null, 2) : '',
  });
  
  const { addToast } = useContext(ToastContext)
  const launchToast = () => {
    addToast({ color: "green", message: "Endpoint details edited!" })
  }
  
  const handleSave = () => {
    launchToast()
    setIsEdit(false)
    // Enter save logic here
  }

  return (
    <>
      <APIDetailsHeader
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        handleSave={handleSave}
      />
      <APIDetailsContent
        formState={formState}
        setFormState={setFormState}
        APIData={APIs[0]}
        isEdit={isEdit}
      />
    </>
  )
}
  
function APIDetailsHeader({ isEdit, setIsEdit, handleSave }) {
  return (
    <div className="flex items-center mb-4">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Endpoint Details</h1>
            </div>
          </header>
        </div>
      </div>
        <div className="flex items-end">
          {isEdit ? (
            <div className="flex justify-end gap-x-3">
              <button
                type="button"
                onClick={() => setIsEdit(false)}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSave}
                className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEdit(true)}
              className="ml-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              Edit
            </button>
          )}
        </div>
    </div>
  );
}


function APIDetailsContent({ formState, setFormState, APIData, isEdit }) {
  return (
    <div className="flex flex-col divide-y divide-gray-900/10">
      <div className="pb-12">
        <EditEndpoint
          formState={formState}
          setFormState={setFormState}
          APIData={APIData}
          isEdit={isEdit}
        />
      </div>
      <div className="py-12">
        <TestConnectionDetails item={APIs[0]} />
      </div>
      <div className="py-12">
        <div className="flex flex-row justify-between">
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">Retrieval Frequency</h3>
            <p className="mt-2 text-sm text-gray-500">Adjust how often to retrieve data from your API.</p>
          </div>
          <a
            href={`/settings?menu=api-freq&api=${APIData.code}`}
            className="h-10 flex items-center rounded px-2 py-1 text-sm font-semibold text-sky-600 hover:text-sky-900"
          >
            View settings
          </a>
        </div>
      </div>
    </div>
  )
}

export function EditEndpoint({ formState, setFormState, APIData, isEdit }) {
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleHeaderChange = (event) => {
    const { name, value } = event.target;
    let processedValue = ""

    try {
      processedValue = JSON.stringify(JSON.parse(value), null, 2)
    } catch (error) {
      processedValue = value
    }

    setFormState((prevState) => ({
      ...prevState,
      [name]: processedValue,
    }));
  };

  return (
    <div id="edit-endpoint-form">
      <div className="space-y-12">
        {/* <h2 className="text-base font-semibold leading-7 text-gray-900">API Details</h2>
        <p className="mt-1 mb-10 text-sm leading-6 text-gray-600">
          Description for API Details.
        </p> */}

        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          <div className="col-span-1">
            <p className="block text-sm font-medium leading-6 text-gray-900">
              Code
            </p>
            {isEdit ? (
              <div className="mt-2">
                <input
                  type="text"
                  name="code"
                  value={formState?.["code"]}
                  onChange={handleFormChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
                  placeholder="A001"
                />
              </div>
            ) : (
              APIData?.code ?
                <p className="mt-2 py-2 text-sm text-gray-500">{APIData.code}</p>
              :
                <p className="mt-2 py-2 text-sm text-gray-500 italic">&#40;No name set&#41;</p>
            )}
          </div>

          <div className="col-span-3">
            <p className="block text-sm font-medium leading-6 text-gray-900">
              API name
            </p>
            {isEdit ? (
              <div className="mt-2">
                <input
                  type="text"
                  name="api-name"
                  value={formState["api-name"]}
                  onChange={handleFormChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
                  placeholder="My API"
                />
              </div>
            ) : (
              APIData?.name ?
                <p className="mt-2 py-1.5 text-sm text-gray-500">{APIData.name}</p>
              :
                <p className="mt-2 py-1.5 text-sm text-gray-500 italic">&#40;No name set&#41;</p>
            )}
          </div>

          <div className="col-span-full">
            <p className="block text-sm font-medium leading-6 text-gray-900">
              URL
            </p>
              {isEdit ? (
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600">
                    <span className="flex select-none items-center pl-3 text-gray-500">https://</span>
                    <input
                      type="url"
                      name="url"
                      value={formState["url"]}
                      onChange={handleFormChange}
                      autoComplete="url"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 leading-6"
                    />
                  </div>
              </div>
              ) : (
                APIData?.url ?
                  <p className="mt-2 py-2 text-sm text-wrap break-all text-gray-500">{APIData.url}</p>
                :
                  <p className="mt-2 py-2 text-sm text-gray-500 italic">&#40;No code set&#41;</p>
              )}
          </div>

          <div className="col-span-full">
            <div className="flex justify-between">
              <label htmlFor="custom-headers" className="block text-sm font-medium leading-6 text-gray-900">
                Custom headers
              </label>
              {isEdit &&
                <span className="text-sm leading-6 text-gray-500" id="email-optional">
                  Optional
                </span>
              }
            </div>
            {isEdit ? (
              <>
                <div className="mt-2 font-mono text-wrap break-all max-h-[8.5rem]">
                  <textarea
                    name="custom-headers"
                    value={formState["custom-headers"]}
                    onChange={handleHeaderChange}
                    style={{ maxHeight: "136px", resize: "none" }}
                    rows={6}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm leading-6"
                    placeholder={`{ 
  "Authorization": "Bearer token",
  "Content-Type": "application/json"
}` /* Please don't "fix" the indentation, this is a template literal */}
                    />
                </div>
              </>
            ) : (
              APIData?.custom_headers ?
                <div className="mt-2 rounded-md bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300">
                  <p 
                    className="px-3 py-1.5 text-sm font-mono text-wrap break-all text-gray-900 max-h-[8.5rem] leading-6 overflow-y-auto" 
                    dangerouslySetInnerHTML={{ __html:
                      JSON.stringify(JSON.parse(APIData.custom_headers), null, 2)
                      .replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;') }} 
                  />
                </div>
              :
                <p className="mt-2 py-2 text-sm text-gray-500 italic">&#40;No custom headers set&#41;</p>
            )}
          </div>
        </div>
      </div>
      {/* debug */}
      {/* {JSON.stringify(formState)} */}
    </div>
  )
}

function Card({ children }) {
  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="p-8">
        {children}
      </div>
    </div>
  )
}


function LastRetrievalCard({ APIData }) {
  return (
    <Card>
      <ClientOnly>
        <LastConnectionDetails api={APIData}/>
      </ClientOnly>
    </Card>
  )
}


function AccountListCard() {
  return (
    <Card>
      <h3 className="text-base font-semibold leading-6 text-gray-900">Accounts</h3>
      <div className="mt-2 text-sm text-gray-500">
        <p>
          A list of accounts that are currently using this endpoint as their data source.
        </p>
      </div>
      {accountsUsingAPI.some((businessUnit) => (businessUnit.accounts.some(account => !account.detected))) ? 
        <div className="flex rounded-md bg-red-50 p-4 mt-4">
          <div className="flex flex-shrink-0 items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <p className="ml-3 text-sm text-red-700">
            Some of your accounts were assigned to this endpoint, but their account codes were not detected. Check your configurations.
          </p>
        </div>
      : null}
      {accountsUsingAPI.map((businessUnit) => (
        <div key={businessUnit.business_unit}>
          <div className="mt-8 mb-4">
            <div className="flex items-center">
              <div className="flex-auto">
                <h1 className="text-sm font-semibold leading-6 text-gray-900">{businessUnit.business_unit}</h1>
              </div>
            </div>
          </div>
          <div className="px-2 mt-4 mb-8 flow-root">
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
                        Currency
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {businessUnit.accounts.map((account) => (
                      <tr key={account.code} className="hover:bg-gray-50">
                        <td
                          className={classNames((account.detected ? "text-gray-500" : "font-medium text-red-500"),
                            "whitespace-nowrap py-4 pl-1 pr-3 text-sm")}
                        >
                          {account.code}
                        </td>
                        <td
                          className={classNames((account.detected ? "text-gray-600" : "text-red-500"),
                            "whitespace-nowrap px-3 py-4 text-sm font-medium")}
                        >
                          {account.name}
                          </td>
                        <td
                          className={classNames((account.detected ? "text-gray-500" : "font-medium text-red-500"),
                            "whitespace-nowrap px-3 py-4 text-sm")}
                        >
                          {account.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Card>
  )
}