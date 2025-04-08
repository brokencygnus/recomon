import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { IconChevronDown, IconHome } from "@tabler/icons-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// options: [{name: a, value: aaa}, {name: b, value: bbb}, ...]
// size: sm | md | lg | xl
// nullOption: { noSelectionLabel: Aaa aa, name: Aaa, value: aaa }
export function Dropdown({ name, labelText, options, nullOption=null, selectedOption, selectedIcon, onSelect, ...props }) {
  var allOptions = options

  if (!options) {
    allOptions = []
  }

  if (nullOption) {
    allOptions = [ ...options, nullOption]
  } 

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
    <Menu name={name} as="div" className="relative text-left">
      {labelText ?
        <p className="mb-1 block text-sm font-medium text-zinc-800">
          {labelText}
        </p>
      : null }
      <MenuButton {...props}>
        <div className="place-content-between flex grid-row-1 gap-x-1.5 px-3 py-2">
          <div className="flex gap-x-2 justify-start overflow-hidden">
            {selectedIcon}
            <p className={selectedOption == nullOption?.name ?
              "truncate text-sm font-normal text-zinc-600" : "truncate text-sm font-normal text-zinc-800" }
            >
              {selectedOption == nullOption?.name ? nullOption?.noSelectionLabel : selectedOption}
            </p>
          </div>
          <IconChevronDown className="shrink-0 h-5 w-5 text-zinc-400" aria-hidden="true" />
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
        <MenuItems className="absolute right-0 min-w-full w-auto z-40 mt-2 py-1 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {allOptions.map((option) => (
              <MenuItem key={option.value}>
                {({ focus }) => (
                  <div
                    onClick={() => handleOptionSelect(option)}
                    className={classNames(focus && 'bg-zinc-50', 'flex items-center px-4 py-2 gap-x-2 text-sm hover:cursor-pointer')}
                  >
                    {option.icon}
                    <div className="flex items-baseline">
                      {option.code &&
                        <p className={classNames("whitespace-nowrap", focus ? 'text-zinc-700' : 'text-zinc-500', "text-xs font-semibold pr-3")}>{option.code}</p>
                      }
                      <p className={classNames("whitespace-nowrap", focus ? 'text-zinc-800' : 'text-zinc-600')}>{option.name}</p>
                    </div>
                  </div>
                )}
              </MenuItem>
            ))}
        </MenuItems>
      </Transition>
    </Menu>
  )
}
