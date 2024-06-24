import React, { useState, useEffect, useContext } from "react"
import { XMarkIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Config
const toastTimeout = 10000

export const ToastContext = React.createContext({});

export function ToastProvider({ children }) {
  const [toastArray, setToastArray] = useState([])

  const addToast = (toastToAdd) => {
    const newToast = { id: Date.now(), visible:false, ...toastToAdd }
    setToastArray((prevToasts) => [...prevToasts, newToast]);
  };

  const deleteToast = (toastID) => {
    setToastArray((currentToasts) => 
      currentToasts.filter(t => t.id !== toastID)
    )
  }

  useEffect(() => {
    // Update visible: false to visible: true immediately after toast is mounted
    // Can't start with visible: true as it skips any transition
    if (toastArray.some(toast => !toast.visible)) {
      setToastArray(toasts =>
        toasts.map(toast => (toast.visible ? toast : { ...toast, visible: true }))
      );
    }
  }, [toastArray])

  useEffect(() => {
    if (toastArray.some(toast => !toast.timeoutId)) {
      // Set toasts to disappear after toastSeconds
      const timers = toastArray.map((toast) => {
        if (!toast.timeoutId) {
          // Create a new timer for each toast that doesn't have a timeoutId
          const timeoutId = setTimeout(() => {
            // Remove the current toast
            deleteToast(toast.id)
          }, toastTimeout)

          // Return an updated toast with the timeoutId
          return { ...toast, timeoutId };
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

export function ToastGroup() {
  const { toastArray, deleteToast } = useContext(ToastContext)

  const colorBase = (colorName) => {
    switch (colorName) {
      case "green": return "bg-green-600";
      case "red": return "bg-rose-600";
      case "gray": return "bg-gray-400";
    }
  }

  const colorProgress = (colorName) => {
    switch (colorName) {
      case "green": return "bg-green-700";
      case "red": return "bg-rose-700";
      case "gray": return "bg-gray-500/50";
    }
  }

  return (
    <div className="pointer-events-none z-[40] fixed inset-x-0 bottom-0 pb-5 pl-20 overflow-hidden">
      <div className="flex flex-col items-center gap-y-3 px-20">
        {toastArray?.map((toast, index) => (
          <div
            key={toast.id}
            className={classNames(
              colorBase(toast.color),
              "relative min-w-[20rem] pointer-events-auto rounded-xl overflow-hidden",
              "transition-all ease-in-out", toast.visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0", 'duration-200'
            )}
          >
            <div className={classNames(
              "absolute w-full h-full", colorProgress(toast.color),
              "transition-all ease-linear", toast.visible ? `translate-x-0 duration-[${toastTimeout}ms]` : "-translate-x-full",
              )}>
            </div>
            <div className="flex items-center justify-between py-2 px-4">
              <p className="z-[45] font-semibold leading-6 text-white">
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
