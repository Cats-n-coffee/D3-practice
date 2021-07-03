# D3 Practice

This repository holds different practice project for D3.js.

**Some datasets are copied from FreeCodeCamp.**

## Bar chart

Structure:
- Append `svg` (width, height)
- Append container (`g`)
- Append bars to the container (`rect`)
- Create each axis
- Append each axis **in its own group** (`g`) and call it

The bars were overflowing from the group element that was being stretched. The bottom axis was placed on top of the chart.
Solution: corrected the height of the bars by subtracting y value from height of the chart