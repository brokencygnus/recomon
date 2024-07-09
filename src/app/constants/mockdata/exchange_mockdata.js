import { accounts } from './account_mockdata'
import { config } from '../config';
import { convertCurrency } from '@/app/utils/utils';

// Convert
//    accounts: [ ... ]
// to
//    capitals: [ ... ], capitalTotal: ...,
//    assets: [ ... ], assetTotal: ...,
//    liabilities: [ ... ], liabilityTotal: ...,
const appendedAccountData = (accountData, currency) => {
  const accountsInCurrency = accountData.filter(account => account.currency === currency)

  const capitals = accountsInCurrency.filter(account => account.type === "capital")
  const assets = accountsInCurrency.filter(account => account.type === "asset")
  const liabilities = accountsInCurrency.filter(account => account.type === "liability")
  
  // API should provide these as well but I don't have it and I'm too lazy to mock realistic data
  const getAccountsTotal = (data) => {
    const total = data.reduce((total, account) => {
      return total + parseFloat(account.balance)
    }, 0)
    return total
  };

  const capitalTotal = getAccountsTotal(capitals)
  const assetTotal = getAccountsTotal(assets)
  const liabilityTotal = getAccountsTotal(liabilities)

  const discrepancy = assetTotal - capitalTotal - liabilityTotal

  return {
    capitals, capitalTotal,
    assets, assetTotal,
    liabilities, liabilityTotal, discrepancy
  }
}

export const exchangeCurrencies = [
  { 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    ...appendedAccountData(accounts, 'BTC'),
    discrAlertConf: {
      basis: "currency",
      critHigh: 0.15,
      acctbleHigh: 0.06,
      acctbleLow: -0.06,
      critLow: -0.15,
    }
  },
  { 
    name: 'Ethereum', 
    symbol: 'ETH',
    ...appendedAccountData(accounts, 'ETH'),
    discrAlertConf: {
      basis: "usd",
      critHigh: 15000,
      acctbleHigh: 3000,
      acctbleLow: -3000,
      critLow: -15000,
    }
  },
  { 
    name: 'USD Tether', 
    symbol: 'USDT',
    ...appendedAccountData(accounts, 'USDT'),
    discrAlertConf: {
      basis: "percent",
      critHigh: 0.4,
      acctbleHigh: 0.15,
      acctbleLow: -0.15,
      critLow: -0.4,
    }
  },
  // { 
  //   name: 'Cardano', 
  //   symbol: 'ADA',
  //   ...appendedAccountData(accounts, 'ADA'),
  //   discrAlertConf: {
  //     basis: "usd",
  //     critHigh: 5000,
  //     acctbleHigh: 1000,
  //     acctbleLow: -1000,
  //     critLow: -5000,
  //   }
  // },
  // { 
  //   name: 'Indonesian Rupiah', 
  //   symbol: 'IDR',
  //   ...appendedAccountData(accounts, 'IDR'),
  //   discrAlertConf: {
  //     basis: "usd",
  //     critHigh: 5000,
  //     acctbleHigh: 1000,
  //     acctbleLow: -1000,
  //     critLow: -5000,
  //   }
  // },
  // { 
  //   name: 'United States Dollar', 
  //   symbol: 'USD',
  //   ...appendedAccountData(accounts, 'USD'),
  //   discrAlertConf: {
  //     basis: "usd",
  //     critHigh: 5000,
  //     acctbleHigh: 1000,
  //     acctbleLow: -1000,
  //     critLow: -5000,
  //   }
  // }
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
const discrepancyBuTotal = assetBuTotal - capitalBuTotal - liabilityBuTotal

export const exchangeSummary = {
  capital: capitalBuTotal,
  assets: assetBuTotal,
  liabilities: liabilityBuTotal,
  discrepancy: discrepancyBuTotal,
  discrAlertConf: {
    basis: "usd",
    critHigh: 50000,
    acctbleHigh: 20000,
    acctbleLow: -20000,
    critLow: -50000,
  }
}