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
        .attr('height', dimensions.height);

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margin + 15}, ${dimensions.margin})`);

    const tooltip = d3.select('#tooltip');

    // Draw the shapes
    container.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('cy', d => yScale(yAccessor(d)))
        .attr('r', 9)
        .attr('fill', d => d.Doping === "" ? 'green' : 'red')
        .attr('stroke', 'grey')
        .attr('data-color', d => d.Doping === "" ? 'green' : 'red')
        .attr('data-year', d => xAccessor(d))
        .attr('data-time', d => yAccessor(d))
        .attr('data-doping', d => d.Doping)
        .on('mouseenter', function(event, datum) {
            d3.select(this)
                .attr('fill', 'grey')

            tooltip.style('display', 'block')
                .style('top', yScale(yAccessor(datum)) + 40 + 'px')
                .style('left', xScale(xAccessor(datum)) + 60 + 'px')

            tooltip.select('.tooltip-name span')
                .text(datum.Name)

            tooltip.select('.tooltip-year span')
                .text(datum.Year)

            tooltip.select('.tooltip-time span')
                .text(datum.Time)

            tooltip.select('.tooltip-doping span')
                .text(datum.Doping === "" ? "No doping was reported" : datum.Doping)
        })
        .on('mouseleave', function(event, datum) {
            d3.select(this)
                .attr('fill', this.getAttribute("data-color") )
            
            tooltip.style('display', 'none')
        })

    // Axes
    const xAxis = d3.axisBottom(xScale)
        .ticks(12)
        .tickFormat(d => d)

    const yAxis = d3.axisLeft(yScale)
        .ticks(10)
        .tickFormat(d => d.toFixed(2).replace('.', ':'))

    const xAxisGroup = container.append('g')
        .call(xAxis)
        .style('transform', `translateY(${dimensions.containerHeight}px)`)

    xAxisGroup.append('text')
        .classed('axisLabel', true)
        .attr('x', dimensions.containerWidth / 2)
        .attr('y', dimensions.margin)
        .attr('fill', 'black')
        .text('Years')

    const yAxisGroup = container.append('g')
        .call(yAxis)

    yAxisGroup.append('text')
        .classed('axisLabel', true)
        .attr('x', -dimensions.containerHeight / 2 + dimensions.margin)
        .attr('y', -dimensions.margin)
        .style('transform', 'rotate(270deg)')
        .attr('fill', 'black')
        .text('Time in minutes')

    // Legend
    const legend = container.append('g')
        .classed('legend', true)
        .style('transform', 'translateX(500px)')
    
    const redLegend = legend.append('g')
    redLegend.append('rect') // Red rectangle
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', 'green')
        .attr('stroke', 'grey')
    redLegend.append('text') // Red legend text
        .attr('x', 30)
        .attr('y', 15)
        .attr('fill', 'black')
        .text('No doping allegations')

    const greenLegend = legend.append('g')
    greenLegend.append('rect') // Green rectangle
        .attr('x', 0)
        .attr('y', 25)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', 'red')
        .attr('stroke', 'grey')
    greenLegend.append('text') // Green legend text
        .attr('x', 30)
        .attr('y', 40)
        .attr('fill', 'black')
        .text('Doping allegations')


}
draw()