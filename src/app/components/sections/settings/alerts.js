import { useState, useEffect, useContext } from 'react';
import { checkDataEdited } from '@/app/utils/utils';
import { Dropdown } from "@/app/components/dropdown";
import { NumberInput } from "@/app/components/numberinput";
import { EnvelopeIcon, BellIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { ToastContext } from '@/app/components/toast';

// mock data start

import { businessUnits } from '@/app/constants/mockdata/mockdata';
import { exchangeCurrencies } from '@/app/constants/mockdata/exchange_mockdata';

// mock data end

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Alerts() {
  const [currentBu, setCurrentBu] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState(null);

  const buOptions = businessUnits.map(bu => ({ name: bu.name, value: bu.id }));
  const currencyOptions = exchangeCurrencies.map(cur => ({ name: cur.name, value: cur.symbol }));

  const handleBuChange = (event) => {
    const { value } = event.target;
    setCurrentBu(value);
    // Reset currency to the first one in BU
    setCurrentCurrency(currencyOptions[0]);
  };

  const handleCurrencyChange = (event) => {
    const { value } = event.target;
    setCurrentCurrency(value);
  };

  const currentBuData = businessUnits.find(bu => bu.id === currentBu?.value);
  const buDiscrAlertConf = currentBuData?.discrAlertConf;

  const currentCurrencyData = exchangeCurrencies.find(cur => cur.symbol == currentCurrency?.value);

  const { addToast } = useContext(ToastContext);

  const launchToast = () => {
    addToast({ color: "green", message: "Alert configuration saved!" });
  };

  const handleSave = () => {
    // Do API things
    launchToast();
  };

  return (
    <div className="flex flex-col space-y-14">
      <div className="mb-6">
        <div className="flex flex-row justify-between">
          <p className="mt-2 text-sm text-gray-600">Alerts appear as desktop notifications as well as email notifications, and is configured on a business unit basis.</p>
        </div>
        <div className="flex flex-row grow items-center mt-6">
          <p className="w-56 text-sm font-medium text-gray-600">Business unit</p>
          <Dropdown
            options={buOptions}
            selectedOption={currentBu?.name}
            onSelect={handleBuChange}
            className="w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6" />
        </div>
      </div>

      {currentBu &&
        <>
          <div>
            <BuDiscrepancyHeader
              discrAlertConf={buDiscrAlertConf} />
            <DiscrepancyConfig
              discrAlertConf={buDiscrAlertConf}
              onSave={handleSave} />
          </div>
          <div>
            <CurrencyDiscrepancyHeader
              discrAlertConf={buDiscrAlertConf}
              currencyOptions={currencyOptions}
              currentCurrency={currentCurrency}
              handleCurrencyChange={handleCurrencyChange} />
            <DiscrepancyConfig
              discrAlertConf={currentCurrencyData?.discrAlertConf}
              currency={currentCurrencyData?.symbol}
              onSave={handleSave} />
          </div>
          <OtherAlerts />
        </>}
    </div>
  );
}
function BuDiscrepancyHeader({ discrAlertConf }) {
  const initialState = {
    buGapIsSendPush: discrAlertConf?.buSendPush ?? true,
    buGapIsSendEmail: discrAlertConf?.buSendEmail ?? true,
  };

  const [formState, setFormState] = useState(initialState);

  // Reset if data is changed
  useEffect(() => {
    setFormState(initialState);
  }, [discrAlertConf]);

  const handleFormChange = (event) => {

    const { name, value } = event.target;
    const updatedState = {
      ...formState,
      [name]: value,
    };
    setFormState(updatedState);
  };

  const handleToggle = (event) => {
    const { name } = event.target;
    const newValue = !formState[name];
    handleFormChange({ target: { name, value: newValue } });
  };

  return (
    <div className="flex flex-row justify-between">
      <div>
        <h3 className="text-base font-semibold leading-6 text-gray-900">Business unit gap</h3>
        <p className="mt-2 text-sm text-gray-600">Notify everyone in your organization if the gap in this business unit has reached the following thresholds.</p>
      </div>
      <div className="flex items-center -mt-1.5 gap-x-4 pl-6 pr-3">
        <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <BellIcon className="shrink-0 h-6 w-6 text-gray-400" />
          <input
            id="buGapIsSendPush"
            name="buGapIsSendPush"
            type="checkbox"
            checked={formState.buGapIsSendPush}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
        </label>
        <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <EnvelopeIcon className="shrink-0 h-6 w-6 text-gray-400" />
          <input
            id="buGapIsSendEmail"
            name="buGapIsSendEmail"
            type="checkbox"
            checked={formState.buGapIsSendEmail}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
        </label>
      </div>
    </div>
  );
}
function CurrencyDiscrepancyHeader({ discrAlertConf, currencyOptions, currentCurrency, handleCurrencyChange }) {
  const initialState = {
    curGapIsSendPush: discrAlertConf?.curSendPush ?? true,
    curGapIsSendEmail: discrAlertConf?.curSendEmail ?? true,
  };

  const [formState, setFormState] = useState(initialState);

  // Reset if data is changed
  useEffect(() => {
    setFormState(initialState);
  }, [discrAlertConf]);

  const handleFormChange = (event) => {

    const { name, value } = event.target;
    const updatedState = {
      ...formState,
      [name]: value,
    };
    setFormState(updatedState);
  };

  const handleToggle = (event) => {
    const { name } = event.target;
    const newValue = !formState[name];
    handleFormChange({ target: { name, value: newValue } });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div>
          <h3 className="text-base font-semibold leading-6 text-gray-900">Currency gap</h3>
          <p className="mt-2 text-sm text-gray-600">Notify everyone in your organization if the gap in a currency has reached the following thresholds.</p>
        </div>
        <div className="flex items-center -mt-1.5 gap-x-4 pl-6 pr-3">
          <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
            <BellIcon className="shrink-0 h-6 w-6 text-gray-400" />
            <input
              id="curGapIsSendPush"
              name="curGapIsSendPush"
              type="checkbox"
              checked={formState.curGapIsSendPush}
              onChange={handleToggle}
              className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
          </label>
          <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
            <EnvelopeIcon className="shrink-0 h-6 w-6 text-gray-400" />
            <input
              id="curGapIsSendEmail"
              name="curGapIsSendEmail"
              type="checkbox"
              checked={formState.curGapIsSendEmail}
              onChange={handleToggle}
              className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
          </label>
        </div>
      </div>
      <div className="flex flex-row grow items-center mt-6 pt-6 border-t border-gray-300">
        <p className="w-56 text-sm font-medium text-gray-600">Currency</p>
        <Dropdown
          options={currencyOptions}
          selectedOption={currentCurrency?.name}
          onSelect={handleCurrencyChange}
          className="w-72 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6" />
      </div>
    </div>
  );
}
// Set currency to currency.symbol if configuring currency instead of business unit as a whole
function DiscrepancyConfig({ discrAlertConf, onSave, currency = null }) {
  const gapBasisOptions = [{ name: "USD", value: "usd" }];
  currency && gapBasisOptions.push({ name: currency, value: "currency" });
  gapBasisOptions.push({ name: "% of capital", value: "percent" });

  const initialState = {
    gapBasis: discrAlertConf
      ? gapBasisOptions.find(basis => basis.value == discrAlertConf.basis)
      : { name: "USD", value: "usd" },
    critHigh: discrAlertConf?.critHigh ? true : false,
    critHighVal: discrAlertConf?.critHigh ?? null,
    acctbleHigh: discrAlertConf?.acctbleHigh ? true : false,
    acctbleHighVal: discrAlertConf?.acctbleHigh ?? null,
    acctbleLow: discrAlertConf?.acctbleLow ? true : false,
    acctbleLowVal: discrAlertConf?.acctbleLow
      ? Math.abs(discrAlertConf?.acctbleLow)
      : null,
    acctbleLowIsNeg: discrAlertConf?.acctbleLow
      ? Math.sign(discrAlertConf?.acctbleLow) === -1
        ? true : false
      : true,
    critLow: discrAlertConf?.critLow ? true : false,
    critLowVal: discrAlertConf?.critLow ?
      Math.abs(discrAlertConf?.critLow)
      : null,
    critLowIsNeg: discrAlertConf?.critLow
      ? Math.sign(discrAlertConf?.critLow) === -1
        ? true : false
      : true,
  };

  const [formState, setFormState] = useState(initialState);
  const [isDataEdited, setIsDataEdited] = useState(false);

  // Reset if data is changed
  useEffect(() => {
    setFormState(initialState);
  }, [discrAlertConf]);

  const handleFormChange = (event) => {

    const { name, value } = event.target;
    const updatedState = {
      ...formState,
      [name]: value,
    };
    setFormState(updatedState);
    checkDataEdited(initialState, updatedState, setIsDataEdited);
  };

  const handleToggle = (event) => {
    const { name } = event.target;
    const newValue = !formState[name];
    handleFormChange({ target: { name, value: newValue } });
  };

  const handleSelectBasis = (event) => {
    const { value } = event.target;
    handleFormChange({ target: { name: "gapBasis", value: value } });
  };

  const handleCancel = () => {
    setFormState(initialState);
  };

  const handleSave = () => {
    onSave();
    setIsDataEdited(false);
  };

  return (
    <div className="flex flex-col mt-6 border-t border-gray-300 divide-y divide-gray-100">
      <div className="flex justify-between py-6">
        <label className="flex group items-center rounded-md pl-2 pr-6 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <input
            id="critHigh"
            name="critHigh"
            type="checkbox"
            checked={formState.critHigh}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
          <p className="text-sm font-semibold leading-6 text-gray-900">Critical high gap</p>
        </label>
        <div className="flex items-center gap-x-3">
          <p className="text-sm text-gray-500">Notify when above</p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500">
              <PlusIcon className="h-4 w-4" />
            </div>
            <NumberInput
              id="critHighVal"
              name="critHighVal"
              type="text"
              // maximum={formState?.gapBasis?.value === "percent" ? 100 : undefined}
              value={formState.critHighVal}
              onChange={handleFormChange}
              className="block w-48 text-right rounded-md border-0 py-1.5 pl-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
          </div>
          <Dropdown
            options={gapBasisOptions}
            selectedOption={formState?.gapBasis?.name}
            onSelect={handleSelectBasis}
            className="w-32 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6" />
        </div>
      </div>

      <div className="flex justify-between py-6">
        <label className="flex group items-center rounded-md pl-2 pr-6 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <input
            id="acctbleHigh"
            name="acctbleHigh"
            type="checkbox"
            checked={formState.acctbleHigh}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
          <p className="text-sm font-semibold leading-6 text-gray-900">Unacceptable high gap</p>
        </label>
        <div className="flex items-center gap-x-3">
          <p className="text-sm text-gray-500">Notify when above</p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500">
              <PlusIcon className="h-4 w-4" />
            </div>
            <NumberInput
              id="acctbleHighVal"
              name="acctbleHighVal"
              type="text"
              // maximum={formState?.gapBasis?.value === "percent" ? 100 : undefined}
              value={formState.acctbleHighVal}
              onChange={handleFormChange}
              className="block w-48 text-right rounded-md border-0 py-1.5 pl-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
          </div>
          <Dropdown
            options={gapBasisOptions}
            selectedOption={formState?.gapBasis?.name}
            onSelect={handleSelectBasis}
            className="w-32 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6" />
        </div>
      </div>

      <div className="flex justify-between py-6">
        <label className="flex group items-center rounded-md pl-2 pr-6 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <input
            id="acctbleLow"
            name="acctbleLow"
            type="checkbox"
            checked={formState.acctbleLow}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
          <p className="text-sm font-semibold leading-6 text-gray-900">Unacceptable low gap</p>
        </label>
        <div className="flex items-center gap-x-3">
          <p className="text-sm text-gray-500">Notify when below</p>
          <div className="relative">
            <button
              id="acctbleLowIsNeg"
              name="acctbleLowIsNeg"
              value={formState?.acctbleLowIsNeg}
              onClick={handleToggle}
              className="absolute inset-y-0 left-0 flex items-center p-1 m-1 text-gray-500 rounded-md hover:bg-sky-50 hover:text-sky-600"
            >
              {formState?.acctbleLowIsNeg ?
                <MinusIcon className="h-4 w-4 pointer-events-none" />
                :
                <PlusIcon className="h-4 w-4 pointer-events-none" />}
            </button>
            <NumberInput
              id="acctbleLowVal"
              name="acctbleLowVal"
              type="text"
              // maximum={formState?.gapBasis?.value === "percent" ? 100 : undefined}
              value={formState.acctbleLowVal}
              onChange={handleFormChange}
              className="block w-48 text-right rounded-md border-0 py-1.5 pl-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
          </div>
          <Dropdown
            options={gapBasisOptions}
            selectedOption={formState?.gapBasis?.name}
            onSelect={handleSelectBasis}
            className="w-32 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6" />
        </div>
      </div>

      <div className="flex justify-between py-6">
        <label className="flex group items-center rounded-md pl-2 pr-6 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
          <input
            id="critLow"
            name="critLow"
            type="checkbox"
            checked={formState.critLow}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
          <p className="text-sm font-semibold leading-6 text-gray-900">Critical low gap</p>
        </label>
        <div className="flex items-center gap-x-3">
          <p className="text-sm text-gray-500">Notify when below</p>
          <div className="relative">
            <button
              id="critLowIsNeg"
              name="critLowIsNeg"
              value={formState?.critLowIsNeg}
              onClick={handleToggle}
              className="absolute inset-y-0 left-0 flex items-center p-1 m-1 text-gray-500 rounded-md hover:bg-sky-50 hover:text-sky-600"
            >
              {formState?.critLowIsNeg ?
                <MinusIcon className="h-4 w-4 pointer-events-none" />
                :
                <PlusIcon className="h-4 w-4 pointer-events-none" />}
            </button>
            <NumberInput
              id="critLowVal"
              name="critLowVal"
              type="text"
              // maximum={formState?.gapBasis?.value === "percent" ? 100 : undefined}
              value={formState.critLowVal}
              onChange={handleFormChange}
              className="block w-48 text-right rounded-md border-0 py-1.5 pl-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
          </div>
          <Dropdown
            options={gapBasisOptions}
            selectedOption={formState?.gapBasis?.name}
            onSelect={handleSelectBasis}
            className="w-32 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6" />
        </div>
      </div>

      <div className="flex justify-end py-6 gap-x-4">
        {isDataEdited ?
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          : null}
        <button
          type="button"
          onClick={handleSave}
          className={classNames(
            isDataEdited ? "bg-sky-600 hover:bg-sky-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              : "bg-gray-50 text-gray-600 pointer-events-none",
            "rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm"
          )}
        >
          Save
        </button>
      </div>

      {/* {JSON.stringify(formState)} */}
    </div>
  );
}
function OtherAlerts() {
  const initialState = {
    remindUpdateIsSendEmail: false,
    remindUpdateIsSendPush: false,
    remindUpdateDays: 60,
    apiFailedIsSendEmail: false,
    apiFailedIsSendPush: false,
    apiErrorIsSendEmail: false,
    apiErrorIsSendPush: false,
    repeatNotif: "always",
    repeatConfig: null,
    coolDownDelayMinutes: 0,
  };

  const [formState, setFormState] = useState(initialState);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    const updatedState = {
      ...formState,
      [name]: value,
    };
    setFormState(updatedState);
  };

  const handleToggle = (event) => {
    const { name } = event.target;
    const newValue = !formState[name];
    handleFormChange({ target: { name, value: newValue } });
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-base font-semibold leading-6 text-gray-900">Other alert configurations</h3>

      <div className="flex flex-col mt-6 border-t border-gray-300 divide-y divide-gray-100">
        <div>
          <div className="flex justify-between py-6">
            <div className="flex flex-col">
              <p className="text-sm font-semibold leading-6 text-gray-900">Manual update reminder</p>
              <p className="mt-2 text-sm text-gray-600">Notify everyone in your organization if an account has not been updated for a period of time.</p>
            </div>
            <div className="flex items-center -mt-1.5 gap-x-4 pl-6 pr-3">
              <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
                <BellIcon className="shrink-0 h-6 w-6 text-gray-400" />
                <input
                  id="remindUpdateIsSendPush"
                  name="remindUpdateIsSendPush"
                  type="checkbox"
                  checked={formState.remindUpdateIsSendPush}
                  onChange={handleToggle}
                  className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
              </label>
              <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
                <EnvelopeIcon className="shrink-0 h-6 w-6 text-gray-400" />
                <input
                  id="remindUpdateIsSendEmail"
                  name="remindUpdateIsSendEmail"
                  type="checkbox"
                  checked={formState.remindUpdateIsSendEmail}
                  onChange={handleToggle}
                  className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between pt-5 pb-6 pl-6">
            <p className="text-sm font-semibold leading-6 text-gray-700">Remind to manually update accounts after</p>
            <div className="flex gap-x-3 pr-6">
              <NumberInput
                id="remindUpdateDays"
                name="remindUpdateDays"
                type="text"
                value={formState.remindUpdateDays}
                onChange={handleFormChange}
                className="block w-24 text-right rounded-md border-0 py-1.5 pl-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
              <p className="mt-2 text-sm text-gray-600">days</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between py-6">
          <div className="flex flex-col">
            <p className="text-sm font-semibold leading-6 text-gray-900">Notify failed API retrieval</p>
            <p className="mt-2 text-sm text-gray-600 text-pretty">Notify everyone in your organization if a retrieval attempt to one of your APIs has failed.</p>
          </div>
          <div className="flex items-center -mt-1.5 gap-x-4 pl-6 pr-3">
            <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
              <BellIcon className="shrink-0 h-6 w-6 text-gray-400" />
              <input
                id="apiFailedIsSendPush"
                name="apiFailedIsSendPush"
                type="checkbox"
                checked={formState.apiFailedIsSendPush}
                onChange={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
            </label>
            <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
              <EnvelopeIcon className="shrink-0 h-6 w-6 text-gray-400" />
              <input
                id="apiFailedIsSendEmail"
                name="apiFailedIsSendEmail"
                type="checkbox"
                checked={formState.apiFailedIsSendEmail}
                onChange={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
            </label>
          </div>
        </div>

        <div className="flex justify-between py-6">
          <div className="flex flex-col">
            <p className="text-sm font-semibold leading-6 text-gray-900">Notify API configuration error</p>
            <p className="mt-2 text-sm text-gray-600 text-pretty">Notify everyone in your organization if an API did not return data for every account that it is assigned to.</p>
          </div>
          <div className="flex items-center -mt-1.5 gap-x-4 pl-6 pr-3">
            <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
              <BellIcon className="shrink-0 h-6 w-6 text-gray-400" />
              <input
                id="apiErrorIsSendPush"
                name="apiErrorIsSendPush"
                type="checkbox"
                checked={formState.apiErrorIsSendPush}
                onChange={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
            </label>
            <label className="flex items-center rounded-md px-2 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
              <EnvelopeIcon className="shrink-0 h-6 w-6 text-gray-400" />
              <input
                id="apiErrorIsSendEmail"
                name="apiErrorIsSendEmail"
                type="checkbox"
                checked={formState.apiErrorIsSendEmail}
                onChange={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 pointer-events-none" />
            </label>
          </div>
        </div>

        <div>
          <div className="flex flex-col py-6">
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Repeat gap notifications</h3>
          </div>
          <fieldset>
            <div className="space-y-5">
              <label className="flex justify-start items-center w-full rounded-md pl-2 py-1.5 hover:cursor-pointer hover:bg-gray-50">
                <input
                  checked={formState.repeatNotif === "always"}
                  name="repeatNotif"
                  value="always"
                  type="radio"
                  onChange={handleFormChange}
                  className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600" />
                <div className="ml-3 text-sm leading-6">
                  <p className="font-medium text-gray-700">
                    Always send
                  </p>
                  <p className="text-gray-500 text-pretty">
                    Send notifications even if the current gap has been reached during the previous retrieval cycle.
                  </p>
                </div>
              </label>
              <label className="flex justify-between items-center gap-x-3 w-full rounded-md pl-2 py-1.5 hover:cursor-pointer hover:bg-gray-50">
                <div className="flex justify-start items-center">
                  <input
                    checked={formState.repeatNotif === "cooldown"}
                    name="repeatNotif"
                    value="cooldown"
                    type="radio"
                    onChange={handleFormChange}
                    className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600" />
                  <div className="ml-3 text-sm leading-6">
                    <p className="font-medium text-gray-700">
                      With cool down period
                    </p>
                    <p className="text-gray-500 text-pretty">
                      Only send notifications if a specified time interval has passed since the last.
                    </p>
                  </div>
                </div>
                <div className="flex gap-x-3 pr-6">
                  <NumberInput
                    id="coolDownDelayMinutes"
                    name="coolDownDelayMinutes"
                    type="text"
                    disabled={formState.repeatNotif !== "cooldown"}
                    value={formState.coolDownDelayMinutes}
                    onChange={handleFormChange}
                    className={classNames(formState.repeatNotif === "cooldown" ? "text-gray-900 focus:ring-2 focus:ring-inset focus:ring-sky-600 bg-white"
                      : "bg-gray-50 text-gray-600 pointer-events-none",
                      "block w-24 text-right rounded-md border-0 py-1.5 pl-8 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    )} />
                  <p className="mt-2 text-sm text-gray-600">minutes</p>
                </div>
              </label>
              <label className="flex justify-start items-center w-full rounded-md pl-2 py-1.5 hover:cursor-pointer hover:bg-gray-50">
                <input
                  checked={formState.repeatNotif === "hysteresis"}
                  name="repeatNotif"
                  value="hysteresis"
                  type="radio"
                  onChange={handleFormChange}
                  className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600" />
                <div className="ml-3 text-sm leading-6">
                  <p className="font-medium text-gray-700">
                    With hysteresis
                  </p>
                  <p className="text-gray-500 text-pretty">
                    Only send notifications when the gap has reached the same threshold again after lowering to the previous threshold.
                  </p>
                </div>
              </label>
            </div>
          </fieldset>
        </div>

      </div>
    </div>
  );
}
