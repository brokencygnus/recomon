import { useState } from 'react'
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


// For api-list page
export function TestConnectionList({ item }) {
  // Mock API
  // Format: [{code: "api001", state: "unstarted | pending | done"}]
  const [requestState, setRequestState] = useState('unstarted')
  const [expanded, setExpanded] = useState(false)

  const handleRequest = () => {
    if (requestState === 'unstarted' || requestState === 'done') {
      setRequestState('pending');
      setExpanded(false);

      // Mock API request
      setTimeout(() => {setRequestState('done')}, 1000);
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="flex items-center">
          <TestButton handleRequest={handleRequest}/>
          <div className="flex flex-col 3xl:flex-row items-start 3xl:items-center justify-start">
            <StatusIndicator
              item={item}
              requestState={requestState}
            />
            <ViewResButton   
              toggleExpand={toggleExpand}
              requestState={requestState}
              expanded={expanded}
            />
          </div>
        </div>
      </div>
      <div
        style={{ display: requestState === "done" ? "" : "none" }}
        className={classNames(
          'overflow-hidden transition-all ease-out', expanded ? 'opacity-100 translate-y-0 duration-200 h-full' : 'opacity-0 -translate-y-2 duration-0 h-0')}>
        <ResponsePreview
          item={item}
        />
      </div>
    </div>
  )
}


// For api-list/details page
export function TestConnectionDetails({ item }) {
  // Mock API
  // Format: [{code: "api001", state: "unstarted | pending | done"}]
  const [requestState, setRequestState] = useState('unstarted')
  
  const handleRequest = () => {
    if (requestState === 'unstarted' || requestState === 'done') {
      setRequestState('pending');

      // Mock API request
      setTimeout(() => {setRequestState('done')}, 1000);
    }
  };

  const detectCodes = (response) => {
    try {
      let parsedResponse = JSON.parse(response)
      let dataObject = parsedResponse.data
      return Object.keys(dataObject).join(', ')

    } catch (error) {
      return null
    }
  }

  return (
    <div className="flex block flex-col">
      <div className="flex block flex-row justify-between">
        <div>
          <h3 className="text-base font-semibold leading-6 text-gray-900">Test Connection</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>
              Test the connectivity of your endpoint.
            </p>
          </div>
        </div>
        <div>
          <TestButton handleRequest={handleRequest}/>
        </div>
      </div>
      <div className={`flex grow items-center ${requestState === "unstarted" ? "" : "pt-6"}`}>
        <p 
          style={{ display: requestState === "done" ? "" : "none" }}
          className="text-gray-900 font-medium text-sm">
            Status:
        </p>
        <StatusIndicator
          item={item}
          requestState={requestState}
        />
      </div>
      <div
        className={classNames(
          'overflow-hidden transition-all ease-out', requestState === "done" ? 'opacity-100 translate-y-0 duration-200 h-full' : 'opacity-0 -translate-y-2 duration-50 h-0')}>
          <ResponsePreview
          item={item}
        />
        <div className="flex flex-col grow items-start pt-6">
          <p className="text-gray-900 font-medium text-sm">Detected account codes:</p>
          <p className="text-gray-600 mt-3 text-sm">{detectCodes(item.testResponse) ?? "No account codes detected"}</p>
        </div>
      </div>
    </div>
  )
}


function TestButton({ handleRequest }) {
  return (
  <button
    type="button"
    onClick={() => handleRequest()}
    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
  >
    Test
  </button>
  )
}


function Throbber() {
  return (
    <div
      className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-gray-300 border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]">
    </div>
  )
}


function StatusIndicator({ item, requestState }) {
  return (
    <div>
      <div
        style={{ display: requestState === "pending" ? "" : "none" }}
        className="ml-3 inline-block flex items-center"
      >
        <Throbber />
      </div>
      <div
        style={{ display: requestState === "done" ? "" : "none" }}
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
    </div>
  )
}


function ViewResButton({ toggleExpand, requestState, expanded }) {
  return (
  <button
    style={{ display: requestState === "done" ? "" : "none" }}
    onClick={() => toggleExpand()}
    className="ml-3 mt-2 3xl:mt-0 font-medium text-sm text-indigo-500 hover:text-indigo-700">
    {expanded ? "Hide response" : "View response"}
  </button>
  )
}


function ResponsePreview({ item }) {
  const response = () => {
    if (!item.testResponse) {
      console.log("test")
      return ""
    }

    let processedValue = ""

    try {
      processedValue = JSON.stringify(JSON.parse(item.testResponse), null, 2)
        .replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;') 
    } catch (error) {
      processedValue = item.testResponse
    }
    return processedValue
  }

  return (
    <div>
      <div className={classNames(
        "text-sm text-gray-900 mt-3 overflow-y-auto max-h-20 rounded-md px-2.5 py-1.5",
        item?.testResponse ? "font-mono text-wrap break-all bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300" : "text-pretty")}>
        <p
          dangerouslySetInnerHTML={{ __html:
            response()}} 
        />
        <p className="text-gray-500">{item?.testResponse ? null : "(No response body was given by the server.)"}</p>
      </div>
    </div>
  )
}