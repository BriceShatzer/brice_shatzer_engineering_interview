

# My Notes


### Things to bring up:  


**API behavior**  
The response that is returned from a successful post to `/external/transfers/initiate` returns `source_account` with an empty `account_number` and `account_holder_name` fields. It also appears to swap the source and destination account routing numbers. We patch the response with correct data from the original request at the API boundary (`/api/transfers/+server.ts`), and cache the account data in-memory on the server so that the transfer history list also displays correct values for transfers the app initiated.  
*Note: the cache resets on server restart, so older transfers will still fall back to "Unknown"*.  

Additionally, the GET transfers list returns incorrect `source_account` & `destination_account` values for any transfer submitted via the API. To work around this, the transfer description is set to a structured format (`"Internal Transfer | from: <account_number> | to: <account_number>"`) when submitting. On the transfers page (`/routes/transfers/+page.svelte`), if a transfer's description starts with `"Internal Transfer |"`, we parse the account numbers from the description string and resolve display names from those instead of relying on the (incorrect) account objects in the response.



**Accessibility notes:**
- The design doc labels the amount field as "Transfer to", but that's the same label used for the destination account select. Changed the amount input's `<label>` to "Amount" so it has a distinct, accurate accessible name.
- `--input-focus-outline` in `tokens.css` references `var(--focus-border-size)` and `var(--focus-border-ci)` which are never defined in the token file. The token itself is unused by any component (all components define their own `:focus-visible` styles), so it resolves to a broken value. Left as-is since the tokens were provided, but this should be flagged if `--input-focus-outline` is ever consumed.


**To Dos:**


- Check for vestigial stuff
  - unused css classes
  - invalid css vars
- redo commented out part of readme
- get execution paths for things (maybe with diagrams)
- Work backwards off of pending transactions to display the current balance??




