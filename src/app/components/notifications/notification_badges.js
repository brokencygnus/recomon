import {
  Square3Stack3DIcon,
  BanknotesIcon,
  CodeBracketSquareIcon,
  CubeTransparentIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/16/solid";
import { PopoverComp } from "@/app/components/popover";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const badgeTypes = {
  "gap_unacceptable_entireBU": {
    icon: Square3Stack3DIcon,
    color: "text-amber-500",
    snapshotMsg: "This business unit as a whole has surpassed the acceptable gap threshold.",
    currencyMsg: null,
    accountMsg: null,
    apiMsg: null
  },
  "gap_critical_entireBU": {
    icon: Square3Stack3DIcon,
    color: "text-red-400",
    snapshotMsg: "This business unit as a whole has reached the critical gap threshold.",
    currencyMsg: null,
    accountMsg: null,
    apiMsg: null
  },
  "gap_unacceptable_currency": {
    icon: BanknotesIcon,
    color: "text-amber-500",
    snapshotMsg: "One or more currencies has surpassed the acceptable gap threshold.",
    currencyMsg: "This currency has surpassed the acceptable gap threshold.",
    accountMsg: null,
    apiMsg: null
  },
  "gap_critical_currency": {
    icon: BanknotesIcon,
    color: "text-red-400",
    snapshotMsg: "One or more currencies has reached the critical gap threshold.",
    currencyMsg: "This currency has surpassed the critical gap threshold.",
    accountMsg: null,
    apiMsg: null
  },
  "api_config_error": {
    icon: CodeBracketSquareIcon,
    color: "text-red-400",
    snapshotMsg: "An API did not provide data for one or more accounts.",
    currencyMsg: "An API did not provide data for one or more accounts.",
    accountMsg: "The API did not provide data to this account.",
    apiMsg: "This API does not provide data for all its accounts."
  },
  "api_request_failed": {
    icon: CodeBracketSquareIcon,
    color: "text-amber-500",
    snapshotMsg: "A retrieval attempt to one of your APIs has recently failed.",
    currencyMsg: "A retrieval attempt to one of your APIs has recently failed.",
    accountMsg: "A recent attempt to retrieve this account's balances from the API has failed",
    apiMsg: "A retrieval attempt to this API has recently failed."
  },
  "blockchain_connection_failed": {
    icon: CubeTransparentIcon,
    color: "text-amber-500",
    snapshotMsg: "A retrieval attempt to the blockchain network has recently failed.",
    currencyMsg: "A retrieval attempt to the blockchain network has recently failed.",
    accountMsg: "A recent attempt to retrieve this account's balances from the blockchain has failed",
    apiMsg: null
  },
  "too_long_since_last_update": {
    icon: ClockIcon,
    color: "text-gray-300",
    snapshotMsg: "One or more accounts has not been manually updated for a while.",
    currencyMsg: "One or more accounts has not been manually updated for a while.",
    accountMsg: "This account has not been manually updated for a while.",
    apiMsg: null
  },
}

// input: alerts: ["gap_critical_entireBU", "gap_unacceptable_currency", ...]
// output:
// <>
//   <icon/>
//   <icon/>
//   ...
// </>
// size: sm, md, lg
export function NotificationBadges({ size, alerts, message }) {
  const sortedAlerts = alerts.sort()
  
  const badgeSize = () => {
    switch (size) {
      case "sm": return "h-4 w-4";
      case "md": return "h-5 w-5";
      case "lg": return "h-7 w-7";
      default: return "h-3 w-3";
    }
  }

  function alertComp(alert) {
    const badgeType = badgeTypes[alert]
    const BadgeIcon = badgeType.icon
    const badgeColor = badgeType.color
    var badgeMsg = ""
    switch (message) {
      case "currency":
        badgeMsg = badgeType.currencyMsg
        break;
      case "account":
        badgeMsg = badgeType.accountMsg
        break;
      case "api":
        badgeMsg = badgeType.apiMsg
        break;
      default:
        badgeMsg = badgeType.snapshotMsg
        break;
    }

    return (
      <PopoverComp position="bottom">
        <div>
          <BadgeIcon className={classNames(badgeColor, badgeSize(), "flex-shrink-0")} />
        </div>
        <p className="leading-6 text-sm font-normal text-gray-900">{badgeMsg}</p>
      </PopoverComp>
    )
  }

  return (
    <>
      {sortedAlerts?.map(alert => (
        alertComp(alert)
      ))}
    </>
  )
}