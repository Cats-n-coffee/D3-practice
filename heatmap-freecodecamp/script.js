async function draw() {
    // Dataset and accessors
    const data = await d3.json('data.json');
    const dataset = data.monthlyVariance;
    const baseTemp = data.baseTemperature;

    const yearAccessor = d => d.year;
    const monthAccessor = d => d.month;
    // Calculates the variance
    const accessor = d => d.variance + baseTemp;

    // Dimensions (see below draw function for calculations)
    const dimensions = {
        width: 1148,
        height: 580,
        margin: 50
    }

    dimensions.containerWidth = dimensions.width - dimensions.margin * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margin * 2;

    // Scales
    const colorScale = d3.scaleLinear() // or do we need scaleQuantize?
        .domain(d3.extent(dataset, accessor)) // --> Needs to maintain the original order of the set?
        .range(['blue', 'yellow', 'orange', 'red']) // d3.schemeRdBu[8]

    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yearAccessor))
        .range([0, dimensions.containerWidth])

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, monthAccessor))
        .range([dimensions.containerHeight, 0])

    // Draw the images
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const container = svg.append('g')
        .style('transform', `translate(${dimensions.margin + 15}, ${dimensions.margin})`)

    container.selectAll('rect')
        .data(dataset)
        .join('rect')
        .attr('width', 4)
        .attr('height', 40)
        .attr('x', d => xScale(yearAccessor(d))) // calculate the position of the box
        .attr('y', d => yScale(monthAccessor(d))) // calculate the position of the box
        .attr('fill', d => colorScale(accessor(d))) // remember to add the accessor for color scale as well

    const xAxis = d3.axisBottom(xScale)
        .ticks(20)
        .tickFormat(d => d)
    const xAxisGroup = container.append('g')
        .call(xAxis)
        .style('transform', `translateY(${dimensions.containerHeight}px)`)

    const yAxis = d3.axisLeft(yScale)
        .ticks(12)
    const yAxisGroup = container.append('g')
        .call(yAxis)

}// https://ashlynnpai.github.io/journal/2018/02/14/heatmap-with-d3-v4.html

draw();

// Dataset span 262 years --> 1 year = 4px --> 262 * 4 = 1048px wide
// Dataset shows every month of every year --> 1 month = 40px --> 12 * 40 = 480px high