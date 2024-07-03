import {
  Square3Stack3DIcon,
  BanknotesIcon,
  CodeBracketSquareIcon,
  CubeTransparentIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/16/solid";
import { PopoverComp } from "@/app/components/popover";
import SnapshotPage from "@/pages/snapshots";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const badgeTypes = {
  "gap_unacceptable_entireBU": {
    icon: Square3Stack3DIcon,
    color: "text-amber-500",
    snapshotMsg: "This business unit as a whole has surpassed the acceptable gap threshold."
  },
  "gap_critical_entireBU": {
    icon: Square3Stack3DIcon,
    color: "text-red-400",
    snapshotMsg: "This business unit as a whole has reached the critical gap threshold."
  },
  "gap_unacceptable_currency": {
    icon: BanknotesIcon,
    color: "text-amber-500",
    snapshotMsg: "Some currencies has surpassed the acceptable gap threshold."
  },
  "gap_critical_currency": {
    icon: BanknotesIcon,
    color: "text-red-400",
    snapshotMsg: "Some currencies has reached the critical gap threshold."
  },
  "api_config_error": {
    icon: CodeBracketSquareIcon,
    color: "text-red-400",
    snapshotMsg: "An API did not provide data for an account."
  },
  "api_request_failed": {
    icon: CodeBracketSquareIcon,
    color: "text-amber-500",
    snapshotMsg: "A retrieval attempt to one of your APIs has failed."
  },
  "blockchain_connection_failed": {
    icon: CubeTransparentIcon,
    color: "text-amber-500",
    snapshotMsg: "A retrieval attempt to the blockchain network has failed."
  },
  "too_long_since_last_update": {
    icon: ClockIcon,
    color: "text-gray-300",
    snapshotMsg: "An account has not been manually updated for a while."
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
export function NotificationBadges({ size, alerts }) {
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
    const badgeMsg = badgeType.snapshotMsg

    return (
      <PopoverComp position="bottom">
        <div>
          <BadgeIcon className={classNames(badgeColor, badgeSize(), "flex-shrink-0")} />
        </div>
        <p className="leading-6 text-sm text-gray-900">{badgeMsg}</p>
      </PopoverComp>
    )
  }

  return (
    <>
      {alerts?.map(alert => (
        alertComp(alert)
      ))}
    </>
  )
}