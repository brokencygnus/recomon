import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// options: [{name: a, value: aaa}, {name: b, value: bbb}, ...]
// size: sm | md | lg | xl
// nullOption: { name: Aaa, value: aaa, dropdownName: Aaa aa }
export function Dropdown({ name, labelText, options, nullOption, selectedOption, onSelect, className }) {
  const handleOptionSelect = (option) => {
    const syntheticEvent = {
      target: {
        name,
        value: option
      }
    };
    onSelect(syntheticEvent);
  }

  return (
    <Menu as="div" className="relative text-left">
      {labelText ?
        <p className="mb-1 block text-sm font-medium text-gray-900">
          {labelText}
        </p>
      : null }
      <MenuButton className={className}>
        <div className="place-content-between flex grid-row-1 gap-x-1.5 px-3 py-2">
          <p className={selectedOption == nullOption?.name ?
          "truncate text-sm font-normal text-gray-400" : "truncate text-sm font-medium text-gray-900" }
          >
            {selectedOption}</p>
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </MenuButton>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute w-full right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {nullOption ?
              <MenuItem
                name={name}
                key={nullOption?.value}>
                {({ focus }) => (
                  <p
                    onClick={() => handleOptionSelect(nullOption)}
                    className={classNames(
                      focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm hover:cursor-pointer'
                    )}
                  >
                    {nullOption?.dropdownName}
                  </p>
                )}
              </MenuItem>
              : null}
            {options.map((option) => (
              <MenuItem
                name={name}
                key={option.value}>
                {({ focus }) => (
                  <p
                    onClick={() => handleOptionSelect(option)}
                    className={classNames(
                      focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm hover:cursor-pointer'
                    )}
                  >
                    {option.name}
                  </p>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
