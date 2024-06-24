import { useRouter } from 'next/router';
import { useState } from 'react'
import dynamic from 'next/dynamic';
import Layout from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { APIs } from '@/app/constants/mockdata';

const APITable = dynamic(() => import('@/app/components/api-list/api-table'), { ssr: false });

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function APIPage() {
  const breadcrumbPages = [
    { name: 'Manage APIs', href: '#', current: true },
  ]

  const [APIFilters, setAPIFilters] = useState();

  const handleResetFilters = () => {
  }

  return (
      <Layout currentTab="api">
        <main className="pt-10 px-12 2xl:px-16">
          <Breadcrumbs breadcrumbPages={breadcrumbPages} />
          <APIHeader/>
          <APIFIlter
            handleSearchChange={null}
            handleResetFilters={handleResetFilters}
          />
        </main>
        <div className="flex-grow overflow-y-auto mt-8 px-12 2xl:px-16">
          <APITable
            data={APIs}
          />
        </div>
      </Layout>
    )
  }
  
function APIHeader() {

  return (
    <div className="flex items-center mb-4">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Manage APIs</h1>
              <p className="mt-2 text-sm text-gray-700">Manage your data source APIs to keep your balances up to date.&nbsp;
                <a href='#' className="font-semibold text-indigo-600">How do I set up APIs?</a>
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
function APIFIlter({ handleSearchChange, handleResetFilters }) {
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
            Reset search
          </button>
        </div>
      </div>
        <div className="flex items-end">
          <button
            type="button"
            className="ml-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add API
          </button>
        </div>
    </div>
  )
}