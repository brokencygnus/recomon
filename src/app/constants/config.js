export const config = {

  // Currency used to combine multiple currencies into one
  collateCurrency: 'USD',
  
  // Toggle 'dev' | 'prod' to add or remove debug features
  env: 'dev',

  // The amount of time in milliseconds that a toast would stay on the screen before expiring
  toastTimeout: 8000,
  toastTimeoutClass: 'duration-[8000ms]',

  // The amount of time in milliseconds that an alert would stay on the screen before expiring
  alertTimeout: 15000,
  alertTimeoutClass: 'duration-[15000ms]',

  // Max and min years in date calculations
  minYear: 1999,
  maxYear: 2100,
}