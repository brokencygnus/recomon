import { useState } from 'react';
import Layout from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { APIs, accountsUsingAPI } from '@/app/constants/mockdata';
import { TestConnectionDetails } from '@/app/components/api-list/testconnection';

export default function APIPage() {
  const breadcrumbPages = [
    { name: 'Manage APIs', href: '#', current: true },
    { name: 'Endpoint Details', href: '#', current: true },
  ]

  const [isEdit, setIsEdit] = useState(false);

  return (
    <Layout currentTab="api">
      <main className="relative flex flex-rows">
        <div
          style={{ scrollbarGutter: "stable" }}
          className="h-screen w-full overflow-y-auto -mt-16 pt-[6.5rem] py-10"
        >
          <div className="w-3/5 pb-16 px-12 2xl:px-16">
            <Breadcrumbs breadcrumbPages={breadcrumbPages} />
            <APIDetailsHeader
              isEdit={isEdit}
              setIsEdit={setIsEdit}
            />
            <APIDetailsContent
              APIData={APIs[0]}
              isEdit={isEdit}
            />
          </div>
        </div>
        <aside className="absolute inset-y-0 w-2/5 right-0 h-screen -mt-16 flex flex-col block gap-y-6 overflow-y-scroll bg-gray-100 border-l border-gray-200 px-4 pt-[6.5rem] pb-16 xl:px-8">
          <AccountListCard />
        </aside>
      </main>
    </Layout>
  )
}
  
function APIDetailsHeader({ isEdit, setIsEdit }) {
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
                onClick={() => setIsEdit(false)}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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


function APIDetailsContent({ APIData, isEdit }) {
  const [formState, setFormState] = useState({
    "code": APIData?.code ?? '',
    "api-name": APIData?.name ?? '',
    "url": APIData?.url.replace(/^https?:\/\//, '') ?? '',
    "custom-headers": JSON.stringify(JSON.parse(APIData?.custom_headers), null, 2) ?? '',
  });

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
    <div>
      <form id="edit-account-form">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            {/* <h2 className="text-base font-semibold leading-7 text-gray-900">API Details</h2>
            <p className="mt-1 mb-10 text-sm leading-6 text-gray-600">
              Description for API Details.
            </p> */}

            <div className="grid grid-cols-4 gap-x-4 gap-y-6">
              <div className="flex grid grid-cols-5 col-span-4 gap-x-6 ">
                <div className="col-span-1">
                  <p className="block text-sm font-medium leading-6 text-gray-900">
                    Code
                  </p>
                  {isEdit ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        name="code"
                        value={formState["code"]}
                        onChange={handleFormChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6"
                        placeholder="A001"
                      />
                    </div>
                  ) : (
                    <p className="mt-2 py-1.5 text-gray-500">{APIData?.code}</p>
                  )}
                </div>

                <div className="col-span-4">
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
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6"
                        placeholder="My API"
                      />
                    </div>
                  ) : (
                    <p className="mt-2 py-1.5 text-gray-500">{APIData?.name}</p>
                  )}
                </div>
              </div>

              <div className="col-span-full">
                <p className="block text-sm font-medium leading-6 text-gray-900">
                  URL
                </p>
                  {isEdit ? (
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                        <span className="flex select-none items-center pl-3 text-gray-500">https://</span>
                        <input
                          type="text"
                          name="url"
                          value={formState["url"]}
                          onChange={handleFormChange}
                          autoComplete="url"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 leading-6"
                        />
                      </div>
                  </div>
                  ) : (
                    <p className="mt-2 py-1.5 text-wrap break-all text-gray-500">{APIData?.url}</p>
                  )}
              </div>

              <div className="col-span-full">
                <p className="block text-sm font-medium leading-6 text-gray-900">
                  Custom headers &#40;optional&#41;
                </p>
                {isEdit ? (
                  <>
                    <div className="mt-2 font-mono text-wrap break-all max-h-[8.5rem]">
                      <textarea
                        name="custom-headers"
                        value={formState["custom-headers"]}
                        onChange={handleHeaderChange}
                        style={{ maxHeight: "136px", resize: "none" }}
                        rows={6}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"
                        placeholder={`{
  "Authorization": "Bearer token",
  "Content-Type": "application/json"
}` /* Please don't "fix" the indentation, this is a template literal */}
                        />
                    </div>
                  </>
                ) : (
                  <div className="mt-2 rounded-md bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300">
                    <p 
                      className="px-3 py-1.5 text-sm font-mono text-wrap break-all text-gray-900 max-h-[8.5rem] leading-6 overflow-y-auto" 
                      dangerouslySetInnerHTML={{ __html:
                        JSON.stringify(JSON.parse(APIData?.custom_headers), null, 2)
                        .replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;') }} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="pt-12">
          <TestConnectionDetails item={APIs[0]}/>
      </div>
      {/* debug */}
      {/* {JSON.stringify(formState)} */}
    </div>
  )
}


function Card({ children }) {
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
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
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-0">
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
                    {businessUnit.accounts.map((item) => (
                      <tr key={item.code} className="bg-white hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-1 pr-3 text-sm text-gray-500">{item.code}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600">{item.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.currency}</td>
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