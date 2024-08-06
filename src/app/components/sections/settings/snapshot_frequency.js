import { useState, useContext } from 'react';
import { RetrievalFreqProvider, RetrievalFreqBody, RetrievalFreqButtons } from '@/app/components/sections/api-list/retrieval_frequency';
import { Dropdown } from "@/app/components/dropdown";
import { ToastContext } from '@/app/components/toast';

// mock data start

import { businessUnits, defaultSnapshotSettings } from '@/app/constants/mockdata/mockdata';

// mock data end

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function SnapshotFrequency() {
  const [isDefault, setIsDefault] = useState(true);
  const [currentBu, setCurrentBu] = useState(null);

  const buOptions = businessUnits.map(bu => ({ name: bu.name, value: bu.id }));

  const handleBuChange = (event) => {
    const { value } = event.target;
    setCurrentBu(value);
  };

  const currentBuData = () => {
    if (isDefault) {
      return defaultSnapshotSettings;
    } else if (currentBu) {
      let selectBu = businessUnits.find(bu => bu.id === currentBu.value);
      return selectBu.snapshotSettings;
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
    addToast({ color: "green", message: "Snapshot configuration saved!" });
  };
  return (
    <RetrievalFreqProvider
      retrievalSettings={currentBuData()}
      defaultSettings={!isDefault && defaultSnapshotSettings}
      disabled={!isDefault && !currentBu}
      onSave={handleSave}
    >
      <div className="flex flex-row justify-between pb-6">
        <p className="mt-2 text-sm text-gray-600">Adjust how often to record snapshots of your business units' data.</p>
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
              Select business unit
            </button>
          </nav>
          <RetrievalFreqButtons />
        </div>
        <div>
          {isDefault ?
            <p className="text-sm text-gray-600">
              Default snapshot configuration will be used as fallback if a business unit does not have its own configuration.
            </p>
            :
            <p className="text-sm text-gray-600">
              Snapshot configuration specific to a business unit.
            </p>}
        </div>
        {!isDefault &&
          <div className="flex flex-row grow items-center">
            <p className="w-56 text-sm text-gray-600">Business unit</p>
            <Dropdown
              options={buOptions}
              selectedOption={currentBu?.name}
              onSelect={handleBuChange}
              className="w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6" />
          </div>}
      </div>
      <RetrievalFreqBody />
    </RetrievalFreqProvider>
  );
}
