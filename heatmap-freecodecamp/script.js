async function draw() {
    // Dataset and accessors
    const data = await d3.json('data.json');
    const dataset = data.monthlyVariance;
    const baseTemp = data.baseTemperature;

    const yearAccessor = d => d.year;
    const monthAccessor = d => d.month;
    // Calculates the variance
    const accessor = d => d.variance;

    // Dimensions (see below draw function for calculations)
    const dimensions = {
        width: 1148,
        height: 480,
        margin: 50
    }

    dimensions.containerWidth = dimensions.width - dimensions.margin * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margin * 2;

    // Scales
    let colorSchema = (d3.schemeRdYlBu[11]).reverse();
    const colorScale = d3.scaleQuantize() // Creates 'buckets' and assigns a color
        .domain(d3.extent(dataset, accessor)) 
        .range(colorSchema); 

    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yearAccessor))
        .range([0, dimensions.containerWidth]);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const yScale = d3.scaleBand() // Months are ordered (1, 2, ...12) and their own category (month)
        .domain(months)
        .range([0, dimensions.containerHeight]); // The range in this order (starting with 0) allows us to calculate the tooltip 'top' position in a simple manner

    // Draw the images
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margin + 15}, ${dimensions.margin})`);

    const tooltip = d3.select('#tooltip');

    container.selectAll('rect')
        .data(dataset)
        .join('rect')
        .attr('width', dimensions.containerWidth / (dataset.length / 12)) // Uses the container width and dataset length
        .attr('height', dimensions.containerHeight / 12) // Uses the container height and 12 months
        .attr('x', d => xScale(yearAccessor(d))) // Determines the element's position on the X axis using the xScale and the year of the element (yearAccessor)
        .attr('y', d => yScale(months[d.month - 1])) // Determines the element's position on the Y axis using the yScale and the element's month from the array (using the index [d.month - 1])
        .attr('fill', d => colorScale(accessor(d))) // Remember to add the accessor for color scale as well, to access the element's variance
        .on('mouseenter', function(event, datum) {
            tooltip.style('display', 'block')
                .style('top', (datum.month * dimensions.containerHeight) / 12 + 70 + 'px') // Tooltip will always be on the same level above the hovered element
                .style('left', xScale(yearAccessor(datum)) + 70 +'px')

            tooltip.select('.tooltip-year span')
                .text(datum.year)

            tooltip.select('.tooltip-month span')
                .text(months[datum.month - 1]) // Renders the month in plain English

            tooltip.select('.tooltip-temp span')
                .text((datum.variance + baseTemp).toFixed(2))

            tooltip.select('.tooltip-variance span')
                .text(datum.variance)
        })
        .on('mouseleave', function(event, datum) {
            tooltip.style('display', 'none')
        });

    // Axes
    const xAxis = d3.axisBottom(xScale)
        .ticks(20)
        .tickFormat(d => d); // Removes the ','
    const xAxisGroup = container.append('g')
        .call(xAxis)
        .style('transform', `translateY(${dimensions.containerHeight}px)`);
    xAxisGroup.append('text')
        .attr('x', dimensions.containerWidth / 2)
        .attr('y', dimensions.margin)
        .attr('fill', 'black')
        .text('Years')
        .style('font-size', '1rem');

    const yAxis = d3.axisLeft(yScale)
        .ticks(12);
    const yAxisGroup = container.append('g')
        .call(yAxis);
    yAxisGroup.append('text')
        .attr('x', -dimensions.containerHeight / 2 + dimensions.margin)
        .attr('y', -dimensions.margin)
        .style('transform', 'rotate(270deg)')
        .attr('fill', 'black')
        .text('Months')
        .style('font-size', '1rem');

    // Legend
    const colorThresholds = colorScale.thresholds();
    console.log(colorThresholds)
    const legend = svg.append('g')
        .attr('transform', `translate(${dimensions.containerWidth / 2 - dimensions.margin * 3})`)
    legend.selectAll('rect')
        .data(colorSchema)
        .join('rect') // Adds each color as a rectangle
        .attr('x', (d, i) => 40 * i)
        .attr('y', 0)
        .attr('width', 40)
        .attr('height', 20)
        .attr('fill', d => d)
    legend.selectAll('text') // Adds the text for each reactangle
        .data(colorSchema)
        .join('text')
        .attr('x', (d, i) => 40 * i + 30)
        .attr('y', 30)
        .attr('fill', 'black')
        .text((d, i) => {
            const number = (colorThresholds[i] + baseTemp).toFixed(2)
            return isNaN(number) ? '' : number;
        })
        .style('font-size', '0.7rem')
}

draw();

// Dataset span 262 years --> 1 year = 4px --> 262 * 4 = 1048px wide
// Dataset shows every month of every year --> 1 month = 40px --> 12 * 40 = 480px high