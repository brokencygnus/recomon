import { useRouter } from 'next/router';
import { useState, useContext } from 'react';
import { RetrievalFreqProvider, RetrievalFreqBody, RetrievalFreqButtons } from '@/app/sections/frequency/retrieval_frequency';
import { Dropdown } from "@/app/components/dropdown";
import { ToastContext } from '@/app/components/toast';

// mock data start

import { APIs, defaultApiRetrievalSettings } from '@/app/constants/mockdata/mockdata';

// mock data end

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ApiRetrievalFrequency() {
  const router = useRouter();
  const query = { ...router.query };

  const defaultAPI = query.api && APIs.find(api => api.code === query.api);
  const defaultApiOption = query.api && { name: defaultAPI.name, value: defaultAPI.id };

  const [isDefault, setIsDefault] = useState(query.api ? false : true);
  const [currentAPI, setCurrentAPI] = useState(defaultApiOption);

  const apiOptions = APIs.map(api => ({ name: api.name, value: api.id }));

  const handleApiChange = (event) => {
    const { value } = event.target;
    setCurrentAPI(value);
  };

  const currentApiData = () => {
    if (isDefault) {
      return defaultApiRetrievalSettings;
    } else if (currentAPI) {
      let selectAPI = APIs.find(api => api.id === currentAPI.value);
      return selectAPI.apiRetrievalSettings;
    } else {
      return null;
    }
  };

  const handleSave = () => {
    // Do API things
    launchToast();
  };

  const { addToast } = useContext(ToastContext);

  const launchToast = () => {
    addToast({ color: "green", message: "Retrieval configuration saved!" });
  };

  return (
    <RetrievalFreqProvider
      retrievalSettings={currentApiData()}
      defaultSettings={!isDefault && defaultApiRetrievalSettings}
      disabled={!isDefault && !currentAPI}
      onSave={handleSave}
    >
      <div className="flex flex-row justify-between pb-6">
        <p className="mt-2 text-sm text-gray-600">Adjust how often to retrieve data from your API.</p>
      </div>
      <div className="flex flex-col justify-start gap-y-6 pt-6 border-t border-gray-300">
        <div className="flex justify-between">
          <nav aria-label="Tabs" className="flex space-x-4">
            <button
              onClick={() => setIsDefault(true)}
              className={classNames(
                isDefault ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium'
              )}
            >
              Default
            </button>
            <button
              onClick={() => setIsDefault(false)}
              className={classNames(
                !isDefault ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium'
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
            </p>}
        </div>
        {!isDefault &&
          <div className="flex flex-row grow items-center">
            <p className="w-48 text-sm text-gray-600">API</p>
            <Dropdown
              options={apiOptions}
              selectedOption={currentAPI?.name}
              onSelect={handleApiChange}
              className="w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6" />
          </div>}
      </div>
      <RetrievalFreqBody />
    </RetrievalFreqProvider>
  );
}
