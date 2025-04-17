
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Parent component needs to bound width

export function SeeMore({ children }) {
  const ref = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const checkTruncation = () => {
    setExpanded(false)
    if (!ref.current) return;

    const { offsetHeight, scrollHeight } = ref.current;

    if (offsetHeight < scrollHeight) {
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }
  };

  useLayoutEffect(() => {
    checkTruncation();
  }, [ref, children]);

  useEffect(() => {
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, []);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  
  return (
    <>
      {!expanded && (
        <>
          <span ref={ref} className={classNames("break-all text-wrap line-clamp-1", isTruncated && "max-w-[calc(100%-80px)]")}>{children}</span>
          {isTruncated && (
          <button
            className="line-clamp-1 font-medium text-sky-600 hover:text-sky-900 ml-2 focus:outline-none"
            onClick={toggleExpand}
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
          <span className="text-wrap break-all">{children}
            <span>
            <button
              className="font-sans font-medium text-sky-600 hover:text-sky-900 hover:cursor-pointer ml-2 focus:outline-none"
              onClick={toggleExpand}
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