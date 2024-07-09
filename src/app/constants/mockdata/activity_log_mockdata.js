export const activityLogs = [
  {
    "id": 1,
    "buCode": "EXCG",
    "buName": "Exchange",
    "ageMS": 41234, // replace with datetime from API
    "user_name": "Magnus Carlsen",
    "event_category": "business_unit",
    "event_name": "create",
    "details": {
      "buCode": "EXCG",
      "buName": "Exchange"
    }
  },
  {
    "id": 2,
    "buCode": "LOAN",
    "buName": "Loan",
    "ageMS": 41234,
    "user_name": "Hikaru Nakamura",
    "event_category": "business_unit",
    "event_name": "update",
    "details": {
      "buCode": "EXCG",
      "buName": "Exchange",
      "oldData": {
        "name": "Exchangge",
        "description": "Concerns the assets assocciated with CAMP Investment Exchange, including Swap and Spot Market products. Asssets include customer funds, working capital, and eschrow funds."
      },
      "newData": {
        "code": "EXCG",
        "name": "Exchange",
        "description": "Concerns the assets associated with CAMP Investment Exchange, including Swap and Spot Market products. Assets include customer funds, working capital, and escrow funds."
      }
    }
  },
  {
    "id": 3,
    "buCode": "FXDT",
    "buName": "Fixed Deposit",
    "ageMS": 41234,
    "user_name": "Fabiano Caruana",
    "event_category": "business_unit",
    "event_name": "delete",
    "details": {
      "buCode": "EXCG",
      "buName": "Exchange"
    }
  },
]