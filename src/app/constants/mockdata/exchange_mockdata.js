import { accounts } from './mockdata'
import { config } from '../config';
import { convertCurrency } from '@/app/utils/utils';

const appendedAccountData = (accountData) => {
  const capitals = accountData.filter(account => account.type === "capital");
  const assets = accountData.filter(account => account.type === "asset");
  const liabilities = accountData.filter(account => account.type === "liability");
  
  // API should provide these as well but I don't have it and I'm too lazy to mock realistic data
  const getAccountsTotal = (data) => {
    const total = data.reduce((total, account) => {
      return total + parseFloat(account.balance)
    }, 0)
    return total
  };

  return {
    capitals, capitalTotal: getAccountsTotal(capitals), test: console.log(getAccountsTotal(liabilities)),
    assets, assetTotal: getAccountsTotal(assets),
    liabilities, liabilityTotal: getAccountsTotal(liabilities),
  }
}

export const discrAlertConf = {
  critHigh: 10000,
  acctbleHigh: 50,
  acctbleLow: -50,
  critLow: -10000,
}

export const exchangeCurrencies = [
  { 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    // capital: "900.12345678",
    // assets: "982.00000000",
    // liabilities: "90.00000000",
    discrepancy: "8.12345678",
    ...appendedAccountData(accounts),
    discrAlertConf
  },
  { 
    name: 'Ethereum', 
    symbol: 'ETH', 
    // capital: "450.00000000",
    // assets: "450.00000000",
    // liabilities: "0.00000000",
    discrepancy: "0.00000000",
    ...appendedAccountData(accounts),
    discrAlertConf
  },
  { 
    name: 'USD Tether', 
    symbol: 'USDT', 
    // capital: "1300.85267819928",
    // assets: "1445.70535639856",
    // liabilities: "200.00000000",
    discrepancy: "62.85267819928",
    ...appendedAccountData(accounts),
    discrAlertConf
  },
  { 
    name: 'Solana', 
    symbol: 'SOL', 
    // capital: "478.87654322",
    // assets: "740.00000000",
    // liabilities: "190.00000000",
    discrepancy: "-72.12345678",
    ...appendedAccountData(accounts),
    discrAlertConf
  },
  { 
    name: 'Indonesian Rupiah', 
    symbol: 'IDR', 
    // capital: "615904934.12345678",
    // assets: "750000000.00000000",
    // liabilities: "100000000.00000000",
    discrepancy: "559104934.12345678",
    ...appendedAccountData(accounts),
    discrAlertConf
  },
  { 
    name: 'United States Dollar', 
    symbol: 'USD', 
    // capital: "1345.12345678",
    // assets: "2500.00000000",
    // liabilities: "900.00000000",
    discrepancy: "2245.12345678",
    ...appendedAccountData(accounts),
    discrAlertConf
  }
]

const getBuTotal = (data, key) => {
  const total = data.reduce((total, bu) => {
    return total + parseFloat(convertCurrency(bu[key], bu.symbol, config.collateCurrency))
  }, 0)
  return total
};

const capitalBuTotal = getBuTotal(exchangeCurrencies, "capitalTotal")
const assetBuTotal = getBuTotal(exchangeCurrencies, "assetTotal")
const liabilityBuTotal = getBuTotal(exchangeCurrencies, "liabilityTotal")
const discrepancyBuTotal = capitalBuTotal - assetBuTotal + liabilityBuTotal

export const exchangeSummary = {
  capital: capitalBuTotal,
  assets: assetBuTotal,
  liabilities: liabilityBuTotal,
  discrepancy: discrepancyBuTotal,
  discrAlertConf
}