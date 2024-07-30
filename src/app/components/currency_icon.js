import { currencies } from '@/app/constants/mockdata/mockdata'
import { stringToColor } from './stringToColor'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export function CurrencyIcon({ symbol, size, ...props }) {
  const iconSize = () => {
    switch (size) {
      case "xs": return "text-xs h-5 w-5"
      case "sm": return "text-sm h-6 w-6"
      case "md": return "text-lg h-8 w-8"
      default: return "text-sm h-6 w-6"
    }
  }

  const currentCurrencyData = (symbol) => (
    currencies.find(currency => currency.symbol === symbol)
  )

  const color = stringToColor(symbol)

  return (
    <>
      {
        // Check if currency has icon
        currentCurrencyData(symbol)?.icon ? 
          <img className={iconSize()} src={currentCurrencyData(symbol).icon}/>
        :
        // If currency doesn't have icon, generate one
          <div
            {...props}
            style={{
              borderColor: color,
              backgroundColor: color
            }}
            className={classNames(iconSize(), "overflow-hidden flex items-center justify-center border-2 rounded-full text-white font-bold")}
          >
            {SymbolDictionary(symbol)}
          </div>
      }
    </>    
  );
}

const SymbolDictionary = (symbol) => {
  switch (symbol) {
    case "BTC": return '₿';
    case "ETH": return 'ETH';
    case "USDT": return 'T';
    case "SOL": return 'S';
    case "IDR": return 'Rp';
    case "USD": return '$';
    case "INR": return '₹';
    default : return '$';
  }
}