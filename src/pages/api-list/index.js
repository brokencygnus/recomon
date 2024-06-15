import { useState } from 'react'
import Layout from '../../app/components/layout';
import { Breadcrumbs } from '../../app/components/breadcrumbs';
import { SlideOver } from '../../app/components/slideover';
import { convertMsToTime, convertAgeMsToDateTime } from '../../app/utils';
import { MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import { Transition } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// TODO Move API Details to a new page where the user can see connected accounts

// Mock data start

const APIData = [
  { code: "api001", name: "Fireblocks API", ageMS: 7527951, testResult: "200 OK", url: "https://www.campinvestment.com/api/fireblocks-api", custom_headers: `{"Authorization": "Bearer aByw0ysG?a9p4DVE8dVejvRqQqc9gfu8bhjcQktePcGmmoQRD2kO7IIE-X?QIydVej6obypz8f3pb6xyzp7dMgTMniOZ3!pAUWaPxIFEntpcVETSLjO?FworL/ZIHK=d4lyKJYViK52Ho=bOUAEIw!VyBlbwjB6qA-T-MrF-F/QauhZUm2vSvIBX0Wk800iCSYH7j3N7US-hlso/2aHN5FAoV6gyFL83dsEP/DvTl3=xyg7QT6q-7rQYUJtjNy!j", "Content-Type": "application/json"}`},
  { code: "api002", name: 'Anchorage API', ageMS: 41357, testResult: "421 I'm a teapot", url: "https://www.campinvestment.com/api/anchorage-api", custom_headers: `{"Authorization": "Bearer HhrowEjiGEFu2jwAb7TT?x6CchlLy7zVt95RqLV90VmXITNCuLVogx-Vm2ou?7HNPVyvCv!jUz!EvdboeW-1MEqEvxu2qZZy/7aV/!4VYE1gGiErMiU!B8bECQxFaBEThwAgYcUvuotIlNdhCHCUOSnevyG0VCiIBiGfmslzYqhsueZgPWsKis?VI9MoGUCHS7cFXTByIa009MdZI7H?x2z2L7Nkrp79-KoOhAgz4Ynml!7XbSH4ryoAbRAyPYj/, "Content-Type": "application/json"}`},
  { code: "api003", name: 'Coinbase API', ageMS: 17472025, testResult: "431 Request Header Fields Too Large", url: "https://www.campinvestment.com/api/coinbase-api", custom_headers: `{"Authorization": "Bearer -dr4SCoHsfatQdVdFQfm7HjY6X8RqkfPm9TZjrymna0muDHy-mI=5-0TueymzoutEsmt301rS7hT6CBp8pLq7vGDnXDQ9JS-GZtHIqydCuX1s?t0jikt4QKHcpq3I4NvkTDT-0=UZaAd94x/J9fA3wvCpuJVg=0nkkfiE9jc4OEmBsTfIsNudYs2Cuh4rH7a01fkN9wVUw6GV1cSNBzMXn1qLSifZD68IdRTZXfrSC6nC254UmAeZFk-ApITHbrI, "Content-Type": "application/json"}`},
  { code: "api004", name: 'INDODAX API', ageMS: 477732, testResult: "500 Internal Server Error", url: "https://www.campinvestment.com/api/indodax-api", custom_headers: `{"Authorization": "Bearer tqEHkGR17NIFsX9BwIIsPxLmCQ!7C4E4VpEeybaDAvpgnBr?GpWXmLP=9AguLFy0iNaOGqz8U-qzQ?Z15ff786TTZumYWMXB59Dh-Lk20x/g8zRdvMnU4OZz6AQf1TbJAE6zlRXavd=ouYNcv9bb17SJ/ZY73hTCAyNHPZFFLA7Q/HQcOvGHqA4RD3pVqKcwdRYZXEXl-bmWGO!/RWWG2V3HHIxSUyRQ!xcaO1OlZsFguDUl!IuM3K3d6gAlC-yw, "Content-Type": "application/json"}`},
  { code: "api005", name: 'FalconX API', ageMS: 6149116, testResult: "218 This is fine", url: "https://www.campinvestment.com/api/falconx-api", custom_headers: `{"Authorization": "Bearer /yareM6OXxlkAp/fTeCMx!I8SBEdEapuWn0lMLoMY9ChLcYvpPk3a!f7V9DhyxSPe!TAr/cbC?udDm?OeIEndM?-LgMCS-imJbYjQw11w7=6I58?OcxWLn!/4F5nLWNN8N2l8K7Cf!vo1Yl5ITyz6fipN0QfA8OIg2l?Te=H1/qZNIFMs5jR1YjIWwZXcTZz2jXxh?cy8DyyIUgLYjLTukTeAdbKpcuU5nU9xiJ?fUr6Ff9ByFHifaDEFpi6t!zI, "Content-Type": "application/json"}`},
  { code: "api006", name: 'Internal CAMP API', ageMS: 46343658, testResult: "450 Blocked by Windows Parental Controls", url: "https://www.campinvestment.com/api/user-pool-balances", custom_headers: `{"Content-Type": "application/json"}`},
]

// Mock data end

export default function APIPage() {
  const breadcrumbPages = [
    { name: 'APIs', href: '#', current: true },
  ]

  const [APIFilters, setAPIFilters] = useState();

  const handleResetFilters = () => {
  }

  // slideover
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [slideOverData, setSlideOverData] = useState({});
  const [slideOverMode, setSlideOverMode] = useState("edit");

  // slideOverData = accounts[index]
  // mode = "edit" | "new"
  const openSlideOver = (slideOverData, mode) => {
    setSlideOverData(slideOverData)
    setSlideOverMode(mode)
    setIsSlideOverOpen(true);
  }

  return (
      <Layout>
        <main>
          <Breadcrumbs breadcrumbPages={breadcrumbPages} />
          <APIHeader openSlideOver={openSlideOver}/>
          <APIFIlter
            openSlideOver={openSlideOver}
            handleSearchChange={null}
            handleResetFilters={handleResetFilters}
          />
          <APITable
            data={APIData}
            openSlideOver={openSlideOver}
          />
          <SlideOver
            isSlideOverOpen={isSlideOverOpen}
            setIsSlideOverOpen={setIsSlideOverOpen}
            panelTitle={slideOverMode === "edit" ? "Edit API" : "New API"}
          >
            <EditAPI
              APIData={slideOverData}
              slideOverMode={slideOverMode}
            />
          </SlideOver>
        </main>
      </Layout>
    )
  }
  
function APIHeader() {

  return (
    <div className="flex items-center">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">APIs</h1>
              <p className="mt-2 text-sm text-gray-700">Manage your data source APIs to keep your balances up to date.&nbsp;
                <a href='#' className="font-semibold text-blue-600">How do I set up APIs?</a>
              </p>
            </div>
          </header>
        </div>
      </div>
      <div className="flex items-end">
      </div>
    </div>
  );
}

function EditAPI({ APIData, slideOverMode }) {
  const [formState, setFormState] = useState({
    "code": APIData?.code ?? '',
    "api-name": APIData?.name ?? '',
    "url": APIData?.name ?? '',
    "custom-headers": APIData?.custom_headers ?? '',
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
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

                <div className="grow col-span-2">
                  <label htmlFor="api-name" className="block text-sm font-medium leading-6 text-gray-900">
                    API name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="api-name"
                      id="api-name"
                      value={formState["api-name"]}
                      onChange={handleFormChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="My API"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-4">
                <label htmlFor="url" className="block text-sm font-medium leading-6 text-gray-900">
                  URL
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">https://</span>
                    <input
                      type="text"
                      name="url"
                      id="url"
                      autoComplete="url"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="custom-headers" className="block text-sm font-medium leading-6 text-gray-900">
                  Custom headers &#40;optional&#41;
                </label>
                <div className="mt-2 font-mono">
                  <textarea
                    name="custom-headers"
                    id="custom-headers"
                    value={formState["custom-headers"]}
                    onChange={handleFormChange}
                    rows={5}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={`{
  "Authorization": "Bearer token",
  "Content-Type": "application/json"
}` /* Please don't "fix" the indentation, this is a template literal */}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Enter the custom headers in JSON format.</p>
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
            {slideOverMode == "edit" ? "Save ": "Submit"}
          </button>
        </div>
      </form>
      {/* debug */}
      {/* {JSON.stringify(formState)} */}
    </div>
  )
}

function APIFIlter({ openSlideOver, handleSearchChange, handleResetFilters }) {
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
            placeholder="Search API"
            type="search"
            name="search"
          />
          <MagnifyingGlassIcon
            className="pointer-events-none w-5 mx-2 text-gray-400"
          />
        </form>
        <div>
          <button
            type="button"
            className="h-10 rounded px-2 py-1 text-sm font-semibold text-indigo-600"
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>
      </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {openSlideOver({}, "new")}}
            className="ml-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add API
          </button>
        </div>
    </div>
  )
}

function APITable({ data, openSlideOver }) {
  const [expandedHeaders, setExpandedHeaders] = useState([]);

  const toggleExpand = (code) => {
    if (expandedHeaders.includes(code)) {
      setExpandedHeaders(expandedHeaders.filter(item => item !== code));
    } else {
      setExpandedHeaders([...expandedHeaders, code]);
    }
  };
  
  return (
    <div>
      <div className="mt-4 mb-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-0">
                    Code
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                    API Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                    URL
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                    Custom headers
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                    Test connection
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.code}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{item.code}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600 max-w-40 text-wrap">{item.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-80 truncate">{item.url}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex justify-between items-center max-w-80">
                        {/* See More is displayed after 46 characters, since the content
                            is displayed in monospace. This is a stop gap solution. Finding
                            out when the content begins to truncate is necessary for a
                            permanent solution. */}
                        {expandedHeaders.includes(item.code) ? null : (
                          <>
                            <span className="font-mono truncate overflow-hidden">{item.custom_headers}</span>
                            {item.custom_headers.length > 46 && (
                              <button
                                className="font-semibold text-indigo-600 hover:text-indigo-900 ml-2 focus:outline-none"
                                onClick={() => toggleExpand(item.code)}
                              >
                                See more
                              </button>
                            )}
                          </>
                        )}
                        <Transition
                          show={expandedHeaders.includes(item.code)}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 -translate-y-2"
                          enterTo="transform opacity-100 translate-y-0"
                          leave="transition duration-0"
                          leaveFrom="hidden"
                          leaveTo="hidden"
                        >
                          <div className="flex justify-between items-center max-w-80">
                              <>
                                <span className="font-mono text-wrap break-all">{item.custom_headers}
                                  <span>
                                    <button
                                      className="font-sans font-semibold text-indigo-600 hover:text-indigo-900 hover:cursor-pointer ml-2 focus:outline-none"
                                      onClick={() => toggleExpand(item.code)}
                                    >
                                      See less
                                    </button>
                                  </span>
                                </span>
                              </>
                          </div>
                        </Transition>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <TestConnection item={item} />
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium text-indigo-600 hover:text-indigo-900 sm:pr-0">
                      <button
                        onClick={() => {openSlideOver(item, "edit")}}>
                        Configure<span className="sr-only">, {item.name}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestConnection({ item }) {
  // Mock API
  // Format: [{code: "api001", state: "unstarted | pending | done"}]
  const [requestState, setRequestState] = useState({})

  const handleRequest = (code) => {
    if (requestState[code] === 'unstarted' || requestState[code] === 'done' || !requestState[code]) {
      setRequestState((prevState) => ({
        ...prevState,
        [code]: 'pending',
      }));

      // Mock API request
      setTimeout(() => {
        // Update the state to 'done' after 100 ms
        setRequestState((prevState) => ({
          ...prevState,
          [code]: 'done',
        }));
      }, 1000);
    }
  };

  return (
    <div className="flex justify-between w-96">
      <div className="flex flex-row">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => handleRequest(item.code)}
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Test
          </button>
        </div>
        <div
          style={{ display: requestState[item.code] === "pending" ? "" : "none" }}
          className="ml-3 inline-block flex items-center"
        >
          <div
            className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-gray-300 border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]">
          </div>
        </div>
        <div
          style={{ display: requestState[item.code] === "done" ? "" : "none" }}
          className={classNames(
            item.testResult.substring(0, 1) === "2" ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800',
            'ml-3 items-center flex flex-nowrap rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
          )}
        >
          {item.testResult.substring(0, 1) === "2" ? (
            <CheckCircleIcon
              className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-400"
            />
          ) : (
            <XCircleIcon
              className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-400"
            />
          )}
          <span className="text-wrap">{item.testResult}</span>
        </div>
      <button
        style={{ display: requestState[item.code] === "done" ? "" : "none" }}
        onClick={null}
        className="ml-3 text-sm text-gray-600 hover:text-gray-900">
        View response<span className="sr-only">, {item.name}</span>
      </button>
      </div>
    </div>
  )
}