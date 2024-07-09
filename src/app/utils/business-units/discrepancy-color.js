import { convertCurrency } from '@/app/utils/utils'

// const colors = {
//   crit: "text-red-500",
//   acctble: "text-amber-500"
//   default: "text-gray-500"
// }
//
// symbol: currency symbol
export const discrepancyColor = ({ discrepancy, discrAlertConf, capital, symbol, colors }) => {
  let color = ""
  
  switch (getDiscrLvl({ discrepancy, discrAlertConf, capital, symbol })) {
    case "critical":
      color = colors.crit
      break;
    case "unacceptable":
      color = colors.acctble
      break;
    default:
      color = colors.default
      break;
  }
  return color
}

// output = "normal" | "unacceptable" | "critical"
export const getDiscrLvl = ({ discrepancy, discrAlertConf, capital, symbol='USD' }) => {
  let disc = parseFloat(discrepancy)

  switch (discrAlertConf.basis) {
    case "usd":
      // convert to USD
      disc = convertCurrency(disc, symbol, 'USD')
      break;
    case "currency":
      // do nothing
      break
    case "percent":
      // convert disc to a percentage of capital
      disc = disc / capital * 100
    default:
      disc = convertCurrency(disc, symbol, 'USD')
      break;
  }

  if (!disc) {
    return "normal"
  } else if (
      (discrAlertConf?.critHigh && disc > discrAlertConf.critHigh)
      || (discrAlertConf?.critLow && disc < discrAlertConf.critLow)
    ) {
    return "critical"
  } else if (
      (discrAlertConf?.acctbleHigh && disc > discrAlertConf.acctbleHigh)
      || (discrAlertConf?.acctbleLow && disc < discrAlertConf.acctbleLow)
    ) {
    return "unacceptable"
  } else {
    return "normal"
  }

}