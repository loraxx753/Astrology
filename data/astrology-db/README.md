# JW Astrology DB (Scaffold)

**Purpose:** A normalized, model-aware JSON dataset for signs, houses, bodies, aspects, and classical rulerships, with a flat index for search.

## Contents
- `data/*.json` — Core arrays (elements, modalities, colors, signs, houses, bodies, aspects, sources, tags, meta).
- `data/models/*.json` — Named, swappable models (rulerships, dignities).
- `data/types.ts` — TypeScript types (authoritative).
- `data/index.json` — Flat, denormalized search index.
- `docs/field_reference.md` — Field-by-field documentation.

## Workflow
- Treat `types.ts` as the contract. Add optional fields before populating them.
- Keep contested mappings in `data/models` and avoid hardcoding those into core files.
- Validate referential integrity in CI (IDs must exist; angles in degrees; enums respected).

## Next
- Generate `decans.json`, `degrees.json` with Sabian symbols if desired.
- Add `interpretations.json` per chosen school (tag + source every block).
- Emit JSON Schema from `types.ts` (e.g., `ts-json-schema-generator`) and validate on commit.
