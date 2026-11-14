# ÉTER — Visualization and Scientific Integrity Policy

**Version:** 1.0  
**Project:** Morley / ÉTER — NASA Space Apps Challenge 2026

## Rule 1 — One consistent interface

All astronomical data sources must use the same visual layout, navigation controls, coordinate display, and interaction patterns.

Switching between AllWISE and SPHEREx must not unexpectedly replace the interface or reset the user's selected sky position.

## Rule 2 — Consistent sky projection

- Use Hammer-Aitoff (`AIT`) for the default all-sky view.
- Use a suitable local projection (`SIN` or `TAN`) for detailed sky regions.
- Preserve the sky center, coordinate system, field of view, and orientation whenever technically compatible.
- Never stretch astronomical imagery merely to fill a rectangular container.

The projection may change when switching between all-sky and local exploration, but not merely because the image source changes.

## Rule 3 — Explicit data source selection

The user must always know which astronomical source is being displayed.

- **AllWISE:** contextual sky exploration.
- **SPHEREx DR1 HiPS:** spectral sky visualization.
- **SPHEREx Spectral Images:** individual observations for temporal exploration.
- **Gaia DR3:** astrometric reference and catalog-predicted positions.

Changing the active scientific source must be intentional and visibly identified.

## Rule 4 — Separate time from wavelength

Temporal and spectral exploration are independent.

- The temporal slider changes observation dates.
- The spectral selector changes wavelength or channel.
- The 102 SPHEREx spectral channels must never be interpreted as 102 observation dates.
- Disable or clearly identify unavailable controls.

## Rule 5 — Preserve scientific differences

Maintain a consistent visual style without modifying scientific data to make different observations look identical.

Every view must identify its source, observation or release, wavelength when relevant, and display processing.

When comparing epochs scientifically, use compatible wavelengths, WCS, coverage, masks, and documented intensity scaling.

## Rule 6 — Distinguish evidence from predictions

Use clear and persistent labels:

- **Observed:** measured astronomical image or validated measurement.
- **Catalog prediction:** position calculated from catalog information.
- **Simulation:** synthetic or illustrative data.
- **Visualization:** display-only transformation or composite.

Never label a catalog trajectory as an observed detection.

## Rule 7 — Stable camera and image geometry

The selected celestial position must remain stable while switching data layers or observation dates.

For temporal comparisons, align the images using astronomical WCS information before displaying them.

Preserve image aspect ratios. Do not use arbitrary stretching, cropping, or canvas resizing that changes the apparent motion of objects.

## Rule 8 — No misleading image enhancement

Color maps, brightness adjustments, and contrast changes must be distinguishable from actual spectral measurements.

For temporal comparisons, use fixed or shared display scaling when practical and disclose any adjustments.

Display-only corrections must not overwrite the original scientific products.

## Rule 9 — Clear provenance and missing data

Show the source, release, observation time, wavelength, and relevant quality limitations when available.

If a source or observation is unavailable, show an explicit unavailable state rather than silently substituting synthetic data or unrelated observations.

## Rule 10 — Progressive implementation

The application must remain functional even if an advanced data layer cannot be loaded.

AllWISE serves as the default sky background. SPHEREx spectral visualization and temporal observations are enabled independently after compatibility and scientific validation.

Every new visualization feature must preserve the established ÉTER interface and these scientific-integrity rules.