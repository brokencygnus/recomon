
import { useState, useLayoutEffect, useRef } from "react";
import { Transition } from "@headlessui/react";

// Parent component needs to bound width

export function SeeMore({ content }) {
  const ref = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    const { offsetHeight, scrollHeight } = ref.current || {};
    
    if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }
  }, [ref]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  
  return (
    <>
      {expanded ? null : (
        <>
          <span ref={ref} className="break-all text-wrap line-clamp-1">{content}</span>
          {isTruncated && (
          <button
            className="font-medium text-sky-600 hover:text-sky-900 ml-2 focus:outline-none"
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
        <div className="flex justify-between items-center">
          <span className="text-wrap break-all">{content}
            <span>
            <button
              className="font-sans font-medium text-sky-600 hover:text-sky-900 hover:cursor-pointer ml-2 focus:outline-none"
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