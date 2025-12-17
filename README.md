## Developing

Ensure you're using node version ^24.12.0

IMPORTANT NOTE:

This project uses Svelte v4, the legacy docs for this are available [here](https://svelte.dev/docs/svelte/legacy-overview)

Once you've created a project and installed dependencies with `npm install`, start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

## Interview Instructions

**SvelteKit Frontend Exercise (Paid)**  
This paid exercise is designed to evaluate how you design, structure, and implement a small SvelteKit application under realistic constraints. You will be working in a SvelteKit codebase we provide, using Svelte & TypeScript throughout.

---

**Technology & Constraints**  
The application should be built using SvelteKit and TypeScript and styled with plain CSS (or SCSS if already configured). A shared CSS variables stylesheet will be provided and should be used consistently for spacing, colors, and typography. Please do not use Tailwind, component libraries, or other styling frameworks.

Svelte 4 should be used for this project. Svelte legacy documentation is available here:  
https://svelte.dev/docs/svelte/legacy-overview

Additional constraints:

- State management is up to you and may include component state, Svelte stores, or derived state
- API requests should use only the provided endpoints
- Prioritize clarity, correctness, and maintainability over abstraction or premature optimization

---

**Time Expectation**  
You may take up to two days to complete this exercise. You are not expected to use the full time, and partial solutions are acceptable if they are well structured and clearly documented.

---

**Design & UI**  
You will receive a Figma design or static UI reference along with API documentation. The UI should closely match the intended layout, spacing, and visual hierarchy shown in the design. Pixel-perfect accuracy is not required, but the result should feel deliberate and well aligned with the reference.

Accessibility should be intentionally considered in your markup and styling, including semantic HTML, proper labeling of form controls, keyboard navigability, visible focus states, and appropriate use of color contrast with the provided CSS variables.

---

**Application Structure**  
The application consists of two primary views: an Accounts Overview view and a Balance Transfer view. These views represent different states of the same application and do not need to be implemented as separate routes. Conditional rendering—such as switching views based on a local page value—is perfectly acceptable, and the overall structure and navigation approach are left to your discretion.

You may also choose to implement these views as separate routes if you feel that better matches your design approach; we will not penalize either choice.

---

**Accounts Overview View**  
The Accounts Overview view should fetch a list of bank accounts from the API and present relevant information in a clear and readable format.

At a minimum, the view should:

- Display the account name, account number, balance, and active or inactive status
- Visually distinguish inactive accounts
- Include a toggle to hide inactive accounts
- Handle loading and error states gracefully

Optional enhancements such as masking account numbers or displaying an empty state are welcome but not required.

---

**Balance Transfer View**  
The Balance Transfer view allows a user to move funds between accounts and should be built as a simple, well-validated form.

The view should include:

- “From” and “To” account dropdowns and an input for the transfer amount
- Inactive accounts listed but not selectable in the dropdowns

In addition:

- Transfers should be prevented if the amount exceeds the available balance
- The submitted request must match the API’s expected payload shape
- A successful response should display a confirmation message, reset the form, and update the account balances
- A failed response should display a clear, user-visible error message

---

**API Contract & TypeScript Usage**  
API documentation will describe request and response shapes. We expect explicit TypeScript types or interfaces to be defined for account data, API responses, and transfer request payloads.

In particular:

- API data should be treated as untrusted until it has been typed and handled at the boundaries of your application
- Avoid relying on implicit typing from `fetch`
- Network and parsing errors should be handled explicitly
- Types should drive component props, local state, and any shared state
- If no feasible API endpoint exists to provide the correct data for a UI element, using mock data is acceptable

Mock data should only be used for UI elements that cannot be reasonably derived from the provided API responses, and any such usage should be clearly documented in the README.

---

**What We’re Evaluating**  
When reviewing submissions, we focus on the following areas:

- **TypeScript:** strong typing throughout the application with minimal use of `any`
- **Component structure:** clean separation of concerns and sensible parent/child relationships
- **Markup & styling:** semantic, accessible HTML; clean, maintainable CSS; and consistent use of provided variables
- **State management:** clear and predictable state flow with appropriate use of local state and stores
- **Error handling:** thoughtful handling of API failures, validation errors, and user feedback

---

**Submission**  
Please submit:

- A PR containing your work, submitted no more than 2 days after materials provided
- Updates to the README explaining how to run the project, noting any assumptions or trade-offs, and describing what you would improve with more time

---

**Important Links**

- **API documentation:** https://northwind.dev.array.io/swagger/index.html#/
- **Figma / UI:** ??
- **Svelte Documentation:** https://svelte.dev/docs/svelte/legacy-overview
