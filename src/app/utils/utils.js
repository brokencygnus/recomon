import { currencies } from '../constants/mockdata';
import _ from 'lodash';

// temporary for non-fiat since I don't have the SVGs yet
export const SymbolDictionary = (symbol) => {
  switch (symbol) {
    case "BTC": return '₿';
    case "ETH": return 'ETH';
    case "USDT": return 'T';
    case "SOL": return 'S';
    case "IDR": return 'Rp';
    case "USD": return '$';
    default : return '$';
  }
}

// converts milliseconds to .. days .. hours .. minutes .. seconds 
export const convertMsToTime = (ms) => {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours = hours % 24;
  minutes = minutes % 60;
  seconds = seconds % 60;

  let timeString = '';

  if (days > 0) {
    timeString += `${days}d `;
  }
  if (hours > 0 || days > 0) {
    timeString += `${hours}h `;
  }
  if (minutes > 0 || hours > 0 || days > 0) {
    timeString += `${minutes}m `;
  }
  timeString += `${seconds}s`;

  return timeString.trim();
}


export const convertAgeMsToDateTime = (ms) => {
  const formatDateTime = (dateTime) => {
    return dateTime.toLocaleString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const now = new Date();
  const pastDate = new Date(now.getTime() - ms);
  return formatDateTime(pastDate);
}

export const convertShortDate = (date) => {
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const convertDateOnly = (date) => {
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour12: true
  });
};

export const convertTimeOnly = (date) => {
  return date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Checks if FormState has been edited, i.e. different from initial state
export const checkDataEdited = ( initialState, currentState, setIsDataEdited ) => {
  if (_.isEqual(initialState, currentState)) {
    setIsDataEdited(false)
  } else {
    setIsDataEdited(true)
  }
}

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