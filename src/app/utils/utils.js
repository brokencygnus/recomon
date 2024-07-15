import { currencies } from '../constants/mockdata/mockdata';
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

export const convertCurrency = ( amount, currency1, currency2 ) => {
  const convertUSD1 = currencies.find((currency) => currency.symbol == currency1)?.convertUSD
  const convertUSD2 = currencies.find((currency) => currency.symbol == currency2)?.convertUSD

  const result = "" + (amount * convertUSD1 / convertUSD2).toFixed(2)
  return result
}