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