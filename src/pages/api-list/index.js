import { useState, useEffect, useContext } from 'react'
import Link from 'next/link';
import Layout from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { Modal } from '@/app/components/modal';
import { SearchFilter } from '@/app/utils/highlight_search'
import ClientOnly from '@/app/components/csr'
import { SeeMore } from '@/app/components/seemore';
import { TestConnectionList } from '@/app/components/sections/api-list/test_connection';
import { NotificationBadges } from '@/app/components/notifications/notification_badges';
import { ToastContext } from '@/app/components/toast';
import { convertMsToTimeAgo, convertAgeMsToDateTime } from '@/app/utils/dates';
import { HighlightSearch } from '@/app/utils/highlight_search';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { EditEndpoint } from './[api-id]';

// mockdata start

import { APIs } from '@/app/constants/mockdata/mockdata';
import { useRouter } from 'next/router';

// mockdata end

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function APIPage() {
  const router = useRouter()
  const { pathname } = router;
  const query = { ...router.query };

  const breadcrumbPages = [
    { name: 'Manage APIs', href: '#', current: true },
  ]

  const [filteredAPIs, setFilteredAPIs] = useState(APIs);
  const [searchTerm, setSearchTerm] = useState([]);

  const handleSearchChange = (event) => {
    const { value } = event.target
    const searchArray = value.split(" ")
    setSearchTerm(searchArray)
  }

  const handleResetFilters = () => {
    setSearchTerm([])
  }

  useEffect(() => {
    const tempFilteredAPIs = APIs.filter(api =>
      (SearchFilter(api.name, searchTerm)
      || SearchFilter(api.url, searchTerm))
    )
    
    setFilteredAPIs(tempFilteredAPIs)
  }, [APIs, searchTerm])

  // modal
  var isModalOpen = (query.action === "new")

  // modalData = accounts[index]
  // mode = "edit" | "new"
  const openModal = () => {
    query.action = "new"
    router.replace({ pathname, query }, undefined, { shallow: true });
  }

  const closeModal = () => {
    router.replace({
      pathname: '/api-list',
    }, 
      undefined,
      { shallow: true }
    );
  }

  return (
      <Layout currentTab="api" breadcrumbPages={breadcrumbPages}>
        <main className="relative pt-6 px-12 2xl:px-16">
          <APIHeader/>
          <div className="sticky top-0 bg-white z-[11]">
            <APIFilter
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              handleResetFilters={handleResetFilters}
              openModal={openModal}
            />
          </div>
          <div className="flex-grow mt-6">
            <APITable
              apiData={filteredAPIs}
              searchTerm={searchTerm}
            />
          </div>
          <Modal
            open={isModalOpen}
            setClose={closeModal}
            panelTitle={"New API Endpoint"}
          >
            <AddAPI
              setClose={closeModal}
            />
          </Modal>
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
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Manage APIs</h1>
              <p className="mt-2 text-sm text-gray-700">Manage your data source APIs to keep your balances up to date.&nbsp;
                <a href='#' className="font-semibold text-sky-600">How do I set up APIs?</a>
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
function APIFilter({ searchTerm, handleSearchChange, handleResetFilters, openModal }) {
  return (
    <div className="flex justify-between">
      <div className="flex flex-row items-end my-2 gap-x-3">
        <form className="flex rounded-md w-fit h-9 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <input
            id="search-accounts"
            className="border-0 py-0 px-0 mx-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search API"
            value={searchTerm.join(" ")}
            onChange={handleSearchChange}
            type="text"
            name="search"
          />
          <MagnifyingGlassIcon
            className="pointer-events-none w-5 mx-2 text-gray-400"
          />
        </form>
        <div>
          <button
            type="button"
            className="h-10 rounded px-2 py-1 text-sm font-semibold text-sky-600"
            onClick={handleResetFilters}
          >
            Reset search
          </button>
        </div>
      </div>
        <div className="flex items-end">
          <button
            onClick={openModal}
            type="button"
            className="ml-4 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            Add API
          </button>
        </div>
    </div>
  )
}

export function APITable({ apiData, searchTerm }) {
  return (
    <div className="mb-8 flow-root">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
          <table className="border-separate border-spacing-0 min-w-full">
            <thead className="sticky top-12 z-10 bg-white">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  Code
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  API Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  URL
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  Last successful retrieval
                </th>
                {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  Custom headers
                </th> */}
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  Test connection
                </th>
                <th className="border-b border-gray-300"/>
              </tr>
            </thead>
            <tbody>
              {apiData.map((api) => (
                <tr key={api.code} className="bg-white hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-2 pr-3 text-sm text-gray-500 border-b border-gray-300">
                    {api.code}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600 border-b border-gray-300">
                    <div className="flex items-center gap-x-3">
                      <span>{HighlightSearch(api.name, searchTerm, {base: '', highlight: 'bg-sky-300'})}</span>
                      {api.alerts && api.alerts.length !== 0 &&
                        <div className="flex gap-x-1">
                          <NotificationBadges size="sm" message="api" alerts={api.alerts}/>
                        </div>
                      }
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border-b border-gray-300">
                    <div className="flex justify-between items-center">
                      <SeeMore
                        content={HighlightSearch(api.url, searchTerm, {base: '', highlight: 'bg-sky-300'})}
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600 border-b border-gray-300">
                    <ClientOnly>
                      <p>{convertAgeMsToDateTime(api.ageMS).toString()}
                        <span className="px-3 font-normal text-gray-500">{convertMsToTimeAgo(api.ageMS)}</span>
                      </p>
                    </ClientOnly>
                  </td>
                  {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border-b border-gray-300">
                    <div className="flex justify-between items-center">
                      <SeeMore
                        content={item.custom_headers}
                      />
                    </div>
                  </td> */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border-b border-gray-300">
                    <div className="w-64 3xl:w-96">
                      <TestConnectionList item={api} />
                    </div>
                  </td>
                  <td className="whitespace-nowrap pl-3 pr-2 text-right text-sm font-semibold text-sky-600 hover:text-sky-900 border-b border-gray-300">
                    <Link
                      href={{
                        pathname: `/api-list/api-001`,
                      }}>
                      Details<span className="sr-only">, {api.name}</span>
                    </Link>
                  </td>
                </tr>
              ))}
              <tr key="end" className="h-16 sticky bottom-0 pointer-events-none bg-gradient-to-t from-white to-transparent">
                <td colSpan={6}/>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AddAPI({ setClose }) {
  const [formState, setFormState] = useState({
    "code": null,
    "api-name": null,
    "url": null,
    "custom-headers": null,
  });

  const { addToast } = useContext(ToastContext)
  const launchToast = () => {
    addToast({ color: "green", message: "New endpoint saved!" })
  }
  
  const handleSave = () => {
    launchToast()
    // Enter save logic here
  }
  
  return (
    <>
      <EditEndpoint
        formState={formState}
        setFormState={setFormState}
        APIData={null}
        isEdit={true}
      />
      <div className="mt-12 pt-6 flex items-center justify-end gap-x-6 border-t border-gray-900/10">
        <button 
          onClick={setClose}
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          type="button"
          className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          Save
        </button>
      </div>
    </>
  )
}