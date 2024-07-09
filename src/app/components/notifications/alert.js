import { useState, useEffect, createContext, useContext } from "react"
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { config } from "@/app/constants/config";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const AlertContext = createContext({});

export function AlertProvider({ children }) {
  const [alertArray, setAlertArray] = useState([])

  // Format:
  // {
  //   icon: "exclamation",
  //   color: "green",
  //   header: "Silksong released!",
  //   body: "Team Cherry just released Silksong after 84 years."
  // }
  const addAlert = (alertToAdd) => {
    const newAlert = { id: Date.now(), visible:false, ...alertToAdd }
    setAlertArray((prevAlerts) => [...prevAlerts, newAlert]);
  };

  const hideAlert = (alertID) => {
    setAlertArray(alerts =>
      alerts.map(alert => (alert.id == alertID ? { ...alert, visible: false } : alert))
    );
  }

  const deleteAlert = (alertID) => {
    setAlertArray((currentAlerts) => 
      currentAlerts.filter(t => t.id !== alertID)
    )
  }

  useEffect(() => {
    if (alertArray.some(alert => !alert.visible && !alert.timeoutIds)) {
      // Set alerts to disappear after 10s and delete after 11s
      const timers = alertArray.map((alert) => {
        // Update visible: false to visible: true immediately after alert is mounted
        // Can't start with visible: true as it skips any transition
        if (!alert.visible && !alert.timeoutIds) {
          alert.visible = true
        }

        // Create timers
        if (!alert.timeoutIds) {
          alert.timeoutIds = [];
      
          // Create a timer to set alert.visible to false after 10 seconds
          const visibilityTimeoutId = setTimeout(() => {
            hideAlert(alert.id);
          }, config.alertTimeout);
      
          // Create a timer to delete the alert after 11 seconds
          const deleteTimeoutId = setTimeout(() => {
            deleteAlert(alert.id);
          }, config.alertTimeout + 300);
      
          // Store both timeout IDs in the array
          alert.timeoutIds.push(visibilityTimeoutId, deleteTimeoutId);
        }
        return alert;
      });
      
      // Update the alertArray with the new timers
      setAlertArray(timers);
    }
  }, [alertArray])

  return (
    <AlertContext.Provider value={{ alertArray, addAlert, deleteAlert }}>
      {children}
    </AlertContext.Provider>
  )
}

export const alertIcons = [
  {name: "exclamationTriangle", value: ExclamationTriangleIcon},
  {name: "exclamationCircle", value: ExclamationCircleIcon},
  {name: "check", value: CheckCircleIcon},
  {name: "info", value: InformationCircleIcon}
]

export const alertColors = [
  {name: "green", text: "text-green-400", textLight: "text-green-300", progress: "bg-green-400"},
  {name: "red", text: "text-red-400", textLight: "text-red-300", progress: "bg-red-400"},
  {name: "amber", text: "text-amber-400", textLight: "text-amber-300", progress: "bg-amber-400"},
  {name: "sky", text: "text-sky-400", textLight: "text-sky-300", progress: "bg-sky-400"},
  {name: "gray", text: "text-gray-400", textLight: "text-gray-300", progress: "bg-gray-400"},
]

export function AlertGroup() {
  const { alertArray, deleteAlert } = useContext(AlertContext)

  const alertColor = (colorName) => {
    const color = alertColors.find(color => color.name == colorName)
    return color
  }

  const alertIcon = (iconName) => {
    const icon = alertIcons.find(icon => icon.name == iconName)
    return icon.value 
  }

  const DynamicIcon = ({ icon, color, props }) => {
    const IconComponent = alertIcon(icon)
    if (!IconComponent) return null
    return <IconComponent className={`h-6 w-6 ${alertColor(color).text}`} {...props}/>
  }

  return (
    <>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-40 flex px-8 py-6 pt-[5.5rem] items-start"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {alertArray?.map(alert => (
            <div 
              key={alert.id}
              className={classNames(
                "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5",
                "transition-all ease-in-out",
                alert.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0", "duration-300",
                alert.visible ? "sm:translate-x-2 sm:translate-y-0" : ""
              )}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <DynamicIcon icon={alert.icon} color={alert.color} aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">{alert.header}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {alert.body + " "}
                      <a href={alert?.href ?? '#'} className="text-sky-500">
                        {alert?.link}
                      </a>
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className={classNames(
                  "absolute inset-x-0 bottom-0 h-1 w-full", alertColor(alert.color).progress,
                  "transition-all ease-linear",
                  alert.visible ? "translate-x-0" : "-translate-x-full", config.alertTimeoutClass
                )}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
