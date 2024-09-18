export const activityLogs = [
  {
    "id": 1,
    "buCode": "EXCG",
    "buName": "Exchange",
    "ageMS": 220806, // replace with datetime from API
    "userName": "Magnus Carlsen",
    "eventCategory": "businessUnit",
    "eventName": "create",
    "details": {
      "buCode": "EXCG",
      "buName": "Exchange"
    }
  },
  {
    "id": 2,
    "buCode": "LOAN",
    "buName": "Loan",
    "ageMS": 460758,
    "userName": "Hikaru Nakamura",
    "eventCategory": "businessUnit",
    "eventName": "update",
    "details": {
      "buCode": "LOAN",
      "buName": "Loan",
      "oldData": {
        "buCode": "LOAN-CAMP",
        "description": "Concerns the assets assocciated with CAMP Investment Exchange, including Swap and Spot Market products. Asssets include customer funds, working capital, and eschrow funds."
      },
      "newData": {
        "buCode": "LOAN",
        "buName": "Loan",
        "description": "Concerns the assets associated with CAMP Investment Exchange, including Swap and Spot Market products. Assets include customer funds, working capital, and escrow funds."
      }
    }
  },
  {
    "id": 3,
    "buCode": "VCRT",
    "buName": "VCR Technology Investment",
    "ageMS": 819173,
    "userName": "Fabiano Caruana",
    "eventCategory": "account",
    "eventName": "delete",
    "details": {
      "accountCode": "VCRT-USD-C001",
      "accountName": "Initial Funds",
    }
  },
  {
    "id": 4,
    "buCode": "EXCG",
    "buName": "Exchange",
    "ageMS": 1029072,
    "userName": "Arjun Erigaisi",
    "eventCategory": "account",
    "eventName": "create",
    "details": {
      "accountCode": "EXCG-BTC-C002",
      "accountName": "Treasury"
    }
  },
  {
    "id": 5,
    "buCode": "EXCG",
    "buName": "Exchange",
    "ageMS": 1372517,
    "userName": "Ian Nepomniachtchi",
    "eventCategory": "account",
    "eventName": "updateMetadata",
    "details": {
      "accountCode": "EXCG-BTC-C001",
      "accountName": "Treasury",
      "oldData": {
        "accountCode": "EXCG-BTC-C002",
        "accountName": "Treasury",
        "description": "Fixed Deposit treasury account in BTC.",
        "currency": "BTC",
        "accountType": "liability"
      },
      "newData": {
        "accountCode": "EXCG-BTC-C001",
        "accountName": "Treasury",
        "currency": "BTC",
        "accountType": "capital"
      }
    }
  },
  {
    "id": 6,
    "buCode": "STKG",
    "buName": "Staking",
    "ageMS": 1837850,
    "userName": "Nodirbek Abdussatorov",
    "eventCategory": "account",
    "eventName": "updateBalance",
    "details": {
      "accountCode": "FXDT-ETH-C003",
      "accountName": "NFT Sales Revenue",
      "currency": "ETH",
      "oldBalance": "38.33462807",
      "newBalance": "38.84809918"
    }
  },
  {
    "id": 7,
    "buCode": "MMBT",
    "buName": "Market Maker Bot",
    "ageMS": 2164070,
    "userName": "Dommaraju Gukesh",
    "eventCategory": "account",
    "eventName": "updateDataSource",
    "details": {
      "accountCode": "MMBT-ADA-A004",
      "accountName": "FalconX Balance",
      "oldData": {
        "dataSourceType": "manual",
      },
      "newData": {
        "dataSourceType": "api",
        "api": "API-004 FalconX API",
      }
    }
  },
  {
    "id": 8,
    "buCode": "VCRT",
    "buName": "VCR Technology Investment",
    "ageMS": 2436161,
    "userName": "Wesley So",
    "eventCategory": "businessUnit",
    "eventName": "delete",
    "details": {
      "buCode": "VCRT",
      "buName": "VCR Technology Investment",
    }
  },
  {
    "id": 9,
    "buCode": "FXDT",
    "buName": "Fixed Deposit",
    "ageMS": 2907162,
    "userName": "Wei Yi",
    "eventCategory": "api",
    "eventName": "create",
    "details": {
      "apiCode": "API-004",
      "apiName": "Coingecko Exchange Rate API",
    }
  },
  {
    "id": 10,
    "buCode": "LOAN",
    "buName": "Loan",
    "ageMS": 3042337,
    "userName": "Viswanathan Anand",
    "eventCategory": "api",
    "eventName": "update",
    "details": {
      "apiCode": "API-008",
      "apiName": "CAMP Investment Internal Loan API",
      "oldData": {
        "apiCode": "API-008",
        "apiName": "CAMP Investment Internal Loan API",
        "url": "https://www.campinvestment.com/api/internal/user-loan-summary?filter=BTC&user_id=607",
        "customHeaders": `{"Authorization": "Bearer -dr4SCoHsfatQdVdFQfm7HjY6X8RqkfPm9TZjrymna0muDHy-mI=5-0TueymzoutEsmt301rS7hT6CBp8pLq7vGDnXDQ9JS-GZtHIqydCuX1s?t0jikt4QKHcpq3I4NvkTDT-0=UZaAd94x/J9fA3wvCpuJVg=0nkkfiE9jc4OEmBsTfIsNudYs2Cuh4rH7a01fkN9wVUw6GV1cSNBzMXn1qLSifZD68IdRTZXfrSC6nC254UmAeZFk-ApITHbrI, "Content-Type": "application/json"}`,
      },
      "newData": {
        "apiCode": "API-008",
        "apiName": "CAMP Investment Internal Loan API",
        "url": "https://www.campinvestment.com/api/internal/user-loan-summary?filter=all",
        "customHeaders": `{"Authorization": "Bearer /yareM6OXxlkAp/fTeCMx!I8SBEdEapuWn0lMLoMY9ChLcYvpPk3a!f7V9DhyxSPe!TAr/cbC?udDm?OeIEndM?-LgMCS-imJbYjQw11w7=6I58?OcxWLn!/4F5nLWNN8N2l8K7Cf!vo1Yl5ITyz6fipN0QfA8OIg2l?Te=H1/qZNIFMs5jR1YjIWwZXcTZz2jXxh?cy8DyyIUgLYjLTukTeAdbKpcuU5nU9xiJ?fUr6Ff9ByFHifaDEFpi6t!zI, "Content-Type": "application/json"}`,
      },
    }
  },
  {
    "id": 11,
    "buCode": "CFD",
    "buName": "CFD Unit",
    "ageMS": 3491735,
    "userName": "Rameshbabu Praggnandhaa",
    "eventCategory": "config",
    "eventName": "defaultSnapshot",
    "details": {
      "oldConfig": {
        "startingDate": "2024-01-01T11:30Z",
        "intervalType": "week",
        "intervalOption": undefined,
        "primaryInterval": 3,
        "secondaryInterval": 0,
        "weekArray": [true, false, false, false, false, false, false],
      },
      "newConfig": {
        "startingDate": "2024-01-01T11:30Z",
        "intervalType": "hour",
        "intervalOption": "time-continuous",
        "primaryInterval": 9,
        "secondaryInterval": 30,
        "weekArray": null,
      }
    }
  },
]