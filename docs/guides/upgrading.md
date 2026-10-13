---
title: Upgrading and migration
section: upgrading
order: 10
description: Keep native entries and saves while adopting the docs site.
---

## Adopt the documentation pages

This rollout keeps the existing seven import paths, six namespaces, types, game rules and content. `api.html` remains an anchor index. New individual reference pages show imports, signatures and checked examples; local search works without a hosted service. Root `llms.txt` links the overview and `llms-full.txt` includes the full English pages. No version or release is cut by this branch.

## Move from another puzzle engine

A similar colour, match or falling-piece rule does not make states compatible. Translate your host’s intent into each native action rather than casting old states. Choose the correct goal discriminant, native row-major layout and stable ids. Keep assisted status and replay operations. Validate saved recordings with the same game’s decoder, and retain the original save if it rejects a future rules revision.

## Review authored content

A new ordering should retain ids and re-run witnesses; a new rules revision needs its own migration decision. Engine proof and human review remain distinct. The original [changelog](../../CHANGELOG.md) and [release acceptance](../design/ACCEPTANCE-AND-RELEASE.md) remain the sources for shipped changes. Japanese text added here needs review before release.
