// const colors = {
//   crit: "text-red-500",
//   acctble: "text-amber-500"
//   default: "text-gray-500"
// }
export const discrepancyColor = (discrepancyUSD, discrAlertConf, colors) => {
  let color = ""
  let discrepancy = parseFloat(discrepancyUSD)

  if (!discrepancy) {
    color = colors.default
  } else if (
      (discrAlertConf?.critHigh && discrepancy > discrAlertConf.critHigh)
      || (discrAlertConf?.critLow && discrepancy < discrAlertConf.critLow)
    ) {
    color = colors.crit
  } else if (
      (discrAlertConf?.acctbleHigh && discrepancy > discrAlertConf.acctbleHigh)
      || (discrAlertConf?.acctbleLow && discrepancy < discrAlertConf.acctbleLow)
    ) {
    color = colors.acctble
  } else {color = colors.default}

  return color
}