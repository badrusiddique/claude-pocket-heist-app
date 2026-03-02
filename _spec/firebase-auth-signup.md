# Spec for Firebase Auth Signup Integration

branch: claude/feature/firebase-auth-signup-01

## Summary

Integrate the signup form with Firebase Authentication to create new user accounts. On successful signup, extract the user's display name from the email (pascal-case format: first letter uppercase, 2 characters if applicable), set it as the Firebase Auth display name, and create a corresponding user document in Firestore with the user's ID, email, and display name for future reference.

## Functional Requirements

- Connect the signup form submission to Firebase Auth's `createUserWithEmailAndPassword`
- Extract display name from email address (e.g., "john.smith@..." → "Jo" or "jsmith@..." → "Js")
- Apply the display name rule: first letter uppercase, 2 characters if in pascal-case (word.word format)
- Update the Firebase Auth user's display name using `updateProfile`
- Create a user document in Firestore collection `users` with fields: `userId`, `email`, `displayName`
- Handle success by redirecting to `/heists` (authenticated user dashboard)
- Handle errors gracefully with user-facing error messages
- Prevent duplicate sign-ups by checking Firebase Auth response

## Possible Edge Cases

- Email format variations (e.g., "john.smith@...", "johnsmith@...", "j.smith@...")
- Very short email addresses (single character prefix)
- Numbers in email prefix (e.g., "user123@...")
- Special characters in email that need sanitization
- Network failures during Firestore document creation (partial signup)
- User cancels signup midway through form submission
- Email already registered in Firebase Auth (duplicate account error)

## Acceptance Criteria

- Signup form successfully creates a new Firebase Auth user
- Display name is correctly extracted and set (first letter uppercase, 2 chars if pascal-case)
- User document is created in Firestore `users` collection with correct fields
- Successful signup redirects to `/heists` page
- Error messages are displayed to user on signup failure
- All TypeScript types are correct, no `any` types
- Form prevents double submission (disable submit button during request)
- Existing tests still pass, new tests added for signup logic

## Open Questions

- Should display name extraction support formats other than pascal-case (e.g., snake_case)?
- What should happen if Firestore document creation fails but Auth user was created?
- Should there be a retry mechanism for failed Firestore writes?
- Should signup automatically log the user in and establish the auth session?

## Testing Guidelines

Create test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases:

- Display name extraction from various email formats
- Successful Firebase Auth signup and user document creation
- Error handling for duplicate email addresses
- Error handling for network failures
- Form disables during submission to prevent double submission
- User is redirected to `/heists` on successful signup
- Firestore user document contains correct fields

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
