import Link from 'next/link';
import { SeeMore } from '@/app/components/seemore';
import { convertMsToTime, convertAgeMsToDateTime } from '@/app/utils/utils';
import { TestConnectionList } from './testconnection';

export default function APITable({ data }) {
  return (
    <div className="relative mb-8 flow-root">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
          <table className="border-separate border-spacing-0 min-w-full">
            <thead className="sticky -top-2 z-10 bg-white">
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
              {data.map((item) => (
                <tr key={item.code} className="bg-white hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-2 pr-3 text-sm text-gray-500 border-b border-gray-300">
                    {item.code}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600 border-b border-gray-300">
                    <span className="text-wrap">{item.name}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border-b border-gray-300">
                    <div className="flex justify-between items-center">
                      <SeeMore
                        content={item.url}
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600 border-b border-gray-300">
                    <p className="">{convertAgeMsToDateTime(item.ageMS).toString()}
                      <span className="font-normal text-gray-500"> &#40;{convertMsToTime(item.ageMS)} ago&#41;</span>
                    </p>
                  </td>
                  {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border-b border-gray-300">
                    <div className="flex justify-between items-center">
                      <SeeMore
                        content={item.custom_headers}
                      />
                    </div>
                  </td> */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border-b border-gray-300">
                    <div className="w-72 3xl:w-96">
                      <TestConnectionList item={item} />
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-2 py-4 text-right text-sm font-semibold text-indigo-600 hover:text-indigo-900 border-b border-gray-300">
                    <Link
                      href={{
                        pathname: `/api-list/api-001`,
                      }}>
                      Details<span className="sr-only">, {item.name}</span>
                    </Link>
                  </td>
                </tr>
              ))}
              <tr key="end" className="h-16 sticky bottom-0 z-10 pointer-events-none bg-gradient-to-t from-white to-transparent">
                <td colSpan={6}/>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}