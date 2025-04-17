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
    case 2: case -2:
      color = colors.crit
      break;
    case 1: case -1:
      color = colors.acctble
      break;
    default:
      color = colors.default
      break;
  }
  return color
}

// output = -2 | -1 | 0 | 1 | 2
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

  if (disc === null) return null;
  if (discrAlertConf?.critHigh && disc > discrAlertConf.critHigh) return 2;
  if (discrAlertConf?.critLow && disc < discrAlertConf.critLow) return -2;
  if (discrAlertConf?.acctbleHigh && disc > discrAlertConf.acctbleHigh) return 1;
  if (discrAlertConf?.acctbleLow && disc < discrAlertConf.acctbleLow) return -1;
  return 0;

}