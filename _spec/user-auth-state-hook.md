# Spec for User Auth State Hook

branch: claude/feature/user-auth-state-hook

## Summary

Implement a global authentication state management solution using a custom `useUser` hook that provides access to the current user throughout the application. The hook returns either the authenticated user object or null when logged out. This is powered by a realtime listener that continuously monitors Firebase Authentication state changes, ensuring the app always reflects the current authentication status.

## Functional Requirements

- Create a `useUser` hook that can be imported and used in any component or page
- Hook returns `null` when user is logged out
- Hook returns a user object containing user details when logged in
- Implement a realtime listener that subscribes to Firebase Auth state changes on app load
- State updates propagate automatically to all components using the `useUser` hook
- The hook uses React Context API to share state globally across the application
- Ensure the hook is available throughout the app without prop drilling
- The solution must work with both client and server components (via proper `use client` markers)

## Possible Edge Cases

- User logs out while viewing the app (state should update immediately)
- User logs in on another device/tab (state should update in real-time)
- App is refreshed while user is logged in (auth state should persist from Firebase)
- Network issues causing auth state listener to fail temporarily (graceful error handling)
- Multiple components using the hook simultaneously

## Acceptance Criteria

- `useUser` hook is accessible from any component
- Hook returns correct user data type (User object or null)
- Auth state updates are reflected in real-time across all components
- Firebase Auth listener is established on app initialization
- Hook usage replaces any hardcoded or placeholder user data in existing components
- No TypeScript errors or linting warnings
- The solution integrates with existing Firebase Auth setup

## Open Questions

- Should the hook return a loading state in addition to user and null? email, user-id, name
- Should there be an initial loading state while the auth listener initializes? yes
- What user properties should be exposed from the user object? email, user-id and name

## Testing Guidelines

Create a test file in the ./tests folder for the new feature, and create meaningful tests for the following cases:

- Hook returns null when user is not authenticated
- Hook returns user object when user is authenticated
- Multiple components can use the hook and receive the same user data
- Auth state changes trigger hook updates in all consuming components
- The hook properly initializes on first render

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
