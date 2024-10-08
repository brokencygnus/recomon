import { currencies } from "@/app/constants/mockdata/currency_mockdata"

export const enabledCurrencies = currencies.filter(cur => cur.enabled === true)