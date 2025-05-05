import { enabledCurrencies as currencies } from '@/app/utils/currencies'
import _ from 'lodash';


// Checks if FormState has been edited, i.e. different from initial state
export const checkDataEdited = ( initialState, currentState, setIsDataEdited ) => {
  if (_.isEqual(initialState, currentState)) {
    setIsDataEdited(false)
  } else {
    setIsDataEdited(true)
  }
}

// Format numbers with commas as decimal separator
export const formatNumber = ( numberString ) => {
  try {
    const parts = numberString.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
  } catch (error) {
    return ''
  }
};


// Format numbers with abbreviations, use only in rough approximations
export const formatApprox = (numberString) => {
  if ([null, undefined].includes(numberString)) return null

  const float = parseFloat(numberString)
  if (isNaN(float)) return null

  const abs = Math.abs(float)
  let abbr = ""
  let divisor = 1

  if (abs >= 1e18) {
    abbr = "Q"
    divisor = 1e18
  } else if (abs >= 1e15) {
    abbr = "q"
    divisor = 1e15
  } else if (abs >= 1e12) {
    abbr = "T"
    divisor = 1e12
  } else if (abs >= 1e9) {
    abbr = "B"
    divisor = 1e9
  } else if (abs >= 1e6) {
    abbr = "M"
    divisor = 1e6
  } else if (abs >= 1e3) {
    abbr = "k"
    divisor = 1e3
  }

  const shortened = float / divisor;

  return (abbr ? shortened.toFixed(2) + abbr : float.toFixed(2));
};

export const convertCurrency = ( amount, currency1, currency2 ) => {
  if (currency1 === currency2) return amount

  const convertUSD1 = currencies.find((currency) => currency.symbol == currency1)?.convertUSD
  const convertUSD2 = currencies.find((currency) => currency.symbol == currency2)?.convertUSD

  const result = "" + (amount * convertUSD1 / convertUSD2).toFixed(2)
  return result
}