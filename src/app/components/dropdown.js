'use client'
import { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// options: [{name: a, value: aaa}, {name: b, value: bbb}, ...]
// size: small | medium | large
export function Dropdown({ label, options, selectedOption, onSelect, width }) {
  const dropdownWidth = (width) => {
    switch (width) {
      case "small": return "w-24";
      case "medium": return "w-40";
      case "large": return "w-56";
      default: return "w-40";
    }
  }

  return (
    <Menu as="div" className="relative inline-block w-full text-left">
      <label htmlFor="currency" className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <MenuButton className={classNames(
        dropdownWidth(width),
        "place-content-between flex grid-row-1 gap-x-1.5 rounded-md bg-white px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      )}>
        <p className="truncate text-sm font-semibold text-gray-900 ">{selectedOption}</p>
        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
      </MenuButton>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className={classNames(
          dropdownWidth(width),
          "absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        )}>
          <div className="py-1">
            {options.map((option) => (
              <MenuItem
              >
                {({ focus }) => (
                  <p
                    onClick={() => (onSelect(option))}
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
