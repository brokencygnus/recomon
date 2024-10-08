import { useState, useEffect, createContext, useContext } from 'react';
import { CurrencyIcon } from '@/app/components/currency_icon';
import { SearchFilter, HighlightSearch } from '@/app/utils/highlight_search';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { checkDataEdited } from '@/app/utils/utils';
import { ToastContext } from '@/app/components/toast';
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/app/components/dialog';
import { joinWithAnd } from '@/app/utils/activity-log/activity'

// mock data start

import { currencies } from '@/app/constants/mockdata/currency_mockdata'
import { businessUnits } from '@/app/constants/mockdata/mockdata';

// mock data end

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ModalContext = createContext(null);

export default function Currencies() {
  const [formData, setFormData] = useState(currencies)
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies)
  const [searchTerm, setSearchTerm] = useState([]);
  const [isDataEdited, setIsDataEdited] = useState(false);

  const handleSearchChange = (event) => {
    const { value } = event.target
    const searchArray = value !== "" ? value.split(" ") : []
    setSearchTerm(searchArray)
  }

  const handleResetFilters = () => {
    setSearchTerm([])
  }

  const enabledCurrencies = formData.filter(currency => currency.enabled === true)

  // validation modal
  const [isOpen, setIsOpen] = useState(false)
  const [currencyName, setCurrencyName] = useState(null)
  const [buUsingCurrency, setBuUsingCurrency] = useState(null)

  const checkBuCurrency = (symbol) => {
    const currentCurrencyData = currencies.find(currency => currency.symbol === symbol)
    const buUsingCurrency = currentCurrencyData.buUsingCurrency
    setCurrencyName(currentCurrencyData.name + ` (${symbol})`)
    if (!buUsingCurrency || !buUsingCurrency.length) {
      setBuUsingCurrency([])
      return false
    } else {
      setBuUsingCurrency(buUsingCurrency.map(bu => {
        const data = businessUnits.find(buData => buData.id === bu)
        return data.name
      }))
      // read it and weep TypeScript users
      return buUsingCurrency
    }
  }

  const toggleCurrency = (symbol) => {
    if (checkBuCurrency(symbol)) {
      // launch modal
      setIsOpen(true)
    } else {
      let tempFormData = (formData.map(currency => {
        if (currency.symbol === symbol) {
          return {...currency, enabled: !currency.enabled};
        }
        return currency
      }))
      checkDataEdited(currencies, tempFormData, setIsDataEdited);
      setFormData(tempFormData)
    }
  }
  useEffect(() => {
    let tempFilteredCurrencies = formData.map(currency => {
      let buttonDisabled = false
      if (!SearchFilter(currency.symbol, searchTerm) && !SearchFilter(currency.name, searchTerm)) {
        buttonDisabled = true
      }
      return {buttonDisabled, ...currency}
    })
    setFilteredCurrencies(tempFilteredCurrencies)
  }, [formData, searchTerm])

  const handleSave = () => {
    // Do API things
    launchToast();
  };

  const handleCancel = () => {
    setFormData(currencies);
    setIsDataEdited(false)
  };

  const { addToast } = useContext(ToastContext);

  const launchToast = () => {
    addToast({ color: "green", message: "Currency configuration saved!" });
  };

  // HighlightSearch(log.buCode, searchTerm, {highlight: "bg-sky-300"})} {HighlightSearch(log.buName, searchTerm, {highlight: "bg-sky-300"})
  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen, currencyName, buUsingCurrency }}>
      <div className="flex flex-col space-y-14">
        <div className="mb-6">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-y-2 text-sm text-gray-600">
              <p>Configure which supported currencies you want to use in your business units.</p>
              <p>Don't see the currency you need?&#20;
              <a href='#' className="font-semibold text-sky-600 hover:text-sky-900">Submit a currency request</a>
              </p>
            </div>
            <div className="flex h-9 justify-end gap-x-4">
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
          </div>
          <div className="flex flex-col my-6 pt-6 border-t border-gray-300">
            <div className="flex justify-between items-center"> 
              <h1 className="text-base font-semibold leading-6 text-gray-900">Enabled currencies</h1>
              <div className="flex rounded-md w-fit h-9 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6">
                  <input
                    id="search-currencies"
                    className="border-0 py-0 px-0 mx-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search currencies"
                    value={searchTerm.join(" ")}
                    onChange={handleSearchChange}
                    type="text"
                    name="search"
                  />
                  { searchTerm.length !== 0 ?
                    <button
                      type="button"
                      className="mx-2 text-sm text-sky-600"
                      onClick={handleResetFilters}
                    >
                      <XMarkIcon
                        className="w-5 text-gray-400 hover:text-gray-500"
                      />
                    </button>
                  :
                    <MagnifyingGlassIcon
                      className="pointer-events-none w-5 mx-2 text-gray-400"
                      aria-hidden="true"
                    />
                  }
                </div>
              </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {enabledCurrencies.map(currency => 
                <CurrencyCard currency={currency} searchTerm={searchTerm} toggleCallback={toggleCurrency}/>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Available currencies</h1>
            <div className="mt-6">
              <p className="text-sm font-semibold leading-6 text-gray-900">Cryptocurrency</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {filteredCurrencies.filter(currency => currency.is_blockchain)
                  .map(currency => 
                  <CurrencyCard currency={currency} searchTerm={searchTerm} toggleCallback={toggleCurrency}/>
                )}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold leading-6 text-gray-900">Fiat currencies</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {filteredCurrencies.filter(currency => !currency.is_blockchain)
                  .map(currency => 
                  <CurrencyCard currency={currency} searchTerm={searchTerm} toggleCallback={toggleCurrency}/>
                )}
              </div>
            </div>
            {/* {JSON.stringify(formData)} */}
          </div>
        </div>
        <InvalidCurrencyDialog/>
      </div>
    </ModalContext.Provider>
  );
}

function CurrencyCard({ currency, searchTerm, toggleCallback }) {
  return (
    <button
      key={currency.symbol}
      type="button"
      value={currency.symbol}
      disabled={currency?.buttonDisabled}
      onClick={() => toggleCallback(currency.symbol)}
      className={classNames(
        currency.buttonDisabled && "disabled:bg-gray-100", // disabled:cursor-not-allowed disabled:text-gray-600 disabled:ring-gray-200
        "ring-inset", currency.enabled ? "ring-1 ring-sky-700 text-sky-700" : "ring-1 ring-gray-300 text-gray-700",
        "rounded-lg bg-white px-2.5 py-2 text-sm font-medium shadow-sm hover:bg-gray-50",
        "flex gap-x-2 items-center"
      )}
        >
          <CurrencyIcon symbol={currency.symbol} size='xs'/>
      <p>
        {HighlightSearch(currency.name, searchTerm, {highlight: "bg-sky-300"})}
        &#20;({HighlightSearch(currency.symbol, searchTerm, {highlight: "bg-sky-300"})})
      </p>
      {currency.enabled && <XMarkIcon
        className="w-5 text-gray-400 hover:text-gray-500"
      />}
    </button>
  )
}


function InvalidCurrencyDialog() {
  const { isOpen, setIsOpen, currencyName, buUsingCurrency } = useContext(ModalContext)

  const buNames = buUsingCurrency && (buUsingCurrency.length === 1 ? "the business unit " : "the following business units: ")
    + joinWithAnd(buUsingCurrency).join("")

  const setClose = () => setIsOpen(false)

  return (
    <Dialog size="xl" open={isOpen} onClose={setClose}>
      <DialogTitle>Currency in use</DialogTitle>
      <DialogDescription className="font-normal text-gray-900">
        {currencyName} is currently being used by one or more accounts in {buNames}. Delete the accounts or re-assign them to another currency before proceeding.
      </DialogDescription>
      <DialogActions>
        <button
          onClick={setClose}
          className="bg-sky-600 hover:bg-sky-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 rounded-md px-3 py-2 text-sm font-semibold shadow-sm">
          OK
        </button>
      </DialogActions>
    </Dialog>
  )
}