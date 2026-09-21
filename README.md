# MV News

Redesigned HackerNews web application using Angular 21. Includes 6 pages: New, Top, Best, Ask, Show, Jobs, with infinite scroll pagination, dark/light themes, unit tests and a11y.

HackerNews Website - https://news.ycombinator.com

HackerNews API - https://github.com/HackerNews/API

## Architecture

### Design System

Since the application is small, any component libraries felt like overkill, so I built a small design system instead using css variables that are split into two layers: raw primitives and semantic tokens. Components utilize only semantic tokens which makes it easily change UI shape and add new themes.

Inspired by Tailwind theme variables - https://tailwindcss.com/docs/theme#default-theme-variable-reference

### Programming Patterns

After exploring HackerNews API docs and testing endpoints, I realised that every required endpoint follows the same order to get actual data:

1. Fetch an array of IDs
2. Fetch `Story` object per ID

Since the fetching logic and response model were identical across all 6 endpoints, I decided to use **Strategy** pattern - each endpoint has its own strategy that implements `NewsStrategy` interface and provided on route level using `provideNewsStrategy(strategy)` function. This keeps the fetching, pagination and caching logic in one place, ignoring how many strategies are there.

`NewsRepository` consumes a strategy that the current route provides and exposes a `getStories()` method. The class handles stories fetching, pagination, caching, error handling, edge cases, and hides the business logic from consumers.

`NewsStore` consumes `NewsRepository` and handles page-level state: loading/error flags, loaded stories, and pagination.

All 6 routes render one reusable `StoriesPage` component, because the logic is identical across all pages. Only injected strategy changes per route.

## Accessibility

- Keyboard and screen-reader support for navigation, including sidenav menu with trapped focus
- Announce loading, error, empty and reached end list states
- Hide purely visual elements from screen reader - icons, skeleton
- Give more context about link navigation for screen-readers - active page, that link will be opened on a new tab

## Tests

Unit tests focus on business logic - repository (caching, pagination, missing/failed items from API) and store (state transitions, correct computations).

To run tests use `npm run test`.

## Setup / Run locally

1. Clone the repository
2. Install dependencies using `npm install`
3. Use `npm start` to build and run the application
