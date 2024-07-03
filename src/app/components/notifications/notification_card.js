import { alertColors, alertIcons } from '@/app/components/notifications/alert'
import { notificationTypes } from '@/app/constants/notifications'
import ClientOnly from '@/app/components/csr'
import { convertAgeMsToDateTime, convertMsToTimeAgo } from '@/app/utils/dates'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Format:
// {
//   ageMs: 1000,
//   type: "gap_critical_entireBU",
//   args: {buName: "Exchange", buSlug: "exchange"}
// },
//
// displayedIn = "page" | "popover"
export function NotificationCard({ data, displayedIn="page" }) {
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
    return <IconComponent className={classNames("h-6 w-6", data.read ? alertColor(color).text : alertColor(color).textLight)}
      {...props}/>
  }

  const notification = notificationTypes[data.type](data.args)

  // Sorry for the messy code, this is for notifications page and popover menu at the same time
  return (
    <div className={classNames(
      displayedIn == "page" ? "rounded-lg shadow-md": "",
      "w-full overflow-hidden bg-white ring-1 ring-black ring-opacity-5 hover:bg-gray-50"
    )}>
      <a href={notification?.href ?? '#'} >
        <div className="relative p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <DynamicIcon icon={notification.icon} color={notification.color} aria-hidden="true" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <div className="flex justify-between">
                <div className="flex gap-x-3">
                  <p className={classNames(!data.read ? "text-gray-900": "text-gray-500","text-sm font-medium")}>{notification.header}</p>
                  <ClientOnly>
                    <p className="text-sm text-gray-400">
                      {displayedIn == "page" ? convertAgeMsToDateTime(data.ageMs) : convertMsToTimeAgo(data.ageMs)}
                    </p>
                  </ClientOnly>
                </div>
                {displayedIn == "popover" && !data.read && (
                  <svg viewBox="0 0 2 2" className="h-2.5 w-2.5 rounded-full fill-red-500">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                )}
              </div>
              <p className={classNames(!data.read ? "text-gray-600" : "text-gray-500", "mt-1 text-sm")}>
                {notification.body + " "}
              </p>
            </div>
          </div>
          {displayedIn == "page" && (
            <div className={classNames(
              "absolute inset-x-0 bottom-0 h-0.5 w-full", !data.read ? alertColor(notification.color).progress : "bg-white"
            )}/>
          )}
          {displayedIn == "popover" && (
            <div className={classNames(
              "absolute inset-y-0 left-0 w-0.5 h-full", !data.read ? alertColor(notification.color).progress : "bg-white"
            )}/>
          )}
        </div>
      </a>
    </div>
  )
}