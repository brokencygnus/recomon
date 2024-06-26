import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { HighlightSearch, SearchFilter } from '@/app/utils/highlight_search';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ComboBox({ name, labelText, options, nullOption, selectedOption, onSelect, className }) {
  const [searchTerm, setSearchTerm] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)

  const handleSearchChange = (event) => {
    const { value } = event.target
    const searchArray = value.split(" ")
    setSearchTerm(searchArray)
  }

  const allOptions = [...options, nullOption]

  const filteredOptions =
    query === ''
      ? allOptions
      : allOptions.filter(option => SearchFilter(option, searchTerm))
        
  const handleOptionSelect = (option) => {
    setSearchTerm([])
    setSelectedOption(person)

    const syntheticEvent = {
      target: {
        name,
        value: option
      }
    };
    onSelect(syntheticEvent);
  }

  return (
    <Combobox
      name={name}
      as="div"
      value={selectedOption}
      onChange={(option) => handleOptionSelect(option)}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">{labelText}</Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={handleSearchChange}
          onBlur={handleSearchChange}
          displayValue={(option) => option?.name}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        {filteredOptions.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <ComboboxOption
                key={option.id}
                value={option}
                className={({ focus }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    focus ? 'bg-indigo-600 text-white' : 'text-gray-900',
                  )
                }
              >
                {({ focus, selected }) => (
                  <>
                    <span className={classNames('block truncate', selected && 'font-semibold')}>{option.name}</span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          focus ? 'text-white' : 'text-indigo-600',
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  )
}
