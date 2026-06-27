# Open Source License Options (MIT vs GNU GPL)

This document compares two license options for OIAA Direct before introducing Sentry.

## Why this matters

Adding an explicit open source license clarifies:

- How others can use and modify this project
- Whether derivative works must remain open source
- Contributor and organization expectations

Without a license file, others technically have very limited rights to reuse the code.

## Option 1: MIT License

### Pros

- Very permissive and simple
- Easy for companies and nonprofits to adopt
- Low legal friction for integrations, forks, and plugins
- Common and widely understood across JavaScript ecosystems

### Cons

- Allows closed-source forks and proprietary redistribution
- Does not require improvements to be contributed back

### Best fit when

- The goal is broad adoption and minimal barriers
- The project team is comfortable with commercial/proprietary reuse

## Option 2: GNU GPL (typically GPL-3.0-or-later)

### Pros

- Strong copyleft: derivative works must remain open source under GPL
- Encourages sharing improvements with the community
- Protects against proprietary relicensing of derivative distributions

### Cons

- Higher legal/compliance overhead for adopters
- Some organizations avoid GPL due to policy constraints
- Can reduce adoption in mixed-license or proprietary environments

### Best fit when

- The goal is to ensure downstream derivatives remain open source
- The project prioritizes reciprocity over maximum adoption

## Recommendation framing for this project

If your priority is broad ecosystem adoption and low-friction integration, MIT is usually the pragmatic default.

If your priority is ensuring derivative distributions stay open source, GPL-3.0-or-later is the stronger policy tool.

## Proposed decision process

1. Confirm project goals: maximize adoption vs enforce copyleft reciprocity
2. Confirm compatibility with dependencies and WordPress distribution expectations
3. Approve one license in a follow-up PR that adds a top-level `LICENSE` file
4. Update `README.md` to reference the final license

## Note about Sentry

Sentry usage itself does not require choosing MIT vs GPL specifically, but having an explicit OSI-approved license improves clarity for contributors and downstream users.