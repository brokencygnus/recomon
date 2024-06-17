export default function APITable({ data }) {
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
                    Last retrieval
                  </th>
                  {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                    Custom headers
                  </th> */}
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
                    Test connection
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.code} className="bg-white hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-1 pr-3 text-sm text-gray-500">{item.code}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600 max-w-40 text-wrap">{item.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 min-w-32 max-w-64">
                      <div className="flex justify-between items-center">
                        <SeeMore
                          content={item.url}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-600">
                      <p className="">{convertAgeMsToDateTime(item.ageMS).toString()}
                        <span className="font-normal text-gray-300"> &#40;{convertMsToTime(item.ageMS)} ago&#41;</span>
                      </p>
                    </td>
                    {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 min-w-40 max-w-80">
                      <div className="flex justify-between items-center">
                        <SeeMore
                          content={item.custom_headers}
                        />
                      </div>
                    </td> */}
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-72 3xl:w-96">
                      <TestConnection item={item} />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-1 py-4 text-right text-sm font-semibold text-indigo-600 hover:text-indigo-900">
                      <button>
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