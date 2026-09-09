# Authentication Feature — Clerk

## Objective

Replace the existing Supabase authentication system with **Clerk**.

Clerk will become the project's authentication provider.

For the initial version, we will use **email-based authentication only**. Password-based authentication should not be part of the user experience.

The implementation should be clean, secure, reusable, and easy to extend later if we decide to add additional authentication methods.

---

# 1. Authentication Provider

### Current

* Supabase Auth

### New

* Clerk

### Requirements

* Remove Supabase authentication logic from the authentication feature.
* Remove Supabase-specific auth hooks, helpers, queries, and components that are no longer required.
* Install/configure the official Clerk package appropriate for the project's framework.
* Use Clerk's recommended authentication primitives and APIs.
* Do not create a custom authentication system when Clerk already provides the required functionality.
* Do not store passwords ourselves.
* Do not duplicate Clerk user authentication data unnecessarily in the application database.

---

# 2. Authentication Method

For the initial release:

### Email only

The application should support authentication using the user's email address.

We are intentionally removing the traditional:

* Email + password login
* Password field
* Confirm password field
* Password reset UI
* Password creation UI

The user should not be asked to create or remember a password for this version.

Use Clerk's supported email authentication flow.

If Clerk requires a verification step, use Clerk's built-in verification flow rather than implementing custom email verification.

---

# 3. Sign-In / Sign-Up UX

The application should make authentication simple.

## Existing User

If a user already has a Clerk account associated with the email they provide, they should be able to authenticate and enter the application using Clerk's supported email flow.

## New User

If the email does not yet have an account, the user should be taken through the signup flow.

Do not implement a custom database lookup to determine whether an email exists.

Do not expose sensitive account-existence information unnecessarily.

Let Clerk handle the authentication state and account flow.

---

# 4. Signed-In State

When a user is authenticated, the UI should provide access to their basic Clerk profile information.

The application should be able to display:

* User name
* User email
* User profile image
* Logout button

Example user information:

```text
[Profile Image]

User Name
user@email.com

[Logout]
```

The exact visual design should follow the existing anime merchandise website design system.

Do not introduce an unrelated authentication UI style.

---

# 5. Signed-Out State

When a user is not authenticated, the UI should display:

* Sign In button
* Sign Up button

Example:

```text
[Sign In] [Sign Up]
```

These should use Clerk's authentication flow.

Do not build separate custom authentication forms unless there is a specific UX requirement that cannot be handled by Clerk's components.

---

# 6. Navigation / Header Behavior

The authentication state should be reflected in the site's navigation/header.

### Signed out

Show:

```text
Sign In
Sign Up
```

### Signed in

Show:

```text
Profile Image
User Name
User Email
Logout
```

The exact presentation should match the existing website's design.

The header should react automatically when the Clerk authentication state changes.

A full page refresh should not be required simply to update the authentication UI.

---

# 7. User Information

Use Clerk as the source of truth for authentication user data.

The application needs access to:

```text
user.id
user.firstName / user.fullName
user.email
user.imageUrl
```

Use the appropriate Clerk API/properties for the installed Clerk version.

Do not assume a user will always have a first name.

Implement a sensible fallback:

```text
full name
→ first name
→ email
```

The UI should never crash because optional profile information is missing.

---

# 8. Logout

The logout button should use Clerk's official sign-out functionality.

After logout:

1. Clerk session is terminated.
2. Application authentication state updates.
3. Signed-out UI is displayed.
4. User sees Sign In and Sign Up buttons again.

Do not manually delete authentication cookies or implement a custom logout mechanism.

---

# 9. Protected Features

Authentication should be structured so that features requiring an authenticated user can easily be protected.

For example, future features may include:

* User profile
* Wishlist
* Cart synchronization
* Orders
* Order history
* Saved products
* Account settings

Do not build all of these features as part of this task.

Only make the authentication architecture ready for them.

---

# 10. Architecture Requirements

Before modifying code:

1. Inspect the existing project structure.
2. Identify all existing Supabase authentication code.
3. Identify where authentication state is currently consumed.
4. Identify the existing header/navbar components.
5. Identify existing protected routes/features.
6. Identify environment variables related to Supabase authentication.
7. Identify dependencies that are no longer required.

Do not blindly replace files.

Understand the existing architecture first.

---

# 11. Supabase Cleanup

After Clerk authentication is implemented:

Remove Supabase authentication-specific code that is no longer required.

Check for:

* Supabase auth clients
* Auth providers
* Auth hooks
* Auth context
* Login components
* Signup components
* Password forms
* Password reset forms
* Auth middleware
* Auth utility functions
* Supabase auth environment variables

IMPORTANT:

Do not remove Supabase entirely if the application still uses Supabase for other functionality such as database/storage.

Only remove the parts that are specifically responsible for authentication.

---

# 12. Environment Variables

Use Clerk's required environment variables according to the project's framework and current Clerk documentation.

Do not hardcode:

* Secret keys
* Publishable keys
* API keys
* Tokens

Do not commit secrets to Git.

If environment variables are already configured, inspect and reuse the existing setup where appropriate.

---

# 13. Error Handling

Authentication failures should be handled gracefully.

The UI should:

* Show useful error messages.
* Avoid exposing internal errors.
* Avoid exposing sensitive authentication information.
* Prevent broken loading states.
* Handle cancelled authentication flows.
* Handle expired sessions appropriately.

Never display raw server errors directly to the user.

---

# 14. Loading States

Authentication-dependent UI should have proper loading behavior.

Avoid UI flashing such as:

```text
Sign In
```

followed immediately by:

```text
User Profile
```

when the authentication state is still loading.

Use Clerk's authentication/loading state mechanisms appropriately.

---

# 15. Responsive Design

Authentication UI must work on:

* Desktop
* Tablet
* Mobile

The anime merchandise website is expected to be responsive.

Do not sacrifice the existing mobile navigation experience when adding Clerk.

---

# 16. Design Requirements

The authentication implementation must fit the existing anime merchandise website.

Do not create a generic SaaS-looking authentication interface if the project already has an established visual identity.

Maintain:

* Existing typography
* Existing spacing system
* Existing colors
* Existing component patterns
* Existing animation principles
* Existing responsive behavior

Clerk should handle authentication functionality while the surrounding application maintains the website's visual identity.

---

# 17. Security Requirements

Authentication security must be handled by Clerk.

Do not:

* Store passwords.
* Hash passwords manually.
* Store authentication tokens in custom application storage.
* Create custom authentication cookies.
* Query the database to determine whether an email belongs to an account.
* Expose Clerk secret keys to client-side code.
* Trust client-provided user identity without validating the authenticated Clerk session.

Use Clerk's official server/client authentication APIs as appropriate.

---

# 18. Future Extensibility

The initial implementation is intentionally email-only.

However, the architecture should make it easy to add authentication methods later, such as:

* Google
* GitHub
* Apple
* Other Clerk-supported social providers

Do not implement these providers now.

Do not add unnecessary abstractions solely for hypothetical future providers.

---

# 19. Acceptance Criteria

The feature is considered complete when:

### Authentication

* [ ] Supabase is no longer responsible for authentication.
* [ ] Clerk is correctly configured.
* [ ] Email authentication works.
* [ ] Password-based authentication is not exposed.
* [ ] Clerk handles verification where required.

### Signed-out user

* [ ] Sign In button is visible.
* [ ] Sign Up button is visible.
* [ ] Sign In opens the Clerk authentication flow.
* [ ] Sign Up opens the Clerk authentication flow.

### Signed-in user

* [ ] User name can be displayed.
* [ ] User email can be displayed.
* [ ] User image can be displayed.
* [ ] Logout button is available.
* [ ] Logout correctly signs the user out.

### UX

* [ ] Authentication state updates without unnecessary page refreshes.
* [ ] Loading states are handled.
* [ ] Errors are handled gracefully.
* [ ] Mobile and desktop layouts work correctly.
* [ ] Existing anime website design is preserved.

### Code quality

* [ ] No unnecessary duplicate authentication logic exists.
* [ ] No secrets are committed.
* [ ] Supabase auth code is removed where no longer needed.
* [ ] Supabase remains untouched for non-authentication features.
* [ ] Existing project architecture is respected.
* [ ] No unrelated features are modified.

---

# 20. Implementation Workflow

The agent MUST follow this sequence:

### Phase 1 — Inspect

Analyze the existing:

* Project structure
* Framework
* Package.json
* Existing Supabase setup
* Authentication components
* Header/navbar
* Middleware
* Environment variables
* Protected routes

Do not modify code yet.

### Phase 2 — Plan

Create a concise implementation plan explaining:

* What Supabase auth code will be removed.
* What Clerk components/APIs will be introduced.
* Which files will change.
* How the header authentication state will work.
* How existing Supabase database functionality will remain intact.

### Phase 3 — Implement

Implement Clerk authentication using the project's existing architecture and
Clerk's recommended patterns.

### Phase 4 — Integrate

Connect authentication state to the existing navigation/header.

### Phase 5 — Cleanup

Remove obsolete Supabase authentication code without breaking Supabase
database/storage functionality that the project still requires.

### Phase 6 — Verify

Test:

* Signed-out state
* Sign in
* New account/signup flow
* Email verification if enabled
* Signed-in state
* User information display
* Logout
* Page refresh while signed in
* Page refresh while signed out
* Mobile layout
* Desktop layout
* Existing Supabase features unrelated to authentication

### Phase 7 — Report

After implementation, report:

1. Files changed.
2. Dependencies added/removed.
3. Supabase auth code removed.
4. Clerk functionality implemented.
5. Environment variables required.
6. Tests/checks performed.
7. Any remaining manual setup required in the Clerk dashboard.
8. Any issues or limitations.

Do not claim the feature is complete if required Clerk dashboard configuration
or environment variables are still missing.

# END OF AUTH FEATURE SPECIFICATION

