// data/types.ts
export type ISODate = string; // YYYY-MM-DD
export type AngleDeg = number; // 0..360
export type HexColor = `#${string}`;

export interface Source {
  id: string;
  title: string;
  author?: string;
  year?: number;
  publisher?: string;
  url?: string;
  notes?: string;
}

export interface Tag {
  id: string;
  label: string;
  description?: string;
  parent_id?: string;
}

export type ElementId = "fire" | "earth" | "air" | "water";
export type ModalityId = "cardinal" | "fixed" | "mutable";
export type Polarity = "yin" | "yang";
export type Angularity = "angular" | "succedent" | "cadent";
export type BodyKind = "luminary" | "planet" | "asteroid" | "point" | "hypothetical";
export type AspectFamily = "major" | "minor" | "harmonic" | "other";
export type AspectNature = "soft" | "hard" | "neutral";

export interface ElementMeta {
  id: ElementId;
  label: string;
  summary?: string;
  color_id?: string;
  tags?: string[];
}

export interface ModalityMeta {
  id: ModalityId;
  label: string;
  summary?: string;
  tags?: string[];
}

export interface ColorToken {
  id: string;
  label?: string;
  hex: HexColor;
  notes?: string;
  tags?: string[];
}

export interface Sign {
  id: string;
  label: string;
  symbol: string;
  element_id: ElementId;
  modality_id: ModalityId;
  polarity: Polarity;
  ecliptic_start: AngleDeg;
  ecliptic_end: AngleDeg;
  default_color_id?: string;
  keywords?: string[];
  body_parts?: string[];
  season_hint?: "spring" | "summer" | "autumn" | "winter";
  glyph_codepoint?: string;
  domicile_candidates?: string[];
  exaltation_candidates?: string[];
  detriment_candidates?: string[];
  fall_candidates?: string[];
  source_ids?: string[];
  tags?: string[];
}

export interface Decan {
  id: string;
  sign_id: string;
  index: 1|2|3;
  start_deg_in_sign: number;
  end_deg_in_sign: number;
  ruler_body_ids?: string[];
  keywords?: string[];
  source_ids?: string[];
}

export interface DegreeNote {
  id: string;
  sign_id: string;
  degree_in_sign: number;
  sabian_symbol?: string;
  dwad_sign_id?: string;
  notes_markdown?: string;
  source_ids?: string[];
  tags?: string[];
}

export interface House {
  id: string;
  index: 1|2|3|4|5|6|7|8|9|10|11|12;
  label: string;
  angularity: Angularity;
  life_domains: string[];
  default_sign_hint?: string;
  keywords?: string[];
  source_ids?: string[];
  tags?: string[];
}

export interface Body {
  id: string;
  label: string;
  kind: BodyKind;
  symbol?: string;
  glyph_codepoint?: string;
  mean_orb_deg?: number;
  avg_speed_deg_per_day?: number;
  retrograde_cycles?: string[];
  color_id?: string;
  keywords?: string[];
  source_ids?: string[];
  tags?: string[];
}

export interface AspectDef {
  id: string;
  label: string;
  angle_deg: number;
  family: AspectFamily;
  nature: AspectNature;
  default_orb_deg?: number;
  harmonic?: number;
  source_ids?: string[];
  tags?: string[];
}

export interface RulershipModel {
  id: string;
  label: string;
  description?: string;
  sign_to_rulers: Array<{
    sign_id: string;
    primary_body_id: string;
    secondary_body_id?: string;
  }>;
  source_ids?: string[];
}

export interface DignityModel {
  id: string;
  label: string;
  description?: string;
  essential: Array<{
    planet_id: string;
    sign_id: string;
    kind: "domicile" | "exaltation" | "detriment" | "fall" | "term" | "face";
    score: number;
    range_in_sign?: [number, number];
  }>;
  accidental_hints?: Array<{
    house_id: string;
    score: number;
    note?: string;
  }>;
  source_ids?: string[];
}

export type InterpretationScope = "natal" | "transit" | "synastry" | "composite";

export type InterpretationTopic =
  | "planet-in-sign"
  | "planet-in-house"
  | "house-cusp-in-sign"
  | "aspect-between-bodies"
  | "sign-profile"
  | "house-profile"
  | "degree-symbol"
  | "decans-profile";

export interface Interpretation {
  id: string;
  scope: InterpretationScope;
  topic: InterpretationTopic;
  sign_id?: string;
  house_id?: string;
  planet_id?: string;
  other_planet_id?: string;
  aspect_id?: string;
  degree_note_id?: string;
  decan_id?: string;
  title: string;
  summary?: string;
  markdown: string;
  source_ids?: string[];
  tags?: string[];
  confidence?: "low" | "medium" | "high";
}

export interface Meta {
  dataset_id: string;
  version: string;
  created: ISODate;
  updated: ISODate;
  default_rulership_model_id?: string;
  default_dignity_model_id?: string;
  license?: string;
  notes?: string;
}
