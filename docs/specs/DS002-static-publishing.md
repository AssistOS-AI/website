---
title: DS002-static-publishing
summary: Defines the published static root, asset resolution, chapter fragments, and external research embeds.
---

## Introduction

The website publishes `docs/` as its static root. [Research embeds](wiki.html#definition-research-embed) and [Whitepaper chapters](wiki.html#definition-whitepaper-reader) are two distinct reading paths.

## Core Content

Navigation and asset links must work at the published root and beneath a repository path prefix. Whitepaper pages use `../` when linking to top-level website files. Reader chapter identifiers determine fetched fragment filenames and URL hashes. The full and embedded readers must preserve the same chapter content and stable identifiers.

The research page must select its external iframe from the fixed `tool` key catalog in `script.js`. Arbitrary query data must not become an iframe destination. The external documentation host owns the displayed component contracts. Network or embedding restrictions can prevent that remote page from appearing; local website serving does not establish remote availability.

Keep the static Markdown marker at `docs/.nojekyll`. The specification loader must fetch files from `docs/specs/` and open the matrix through `specsLoader.html?spec=matrix.md`. Wiki links rendered by this loader resolve relative to the loader page.
