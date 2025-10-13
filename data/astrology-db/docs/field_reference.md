# Field Reference (Scaffold)

**Purpose:** Authoritative description of fields across JSON arrays. Keep this file in sync with `data/types.ts`.

> Guideline: treat anything not in the schema as out of scope. Add new optional fields behind a proposal PR.

---

## Common
- `id` — Stable, kebab-case identifier (string). Never recycle IDs.
- `label` — Human-facing short label (string).
- `summary` — 1–2 sentence description (string, optional).
- `tags` — Controlled vocabulary keys from `tags.json` (string[], optional).
- `source_ids` — Provenance keys from `sources.json` (string[], optional).

## Elements (`elements.json`)
- `id` — `fire|earth|air|water`.
- `color_id` — Reference to `colors.json` for theming.

## Modalities (`modalities.json`)
- `id` — `cardinal|fixed|mutable`.

## Colors (`colors.json`)
- `hex` — Hex color string `#RRGGBB`. Use tokens to avoid semantic churn.

## Signs (`signs.json`)
- `symbol` — Unicode glyph (string). Prefer direct glyph over codepoint.
- `element_id` — FK to `elements.json`.
- `modality_id` — FK to `modalities.json`.
- `polarity` — `"yin"` or `"yang"`.
- `ecliptic_start`, `ecliptic_end` — Nominal tropical boundaries in degrees `[0,360)`.
- `keywords` — Non-redundant descriptors (string[]).
- `body_parts` — Optional correspondences (string[]); avoid medical claims.
- `domicile_candidates|exaltation_candidates|detriment_candidates|fall_candidates` — **Model-agnostic** lists. The active model is defined in `models/*.json`.
- `default_color_id` — FK to `colors.json`.

## Houses (`houses.json`)
- `index` — 1–12.
- `angularity` — `angular|succedent|cadent` derived from index; stored explicitly for fast UI.
- `life_domains` — Topical areas (string[]). Keep granular but neutral.
- `default_sign_hint` — Optional “Aries=1” style hint. Not prescriptive.

## Bodies (`bodies.json`)
- `kind` — `luminary|planet|asteroid|point|hypothetical`.
- `mean_orb_deg` — Typical orb used for aspects in natal context (number).
- `avg_speed_deg_per_day` — Approximate mean daily motion (number). For points, omit or keep small.
- `retrograde_cycles` — Optional notes; model ephemeris elsewhere.

## Aspects (`aspects.json`)
- `angle_deg` — Exact angle in degrees. For families derived by harmonic, also add `harmonic` (e.g., sextile=6).
- `family` — `major|minor|harmonic|other`.
- `nature` — `soft|hard|neutral` for interpretive tone (not fate).

## Models (`data/models/*.json`)
- `rulership_models.json.sign_to_rulers` — Array of `{ sign_id, primary_body_id, secondary_body_id? }`.
- `dignity_models.json.essential` — Scored rows for essential dignities. `range_in_sign` for terms/faces spans degrees `[start,end)` in sign-local degrees.

## Meta (`meta.json`)
- `dataset_id`, `version` (semver), `created`, `updated`, `license`, defaults for active models.

### Validation Notes
- Angles in degrees. No radians.
- IDs referenced must exist. Validate referential integrity in CI.
- Avoid medical/health claims in text fields; keep them descriptive, not prescriptive.
