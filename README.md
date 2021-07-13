# D3 Practice

This repository holds different practice project for D3.js.

**Datasets are copied from FreeCodeCamp.**

## Bar chart
This bar chart shows the USA Gross Domestic Product from 1947-2015. The dataset has the GDP for every year, for the months of January, April, July and October. The chart shows the GDP for every year (average of all 4 data points in a given year).

Structure:
- Append `svg` (width, height)
- Append container (`g`)
- Append bars to the container (`rect`)
- Create each axis
- Append each axis **in its own group** (`g`) and call it

Considering the amount of data for the chart, we created 'bins' to gather all the data from the same year together, and calculated the average/used the x0-x1 to build the chart. Bins are arrays (of arrays in this case) with two extra properties added for the high and low. 
When using bins, the yAccessor had to be redefined to better describe the data present in each bin (doing an average again).

The bars were overflowing from the group element that was being stretched. The bottom axis was placed on top of the chart.
Solution: corrected the height of the bars by subtracting the y value from height of the chart.

## Scatterplot
This scatterplot shows the 35 fastest times at Alpes d'Huez stage. It depicts the time and the year for each performance, and shows which performance/cyclist reported/was reported using drugs for this performance.
The same structure as the previous chart applies.
the legend was made by using a group (`g`) for the legend, and one `g` for each color with its text. Each `g` has a rectangle `rect` for the color, and a `text` element.

To allow for more space for the dots at both end ranges on the X axis (year 1994 and 2015), we substracted 1 from 1994 and added 1 to 2015. By doing this,the dots corresponding to these two years are further from the edges of the chart, and those from 1994 are away from the Y axis.

## Heatmap
This heatmap shows the temperature at the surface of the planet (in-land) from 1753 - 2015. The base temperature of 8.66 Celcius is used. The map shows the variance from this base temperature, ranging from blue colors (colder) to orange/red colors (warmer). One could argue that according to this dataset, land-surface has gotten warmer over the years.
The most challenging part was to figure out which scale to use.
- X axis (years) --> scaleLinear (might have been able to use scaleTime?)
- Y axis (months) --> scaleBand: use for data that is *ordinal* (aka order as in 1st, 2nd, 3rd ...) and *categorical* (example: months, days of the week, ...). 
- Colors (variance) --> scaleQuantize: transforms continuous data to discrete data. We need the data to be split into chunks, that will put data into groups and associate a color with it.

## Choropleth