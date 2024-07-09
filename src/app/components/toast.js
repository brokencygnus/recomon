import { useState, useEffect, createContext, useContext } from "react"
import { XMarkIcon } from '@heroicons/react/20/solid'
import { config } from "../constants/config";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const ToastContext = createContext({});

export function ToastProvider({ children }) {
  const [toastArray, setToastArray] = useState([])

  const addToast = (toastToAdd) => {
    const newToast = { id: Date.now(), visible:false, ...toastToAdd }
    setToastArray((prevToasts) => [...prevToasts, newToast]);
  };

  const hideToast = (toastID) => {
    setToastArray(toasts =>
      toasts.map(toast => (toast.id == toastID ? { ...toast, visible: false } : toast))
    );
  }

  const deleteToast = (toastID) => {
    setToastArray((currentToasts) => 
      currentToasts.filter(t => t.id !== toastID)
    )
  }

  useEffect(() => {
    if (toastArray.some(toast => !toast.visible && !toast.timeoutIds)) {
      // Set toasts to disappear after 10s and delete after 11s
      const timers = toastArray.map((toast) => {
        // Update visible: false to visible: true immediately after toast is mounted
        // Can't start with visible: true as it skips any transition
        if (!toast.visible && !toast.timeoutIds) {
          toast.visible = true
        }

        // Create timers
        if (!toast.timeoutIds) {
          toast.timeoutIds = [];
      
          // Create a timer to set toast.visible to false after 10 seconds
          const visibilityTimeoutId = setTimeout(() => {
            hideToast(toast.id);
          }, config.toastTimeout);
      
          // Create a timer to delete the toast after 11 seconds
          const deleteTimeoutId = setTimeout(() => {
            deleteToast(toast.id);
          }, config.toastTimeout + 300);
      
          // Store both timeout IDs in the array
          toast.timeoutIds.push(visibilityTimeoutId, deleteTimeoutId);
        }
        return toast;
      });
      
      // Update the toastArray with the new timers
      setToastArray(timers);
    }
  }, [toastArray])

  return (
    <ToastContext.Provider value={{ toastArray, addToast, deleteToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const toastColors = [
  {name: "green", text: "text-green-400", base: "bg-green-500", progress: "bg-green-600"},
  {name: "red", text: "text-red-400", base: "bg-red-500", progress: "bg-red-600"},
  {name: "amber", text: "text-amber-400", base: "bg-amber-500", progress: "bg-amber-600"},
  {name: "sky", text: "text-sky-400", base: "bg-sky-500", progress: "bg-sky-600"},
  {name: "gray", text: "text-gray-400", base: "bg-gray-400", progress: "bg-gray-500"},
]

export function ToastGroup() {
  const { toastArray, deleteToast } = useContext(ToastContext)

  const toastColor = (colorName) => {
    const color = toastColors.find(color => color.name == colorName)
    return color
  }

  return (
    <div className="pointer-events-none z-[40] fixed inset-x-0 bottom-0 pb-5 pl-20 overflow-hidden">
      <div className="flex flex-col items-center gap-y-3 px-20">
        {toastArray?.map(toast => (
          // New toast (text on white background with colored progress bar)
          // <div 
          //   key={toast.id}
          //   className={classNames(
          //     "relative min-w-[20rem] pointer-events-auto overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5",
          //     "transition-all ease-in-out",
          //     toast.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0", 'duration-300',
          //   )}
          // >
          //   <div className="p-4">
          //     <div className="flex items-center">
          //       <div className="flex w-0 flex-1 justify-between">
          //         <p className="w-0 flex-1 text-sm font-medium text-gray-900">{toast.message}</p>
          //       </div>
          //       <div className="ml-4 flex flex-shrink-0">
          //         <button
          //           type="button"
          //           className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          //           onClick={() => deleteToast(toast.id)}
          //         >
          //           <span className="sr-only">Close</span>
          //           <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          //         </button>
          //       </div>
          //     </div>
          //   </div>
          //   <div className={classNames(
          //     "absolute inset-x-0 bottom-0 h-1 w-full", toastColor(toast.color).progress,
          //     "transition-all ease-linear",
          //     toast.visible ? `translate-x-0 duration-[10000ms]` : "-translate-x-full",
          //   )}/>
          // </div>

          // Old toast (white text on colored background)
          <div
            key={toast.id}
            className={classNames(
              toastColor(toast.color).base,
              "relative min-w-[20rem] pointer-events-auto rounded-xl shadow-lg overflow-hidden",
              "transition-all ease-in-out",
              toast.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0", "duration-300"
            )}
          >
            <div className={classNames(
                "absolute w-full h-full", toastColor(toast.color).progress,
                "transition-all ease-linear",
                toast.visible ? "translate-x-0" : "-translate-x-full", config.toastTimeoutClass,
              )}
            >
            </div>
            <div className="flex items-center justify-between py-1 px-4">
              <p className="z-[45] font-semibold leading-6 text-sm text-white">
                {toast.message}
              </p>
              <button
                onClick={() => deleteToast(toast.id)}
                type="button"
                className="z-[45] -m-1.5 flex-none p-1.5 pl-3"
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
