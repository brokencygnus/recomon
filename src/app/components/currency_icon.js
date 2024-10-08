import { currencies } from '@/app/constants/mockdata/currency_mockdata'
import { stringToColor } from './stringToColor'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Dynamic text size to fit
// Formula: base / (length + constant)
function textSize( iconSize, symbol ) {
  const length = symbol.length
  
  const size = {
    xs: {1: "text-[0.9rem]", 2: "text-[0.6rem]", 3: "text-[0.45rem]", 4: "text-[0.36rem]"}, // base = 1.8, constant = 1
    sm: {1: "text-[1rem]", 2: "text-[0.75rem]", 3: "text-[0.6rem]", 4: "text-[0.5rem]"}, // base = 3, constant = 2
    md: {1: "text-[1.2rem]", 2: "text-[0.96rem]", 3: "text-[0.8rem]", 4: "text-[0.69rem]"}, // base = 4.8, constant = 3
  }

  return size[iconSize][length]
}


export function CurrencyIcon({ symbol, size, ...props }) {
  const iconSize = () => {
    switch (size) {
      case "xs": return "h-5 w-5"
      case "sm": return "h-6 w-6"
      case "md": return "h-8 w-8"
      default: return "h-6 w-6"
    }
  }

  const currentCurrencyData = (symbol) => (
    currencies.find(currency => currency.symbol === symbol)
  )

  const textSymbol = currentCurrencyData(symbol)?.fiatSymbol ?? currentCurrencyData(symbol)?.symbol
  const color = stringToColor(currentCurrencyData(symbol)?.name + symbol)

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
            className={classNames(textSize(size, textSymbol), iconSize(), "overflow-hidden flex items-center justify-center border-2 rounded-full text-white font-bold")}
          >
            {textSymbol}
          </div>
      }
    </>    
  );
}