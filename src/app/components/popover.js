import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { Children, useRef } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const positions = {
  top: "-top-1/2",
  bottom: "-bottom-1/2"
};

const margins = {
  top: "-translate-y-2",
  bottom: "translate-y-2"
};

const childPositions = {
  top: "-translate-y-1/2",
  bottom: "translate-y-1/2"
}

const enterFrom = {
  top: "translate-y-2",
  bottom: "-translate-y-2"
}

export function PopoverComp({ children, position="top" }) {
  const childrenArray = Children.toArray(children);

  const triggerRef = useRef()
  // const timeOutRef = useRef()

  const handleEnter = (isOpen) => {
    // clearTimeout(timeOutRef.current)
    !isOpen && triggerRef.current?.click()
  }

  // Enabling timeout breaks snapshot page so we'd have to live without
  // const timeoutDuration = 150

  // const handleLeave = (isOpen) => {
  //   timeOutRef.current = setTimeout(() => {
  //     isOpen &&
  //       document.activeElement === triggerRef.current &&
  //       triggerRef.current?.click();
  //   }, timeoutDuration);
  // };

  const handleLeave = (isOpen) => {
    isOpen && triggerRef.current?.click()
  };

  return (
    <Popover className="relative leading-3">
      {({ open }) => (
        <div 
          onMouseLeave={() => handleLeave(open)}
        >
          <PopoverButton
            ref={triggerRef}
            className="focus:outline-none focus:ring-0"
            // This event is here to lessen flickering
            onMouseEnter={() => handleEnter(open)}
          >
            {childrenArray[0]}
          </PopoverButton>
          <Transition
            enter="transition ease-out duration-200"
            enterFrom={`opacity-0 ${enterFrom[position]}`}
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 -translate-y-0"
            leaveTo={`opacity-0 ${enterFrom[position]}`}
          >
            <PopoverPanel className={classNames(positions[position], "size-0 absolute left-1/2 top-1/2 flex items-center z-40")}>
              <div className={classNames(childPositions[position], "w-0 absolute -translate-x-1/2")}>
                <div className={classNames(margins[position],"w-max max-w-72 text-center rounded-md break-words bg-white px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 -translate-x-1/2")}>
                  {childrenArray[1]}
                </div>
              </div>
            </PopoverPanel>
          </Transition>
        </div>
      )}
    </Popover>
  );
}
