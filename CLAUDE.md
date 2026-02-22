# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Summary

**Pocket Heist** is a Next.js 16+ application built as a learning project for the Claude Code Masterclass. The app is a playful task/mission management system themed around "office mischief" where users can create and manage "heists" (missions/challenges).

**Tech Stack:**
- Next.js 16+ with App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- Vitest + React Testing Library
- Lucide React (icons)

**Current State:** This is a starter/skeleton project with basic page structure and routing in place. Most pages currently show placeholder content and are ready for feature implementation.

## Core Functionality

The application is designed around the following user flows:

1. **Authentication Flow** (Currently placeholder pages)
   - Splash page (`/`) - decides whether to redirect authenticated users to `/heists` or unauthenticated to `/login`
   - Login page (`/login`)
   - Signup page (`/signup`)

2. **Heist Management** (Dashboard area - currently placeholder pages)
   - **Heists Dashboard** (`/heists`) - displays three sections:
     - Your Active Heists
     - Heists You've Assigned
     - All Expired Heists
   - **Create Heist** (`/heists/create`) - form to create new heists
   - **Heist Details** (`/heists/[id]`) - view individual heist details

3. **Development/Preview**
   - Preview page (`/preview`) - for testing newly created UI components

## Development Commands

### Running the application
```bash
npm run dev        # Start development server at http://localhost:3000
npm run build      # Build production bundle
npm start          # Start production server
```

### Testing
```bash
npm test           # Run all tests with Vitest in watch mode
```

The project uses Vitest with React Testing Library. Test files are located in `tests/` directory. The test setup is configured in `vitest.config.mts` with jsdom environment and global test utilities (configured in `vitest.setup.ts`).

### Linting
```bash
npm run lint       # Run ESLint
```

ESLint is configured with Next.js recommended rules (core-web-vitals and TypeScript).

## Architecture

### Next.js App Router Structure

This project uses Next.js 16+ with the App Router architecture. The routing structure uses **route groups** for layout organization:

#### Route Groups Pattern

- **`app/(public)/`** - Public-facing pages with minimal layout
  - Applies a simple layout wrapper with `.public` CSS class
  - Pages: landing (`/`), login, signup, preview
  - Layout: `app/(public)/layout.tsx`

- **`app/(dashboard)/`** - Authenticated dashboard area
  - Includes the Navbar component in the layout
  - Contains heists management pages: list view, create form, and individual heist details
  - Routes: `/heists`, `/heists/create`, `/heists/[id]`
  - Layout: `app/(dashboard)/layout.tsx`

**Key Concept:** Route groups `(public)` and `(dashboard)` organize pages without affecting URL structure. They allow different layouts for different sections of the app while keeping URLs clean (e.g., the route is `/heists`, not `/dashboard/heists`).

### Path Aliases

The project uses `@/*` alias for imports, configured in `tsconfig.json`:
```typescript
import Navbar from "@/components/Navbar"
```

This maps to the project root directory.

### Styling Architecture

The project uses **hybrid styling approach**:

1. **Tailwind CSS v4** (primary) - Utility-first styling with custom theme
2. **CSS Modules** - For component-specific styles (e.g., `Navbar.module.css`)

**Theme Configuration** (in `app/globals.css`):
- Custom color palette: primary (#C27AFF purple), secondary (#FB64B6 pink), dark backgrounds
- Typography: Inter font family
- Utility classes: `.page-content`, `.center-content`, `.form-title`

### Component Organization

Components are organized in feature-based folders with barrel exports:
```
components/
  Navbar/
    Navbar.tsx        # Component implementation
    Navbar.module.css # Component styles
    index.ts          # Barrel export
```

Import pattern: `import Navbar from "@/components/Navbar"` (uses the index.ts barrel export)

### TypeScript Configuration

- Vitest globals are enabled in `tsconfig.json` (allows `describe`, `it`, `expect` without imports)
- React JSX is set to `react-jsx` format
- Strict mode enabled
- Module resolution uses `bundler` strategy for optimal Next.js compatibility

### Brand Identity

The app uses a clock icon (Clock8 from Lucide) as part of the "Pocket Heist" logo, replacing the "o" in "Pocket". This branding appears in both the navbar and splash page.

## Additional Coding Preferences

- Use the `git switch -c` command to switch to new branches, not `git checkout`.
- Tests in `tests/` directory mirror `components/` structure