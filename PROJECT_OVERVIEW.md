# MRM Method Builder / Ion Pair Project – Overview

## 1. Goal

A web app that helps pesticide / environmental labs quickly build
GC-QQQ MRM methods:

- Paste a list of pesticide names (or CAS)
- Map them to our internal compound database
- Output ready-to-use MRM transition tables and GC method settings
- Provide RI → RT prediction based on user-supplied alkane RTs

Currently we focus on pesticide and environmental compounds.
Volatile compounds (and possibly other categories) may be added later.

## 2. Main Pages

- `/` – Landing page, product introduction
- `/generator` – Main MRM Method Builder (multi-step wizard)
  - Step 1: Paste compound list
  - Step 2: Select GC preset / method template
  - Step 3: RT prediction from RI + export results (CSV/TXT)

## 3. Data files (under /data)

- `compounds.json` – basic pesticide information (name, CAS, etc.)
- `transitions.csv` – MRM transitions for each compound
- `methods.json` – GC method templates (standard/fast, etc.)
- Other helper tables for RI and RT mapping

Note: the source Excel/CSV schema may change in the future
(new columns, different order, new categories like volatiles),
so schema-specific mapping should be kept in a dedicated layer,
not spread across UI components.

## 4. Current Status (when switching to Cursor)

- The project was partially built with Cursor / Claude Code.
- Layout and components exist, but some logic is incomplete.
- Some i18n / language-switch code exists but is not fully consistent.
- For now, the UI is **English only**. Old i18n code may be simplified
  to plain English strings when it gets in the way.
- We want Cursor to continue development WITHOUT throwing away existing work.

## 5. Priorities (high level)

1. Make the generator flow stable and usable end-to-end.
2. Ensure compound lookup + transition export works from local data.
3. Add better validation and clear error messages.
4. Only after that, polish UI and add more advanced features.

## 6. Future backend & payments (planned)

- Backend: Supabase (PostgreSQL + Auth)
- Use Supabase for:
  - user accounts / auth
  - storing projects, compound lists, and export history
  - storing subscription / payment-related metadata (when implemented)

Payments are not implemented yet. This is only a planned direction so that
AI assistants do not introduce random backend stacks.
