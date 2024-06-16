
import { useState } from "react";
import { Transition } from "@headlessui/react";

export function SeeMore({ threshold, content }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  return (
    <>
      {/* See More is displayed after 46 characters, since the content
        is displayed in monospace. This is a stop gap solution. Finding
        out when the content begins to truncate is necessary for a
        permanent solution. */}
      {expanded ? null : (
        <>
          <span className="font-mono truncate overflow-hidden">{content}</span>
          {content.length > threshold && (
          <button
            className="font-medium text-indigo-600 hover:text-indigo-900 ml-2 focus:outline-none"
            onClick={() => toggleExpand()}
          >
            See more
          </button>
          )}
        </>
      )}
      <Transition
      show={expanded}
      enter="transition ease-out duration-200"
      enterFrom="transform opacity-0 -translate-y-2"
      enterTo="transform opacity-100 translate-y-0"
      leave="transition duration-0"
      leaveFrom="hidden"
      leaveTo="hidden"
      >
        <div className="flex justify-between items-center max-w-80">
          <span className="font-mono text-wrap break-all">{content}
            <span>
            <button
              className="font-sans font-medium text-indigo-600 hover:text-indigo-900 hover:cursor-pointer ml-2 focus:outline-none"
              onClick={() => toggleExpand()}
            >
              See less
            </button>
            </span>
          </span>
        </div>
      </Transition>
    </>
  )
}