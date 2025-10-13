#!/usr/bin/env python3
"""
Lightweight validator for referential integrity and basic constraints.
Usage:
  python scripts/validate.py
"""
import json, os, sys, glob, re

BASE = os.path.dirname(os.path.abspath(__file__)) + "/.."
DATA = BASE + "/data"

def load(name):
    with open(f"{DATA}/{name}.json","r",encoding="utf-8") as f:
        return json.load(f)

def main():
    ok = True
    # Load key tables
    elements = {x["id"]:x for x in load("elements")}
    modalities = {x["id"]:x for x in load("modalities")}
    colors = {x["id"]:x for x in load("colors")}
    signs = {x["id"]:x for x in load("signs")}
    houses = {x["id"]:x for x in load("houses")}
    bodies = {x["id"]:x for x in load("bodies")}
    aspects = {x["id"]:x for x in load("aspects")}
    tags = {x["id"]:x for x in load("tags")}
    sources = {x["id"]:x for x in load("sources")}

    def ref_check(arr, field, table, table_name):
        nonlocal ok
        for obj in arr:
            vals = obj.get(field, [])
            if isinstance(vals, str): vals = [vals]
            for v in vals:
                if v not in table:
                    ok = False
                    print(f"[REF] {field}='{v}' missing in {table_name} for id={obj.get('id')}", file=sys.stderr)

    # Check signs
    sign_arr = list(signs.values())
    for s in sign_arr:
        if s["element_id"] not in elements: ok=False; print(f"[REF] sign.element_id '{s['element_id']}' invalid ({s['id']})", file=sys.stderr)
        if s["modality_id"] not in modalities: ok=False; print(f"[REF] sign.modality_id '{s['modality_id']}' invalid ({s['id']})", file=sys.stderr)
        if s.get("default_color_id") and s["default_color_id"] not in colors: ok=False; print(f"[REF] sign.default_color_id invalid ({s['id']})", file=sys.stderr)
        for fld in ["domicile_candidates","exaltation_candidates","detriment_candidates","fall_candidates"]:
            ref_check([s], fld, bodies, "bodies")

    # Houses angularity sanity
    house_arr = list(houses.values())
    for h in house_arr:
        if h["angularity"] not in ("angular","succedent","cadent"):
            ok=False; print(f"[VAL] house.angularity invalid ({h['id']})", file=sys.stderr)

    # Decans and degrees
    decans = load("decans")
    degrees = load("degrees")
    ref_check(decans, "sign_id", signs, "signs")
    ref_check(degrees, "sign_id", signs, "signs")
    ref_check(degrees, "dwad_sign_id", signs, "signs")

    # Interpretations referential integrity (where present)
    interps = load("interpretations")
    for it in interps:
        if "sign_id" in it and it["sign_id"] and it["sign_id"] not in signs:
            ok=False; print(f"[REF] interpretations.sign_id invalid ({it['id']})", file=sys.stderr)
        if "house_id" in it and it["house_id"] and it["house_id"] not in houses:
            ok=False; print(f"[REF] interpretations.house_id invalid ({it['id']})", file=sys.stderr)
        if "planet_id" in it and it["planet_id"] and it["planet_id"] not in bodies:
            ok=False; print(f"[REF] interpretations.planet_id invalid ({it['id']})", file=sys.stderr)
        if "other_planet_id" in it and it["other_planet_id"] and it["other_planet_id"] not in bodies:
            ok=False; print(f"[REF] interpretations.other_planet_id invalid ({it['id']})", file=sys.stderr)
        if "aspect_id" in it and it["aspect_id"] and it["aspect_id"] not in aspects:
            ok=False; print(f"[REF] interpretations.aspect_id invalid ({it['id']})", file=sys.stderr)

    if ok:
        print("OK")
        return 0
    else:
        print("FAILED", file=sys.stderr)
        return 1

if __name__ == "__main__":
    raise SystemExit(main())
