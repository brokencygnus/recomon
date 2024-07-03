import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactTimeAgo from 'react-time-ago'

TimeAgo.addDefaultLocale(en)

export function TimeAgoComp({ date }) {
  return (
    <ReactTimeAgo date={date} locale="en-GB"/>
  )
}

export const convertMsToTimeAgo = (ms) => {
  const now = new Date()
  const pastDate = now.getTime() - ms
  
  return <TimeAgoComp date={pastDate}/> 
}

// converts milliseconds to .. days .. hours .. minutes .. seconds 
// unused
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

export function quantizeDates(timeArray) {
  const dateSet = new Set()

  // Calculation is done in the client's time zone
  // because the days will be grouped based on midnight
  timeArray.forEach(time => {
    const date = new Date(time)
    date.setHours(0, 0, 0, 0)
    dateSet.add(date.toISOString())
  })

  // Convert the set to an array
  return Array.from(dateSet).sort((a, b) => new Date(b) - new Date(a))
}