---
title: DS001-coding-style
summary: Defines static HTML, CSS, browser script organization, and documentation validation.
---

## Introduction

The website uses plain HTML, CSS, and browser JavaScript. Preserve its existing static publishing model and component-specific assets.

## Core Content

`docs/script.js` owns shared navigation and research embeds. `docs/assets/js/workplace-film.js` owns film playback and optional browser speech. Reader scripts remain with their existing Whitepaper pages; chapter fragments stay under `docs/whitepaper/chapters/`. CSS lives under `docs/assets/css/`, with documentation-specific rules in `docs/styles.css`.

New standalone maintenance scripts must use dependency-free Node.js `.mjs` modules, `node:` built-ins, explicit relative import extensions, and async/await. Existing browser `.js` scripts do not require a Node module conversion. Do not add a build system or third-party library for routine static maintenance. Document any justified dependency at its owning scope before adding it.

Keep prose blocks unwrapped, heading anchors stable, and documentation text at the full width of its containing box. Top-level navigation controls must own submenus. Closing a menu with Escape must return focus to its trigger; an outside click must close the open menu.

Validate JavaScript syntax and local assets, specification metadata, matrix targets, and canonical Wiki links. Test menus and reader flows in a browser when changing their behavior. Chapter fragment links resolve in their reader document because the reader injects the fetched HTML. A path checker using the fragment's filesystem directory alone cannot validate those links. External embeds require their upstream hosts and are separate from local static serving checks.
