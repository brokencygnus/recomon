import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { Children } from 'react';

// Bottom-only for now
export function PopoverComp({ children }) {
  const childrenArray = Children.toArray(children);

  return (
    <Popover>
      <PopoverButton className="focus:outline-none focus:ring-0">
        {childrenArray[0]}
      </PopoverButton>
      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-0"
        enterTo="opacity-100 translate-y-1"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-1"
        leaveTo="opacity-0 translate-y-0"
      >
        <PopoverPanel
          anchor="bottom"
          className="rounded-md bg-white px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 [--anchor-gap:var(--spacing-5)]"
        >
          {childrenArray[1]}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
