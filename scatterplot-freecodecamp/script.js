async function draw(){
    // Dataset and accessors
    const dataset = await d3.json('data.json');
    console.log(dataset)
    const xAccessor = d => d.Year;
    const yAccessor = d => d.Time.replace(':', '.');

    // Chart dimensions
    const dimensions = {
        width: 800,
        height: 700,
        margin: 50
    }

    dimensions.containerWidth = dimensions.width - dimensions.margin * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margin * 2;

    // Scales
    const xScale = d3.scaleLinear()
        .domain([(d3.min(dataset, xAccessor) - 1), (d3.max(dataset, xAccessor) + 1)])
        .range([0, dimensions.containerWidth])

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([0, dimensions.containerHeight])

    // Draw the images/containers
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margin}, ${dimensions.margin})`)

    // Draw the shapes
    container.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('cy', d => yScale(yAccessor(d)))
        .attr('r', 8)
        .attr('fill', d => d.Doping === "" ? 'blue' : 'red')
        .attr('stroke', 'black')

    const xAxis = d3.axisBottom(xScale)
        .ticks(12)
        .tickFormat(d => d)

    const yAxis = d3.axisLeft(yScale)
        .ticks(10)
        .tickFormat(d => d.toFixed(2).replace('.', ':'))

    const xAxisGroup = container.append('g')
        .call(xAxis)
        .style('transform', `translateY(${dimensions.containerHeight}px)`)

    const yAxisGroup = container.append('g')
        .call(yAxis)

}
draw()