---
title: DS003-main-behavior
summary: Defines workplace-film playback, installation guidance, research embedding, and Whitepaper reading.
---

## Introduction

Visitors use the AssistOS website to understand the workspace concept, install the components, and read project research. Its central behaviors are static presentation and reading flows.

## Core Content

### Main Behavior Components

| Name | Explanation |
| --- | --- |
| Workplace film | Visitors play or inspect a narrated concept presentation about shared work with virtual workers. |
| Installation guidance | Visitors follow Ploinky setup and Explorer startup instructions with local browser entry points. |
| Research embedding | Visitors choose a component and open its documentation through a fixed external catalog. |
| Whitepaper reading | Readers select chapters, move between them, and share chapter-specific links. |

### Workplace film

A visitor starts the [workplace film](wiki.html#definition-workplace-film) or selects a scene. The film must synchronize the visible scene, captions, progress, and playback controls. Optional browser speech must follow the active scene without replacing the visible transcript. Playback must stop advancing when the document is hidden or the film is outside its visible region, and respect the reduced-motion preference. The depicted Robots and tasks are a concept narrative rather than live agent execution.

### Installation guidance

A visitor opens Installation to prepare Ploinky and start Explorer in a workspace. The page must show the repository checkout and setup commands, `ploinky start explorer`, the local dashboard and Explorer URLs, and `ploinky status` and `ploinky stop`. It must link maintained component instructions. The website publishes instructions without executing these commands or provisioning a workspace.

### Research embedding

A visitor chooses a component in Research or opens `research.html?tool=<key>`. The page must map recognized keys to the catalog's fixed documentation URLs and show the named iframe with an external link. Unknown keys must leave the component directory available. [Research embedding](wiki.html#definition-research-embed) must not construct arbitrary destinations from query data; the selected remote project owns its documentation and runtime claims.

### Whitepaper reading

A reader selects a chapter in the full or [embedded Whitepaper reader](wiki.html#definition-whitepaper-reader). The reader must fetch the matching fragment, show its content, update chapter selection and the URL hash, and provide previous and next chapter controls. A load failure must show a readable error. Reader-context links must resolve from the host document, and late fetch results must not replace a newer chapter selection. Chapter text remains research content rather than a guarantee that this website implements its described architecture.
