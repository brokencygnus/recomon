import { currencies } from '@/app/constants/mockdata/mockdata'

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

// Hash function to convert any string to color
// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
// With some modifications to make it more chaotic but still deterministic
export const stringToColor = function(str) {
  if (!str) {return "#ffffff"}

  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var seed = hash & 0xFF;
  var rand = function() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  let h = Math.floor(rand() * 360)
  let s = Math.floor(rand() * 100)
  let l = Math.floor(rand() * 100)

  let color = [h, s, l]
  const clampedColor = clampHsl(color)
  const rgbColor = hslToRgb(...clampedColor) 

  var strColor = "#"
  for (let i = 0; i < 3; i++){
    strColor += rgbColor[i].toString(16).substring(0, 2)
  }

  return strColor;
}

// Function to clamp luminance and saturation between min and max
// color = [h, s, l]
const clampHsl = (color) => {
  const maxLum = 70
  const minLum = 50

  const maxSat = 60
  const minSat = 20

  const clampedLum = minLum + color[2] * (maxLum - minLum) / 100
  const clampedSat = minSat + color[1] * (maxSat - minSat) / 100

  return [color[0], clampedSat, clampedLum]
}

// https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/
const hslToRgb = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};
