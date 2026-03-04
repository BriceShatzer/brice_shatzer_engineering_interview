

# My Notes


**Things to bring up:**  

- transfer api — The POST `/external/transfers/initiate` response returns `source_account` with empty `account_number` and `account_holder_name` fields. It also appears to swap the source and destination account routing numbers. We patch the response with correct data from the original request at the API boundary (`/api/transfers/+server.ts`), and cache the account data in-memory on the server so that the transfer history list also displays correct values for transfers the app initiated.  
*Note: the cache resets on server restart, so older transfers will still fall back to "Unknown"*.

- `INBOUND` vs `OUTBOUND` thing I talk about below.  


**To Dos:**  


- pretty names for transfers
- merge activity & transfers on homepage. 
- mobile styles
- tests  
- use /bank api to get hardcoded/missing values 
- ARIA
- integrate domains
- more accurate styling 
- README!!
- get execution paths for things
- keep account numbers sever side  





---



- excludeAccountId in TransferForm.svelte & AccountSelect.svelte - does this serve a purpose?

- when you get all of the transfers, with the individual transfer objects appearing similar to the one below. **are internal transfers "INBOUND" or "OUTBOUND"? Does it mater?** 

```json
{
    "transfer_id": "36181861-d06f-4c16-b744-9c8072bb0bfa",
    "status": "COMPLETED",
    "reference_number": "EXT003",
    "amount": 2500,
    "currency": "USD",
    "direction": "INBOUND",
    "transfer_type": "SAME_DAY_ACH",
    "description": "Same-day ACH transfer",
    "initiated_date": "2026-02-27T13:26:41.241338Z",
    "processing_date": "2026-02-27T13:52:13.526517Z",
    "completed_date": "2026-02-27T13:52:59.177823Z",
    "expected_completion_date": "2026-02-27T13:26:41.241338Z",
    "fee": 1,
    "source_account": {
        "account_number": "2222222222",
        "routing_number": "021000021",
        "account_holder_name": "Michael Davis",
        "institution_name": "Wells Fargo"
    },
    "destination_account": {
        "account_number": "LQX79N-CH-003",
        "routing_number": "002772901",
        "account_holder_name": "Sarah Johnson",
        "institution_name": "Northwind Bank"
    }
},
```

## ask about

- the discrepancy between the account names being returned by the API & what is shown on the figma with figma.




<details><summary><h3>scratch paper</h3></summary>
        

- **SVELTE 4 !!**
- Money
  - [dinero.js](https://www.dinerojs.com/)

  ```javascript
  // --- Store and Calculate in Minor Units
  let priceInCents = 1050; // $10.50
  let taxInCents = 53; // $0.53
  let totalInCents = priceInCents + taxInCents; // 1103 (representing $11.03)

  // --- Displaing:
  let displayTotal = (totalInCents / 100).toFixed(2); // "11.03" (string)

  const amount = 123456.789;

  // Format as US Dollar
  const usdFormatted = new Intl.NumberFormat('en-US', {
  	style: 'currency',
  	currency: 'USD'
  }).format(amount);
  console.log(usdFormatted); // Expected output: "$123,456.79"

  // Format as Euro in Germany
  const eurFormatted = new Intl.NumberFormat('de-DE', {
  	style: 'currency',
  	currency: 'EUR'
  }).format(amount);
  console.log(eurFormatted); // Expected output: "123.456,79 €"
  ```


</details> 
