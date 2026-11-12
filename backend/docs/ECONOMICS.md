# Production economics

```
User pays pack price
        │
        ▼
Paystack charges card / transfer
        │
        ▼
Money settles in YOUR Paystack merchant account (full amount)
        │
        ▼
Backend verifies transaction (status=success, amount match)
        │
        ▼
Backend allocates Decart operating budget
   decart_budget_usd = revenue_usd × (1 − PLATFORM_MARGIN_RATIO)
   (internal prepaid allowance; real Decart usage bills DECART_API_KEY)
        │
        ▼
Backend credits user platform tokens (pack.credits)
        │
        ▼
User starts morph → backend proxies Decart WS with YOUR API key
        │
        ▼
Each generation second:
  • debit user tokens @ CREDITS_PER_SECOND
  • debit platform Decart budget @ DECART_USD_PER_SECOND
        │
        ▼
User tokens OR Decart budget hit 0 → session force-closed
```

Desktop never settles money or holds Decart keys.

Keep the Decart platform account funded (pay-as-you-go on platform.decart.ai).
The internal wallet prevents selling more morph time than collected revenue supports after margin.
