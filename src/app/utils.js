export const BigIntToString = (bigInt) => {
  return "" + Math.round(Number(bigInt/100000000n)) + "." + Math.abs(Number(bigInt % 100000000n))
}


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


// not just for capitalization, but will help translation later 
export const DataSourceDictionary = (dataSource) => {
  switch (dataSource) {
    case "manual": return "Manual";
    case "blockchain": return "Blockchain";
    case "api": return "API";
  }
}
 

// not just for capitalization, but will help translation later 
export const AccountTypeDictionary = (type) => {
  switch (type) {
    case "capital": return "Capital";
    case "asset": return "Asset";
    case "liability": return "Liability";
  }
}