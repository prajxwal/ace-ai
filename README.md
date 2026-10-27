# ace-ai

A frontend recreation of the Zoko CRM dashboard (Next.js, TypeScript, Tailwind CSS). It is the base for a browser-native AI agent that will operate the dashboard. This is Phase 1: frontend only, mock data, no backend, and nothing is ever sent to real customers.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000/find
```

Pages: `/find` (all chats), `/my-chats`, `/all-features`. Add `?mock=empty` to load a dataset with no chats.

## Visual checks

With the dev server on port 3100 (`npx next dev -p 3100`), run `npm run snap`. It saves screenshots of the key states to `snapshots/` at the size of the reference screenshots in `reference/`.

## Where things are

- `decisions.md`: every design and implementation decision, with reasons, plus a log of the reference screenshots.
- `src/config/`: channel tabs, filters, and the All Features catalogue.
- `src/mock/`: deterministic mock conversations, agents and tags.
- `src/state/`: a single typed store (reducer and actions) that a future agent can read and dispatch to.
- `src/components/`: UI, grouped by area (layout, find, conversation, my-chats, features, ui).
