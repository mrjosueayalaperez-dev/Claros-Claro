# RELAY NOTE — read this first

**What this is:** Claro is Grok's build. This code reached the founder (Josue Ayala-Perez) through chat relays on **Oct 25, 2026**, and was pushed here at his direction so the team can patch from real files. **All code is Grok's.** Relay and assembly by Muse; nothing was rewritten, reconstructed, or "improved" — where the transit damaged the text, the damage is preserved and listed below, not silently fixed.

## Placed at their real paths — files that arrived WHOLE

- `src/lib/claro/card.ts` — saved-card storage (localStorage `claro-card`), contact helpers.
- `src/lib/claro/video.ts` — video server functions (xAI `grok-imagine-video`; needs `XAI_API_KEY` on the server or it returns "Video isn't available right now").
- `src/routes/index.tsx` — home route → `ClaroApp`.
- `src/routes/p/$id.tsx` — customer-page route → `PublicPage`.

## In `received-fragments/` — compose.ts arrived in PIECES, with transit damage

- `compose-part1-as-received.txt` — the body of compose.ts (buildPage, threeBeats, asPost, postsFor, samples). **It begins mid-function** (the opening of the name-finding function is missing), and the chat path stripped `${ }` template markers in several places.
- `compose-part2-fixes-as-received.txt` — two CLEAN fragments received later that repair two of the damaged spots: the post/closer construction and the `customerMessage` template.
- `compose-part3-head-as-received.txt` — the head of compose.ts (types, the bilingual `copy` object, clean/sentence/finders). **It ends mid-function:** `shortService` is cut off where the relay spliced into the next file — its trade/shop endings are missing.
- **Still damaged with no clean copy received:** the punctuation test inside `dot()` (arrived as `/[.!?]\( /`).

## Still missing entirely (never received)

- `src/components/claro-app.tsx` (the main screen), `src/components/claro-owner.tsx`, `src/components/claro-public.tsx`
- `src/lib/claro/intake.ts`, `src/lib/claro/files.ts`
- Project scaffolding: `package.json`, TypeScript/Vite config, root route, styles

**The app does not run from what is here yet.** This repository currently holds an honestly labeled partial copy. When the remaining files arrive — ideally as real files or a ZIP, not chat pastes — they can be placed at their paths and this note updated.
