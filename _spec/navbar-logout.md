# Spec for Navbar Logout Button

branch: claude/feature/navbar-logout

## Summary

Add a logout button to the Navbar component that is visible only to authenticated users. When clicked, the logout button signs the user out of Firebase Auth, clears the auth session, and redirects them to the login page (`/login`). The button should match the existing navbar styling and be positioned appropriately within the navbar layout.

## Functional Requirements

- Add a logout button to the Navbar component that is only visible when a user is authenticated
- The logout button should trigger Firebase Auth's `signOut()` function when clicked
- After logout, redirect the user to the `/login` page
- The button should be disabled during the logout process to prevent double-logout attempts
- The button should match the existing navbar styling (use existing button classes and color scheme)
- Position the logout button at the end of the navbar (right side)
- Handle logout errors gracefully with appropriate error messaging if needed
- The navbar should properly reflect the unauthenticated state after logout (hide logout button, show login/signup links if applicable)

## Possible Edge Cases

- User clicking logout button multiple times quickly (prevent double logout)
- Logout fails due to network error (user is still in Firebase session)
- User is logged in but localStorage/session state is inconsistent
- Logout button is clicked while user is in the middle of navigating
- Firebase signOut is pending when user closes the browser window
- User session expires while on the page (should already show logged-out state)

## Acceptance Criteria

- Logout button appears in Navbar only when `useUser().user` is not null
- Logout button triggers `signOut(auth)` from Firebase
- User is successfully redirected to `/login` after logout
- Submit button is disabled during logout to prevent race conditions
- Button styling matches the rest of the Navbar (uses existing CSS variables and classes)
- `AuthContext` properly updates and user state becomes null after logout
- All existing tests continue to pass
- New tests verify logout button visibility and logout functionality
- No TypeScript errors; all types are properly specified

## Figma Design Reference

The Navbar component design can be found in the existing Figma file. The logout button should match the styling of other interactive elements in the navbar and be positioned in the top-right area with the existing navigation controls.

## Open Questions

- Should there be a confirmation dialog before logout, or logout immediately? logout immediately - NO
- Should the logout button display a loading state while signing out? yes
- What error message (if any) should display if logout fails? optional - can log to console
- Should the navbar collapse or show differently for mobile layouts? - use existing navbar responsive design

## Testing Guidelines

Create test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases:

- Logout button is visible when user is authenticated
- Logout button is hidden when user is not authenticated
- Clicking logout button calls Firebase's `signOut` function
- User is redirected to `/login` after successful logout
- Logout button is disabled during the logout process
- Error handling if logout fails
- Navbar properly updates to show logged-out state after logout

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
