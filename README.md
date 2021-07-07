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

Considering the amount of data for the chart, we created 'bins' to gather all the data from the same year together, and calculated the average/used the x0-x1 to build the chart. Bins are arrays (of arrays in this case) with two extra properties added for the high and low. 
When using bins, the yAccessor had to be redefined to better describe the data present in each bin (doing an average again).

The bars were overflowing from the group element that was being stretched. The bottom axis was placed on top of the chart.
Solution: corrected the height of the bars by subtracting y value from height of the chart.

## Scatterplot
The same structure as the previous chart applies.
the legend was made by using a group (`g`) for the legend, and one `g` for each color with its text. Each `g` has a rectangle `rect` for the color, and a `text` element.

To allow for more space for the dots at both end ranges on the X axis (year 1994 and 2015), we substracted 1 from 1994 and added 1 to 2015. By doing this,the dots corresponding to these two years are further from the edges of the chart, and those from 1994 are away from the Y axis.