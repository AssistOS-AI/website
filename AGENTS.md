# website — Static Site

Static documentation/website assets.

## Reading order

1. Parent `~/work/file-parser/AGENTS.md` for workspace conventions.
2. `README.md` here for project intent.
3. `docs/index.html` for the film and documentation map, then `docs/wiki.html` for canonical terminology.
4. `docs/specs/matrix.md` and `docs/specs/DS001-coding-style.md` for publishing, source organization, and validation rules.

## Documentation contracts

Preserve the workplace film, installation guidance, fixed research embed catalog, and Whitepaper reader. Whitepaper chapter files are fragments injected into the reader, not standalone pages; resolve their links in the host reader context. Keep historical articles and archived research intact. The static website does not implement the agent behavior described by linked component documentation.

Update HTML documentation and affected specifications together when browser workflows change. Specifications use exactly `title` and `summary` frontmatter fields and only `Introduction` and `Core Content` as top-level content sections. Keep prose unwrapped and rendered text at its containing box's full width. Primary navigation destinations belong inside header submenus with outside-click and Escape handling.

## Commit policy

Inherits workspace commit policy (no AI attribution). See `~/work/file-parser/AGENTS.md`.
