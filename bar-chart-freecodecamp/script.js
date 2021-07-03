async function draw() {
    const data = await d3.json('data.json');
    const dataset = data.data;

    const xAccessor = item => parseInt(item[0].substring(0, 4));
    const yAccessor = item => item[1]; // original yAccessor before making the bins
    const yAccessorBin = items => average(items);

    const average = (arr) => {
        let itemNumber = arr.length;
        let total = arr.reduce((acc, current) => (acc + current[1]),0)
        return total / itemNumber;
    }

    const dimensions = { 
        width: 800,
        height: 700,
        margin: 50
    }

    dimensions.containerWidth = dimensions.width - dimensions.margin * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margin * 2;

    // Scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.containerWidth])

    const bin = d3.bin()
        .domain(xScale.domain())
        .value(xAccessor)
        .thresholds(68) // ----> BEWARE when using the nice() method on the scale we are deriving the domain from

    const newDataset = bin(dataset)
    const padding = 1;
    console.log('new data', newDataset)

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(newDataset, yAccessorBin)])
        .range([dimensions.containerHeight, 0])

        console.log(d3.max(newDataset, yAccessorBin))

    // Containers
    const svg = d3.select('#chart') // select the only element we have on the HTML
        .append('svg') // append it the svg
        .attr('width', dimensions.width) // set the svg width
        .attr('height', dimensions.height) // set the svg height
    
    const container = svg.append('g') // append a 'g' to the svg    
        .attr('transform', `translate(${dimensions.margin + 15}, ${dimensions.margin})`)

    // Tooltip
    const tooltip = d3.select('#tooltip')

    //const enterTransition = d3.transition().duration(500);

    container.selectAll('rect') // this line will keep the 'rect' inside the 'g'
        .data(newDataset) // bind elements to the data
        .join(// with only one string specified, it returns the enter selection, equivalent to append
            enter => enter.append('rect')
                .attr('x', d => xScale(d.x0)) // apply the scale to each item (d), and give it the accessor, which will target its specified field
                .attr('y', dimensions.containerHeight) // example: current item(d), apply the yScale on item[1] (yAccessor(d))
                .attr('width', 9)
                .attr('height', 0) // find height by subtracting y value from height of the chart
                .attr('fill', '#1576b3')
                .attr('data-year', d => `${d.x0}-${d.x1}`)
                .attr('data-gdp', d => yAccessorBin(d).toFixed(2))
        ) 
        .on('mouseenter', function(event, datum) {
            d3.select(this)
                .attr('fill', '#fc9608')

            tooltip.style('display', 'block')
                .style('top', yScale(yAccessorBin(datum))+ 50 + 'px')
                .style('left', xScale((datum.x0 + datum.x1) / 2) + 90 + 'px')

            tooltip.select('.tooltip-years span')
                .text(`${datum.x0}-${datum.x1}`)

            tooltip.select('.tooltip-gdp span')
                .text(yAccessorBin(datum).toFixed(2))
        })
        .on('mouseleave', function(event, datum) {
            d3.select(this)
                .attr('fill', '#1576b3')
            tooltip.style('display', 'none')
        })
        .transition()
        .duration(1000)
        .attr('x', d => xScale(d.x0)) // apply the scale to each item (d), and give it the accessor, which will target its specified field
        .attr('y', d => yScale(yAccessorBin(d))) // example: current item(d), apply the yScale on item[1] (yAccessor(d))
        .attr('width', 9)
        .attr('height', d => dimensions.containerHeight - (yScale(yAccessorBin(d)))) // find height by subtracting y value from height of the chart
        .attr('fill', '#1576b3')
        .attr('data-year', d => `${d.x0}-${d.x1}`)
        .attr('data-gdp', d => yAccessorBin(d).toFixed(2))
        

    const xAxis = d3.axisBottom(xScale)
        .ticks(10)
        .tickFormat(d => d)

    const xAxisGroup = container.append('g')
        .call(xAxis)
        .style('transform', `translateY(${dimensions.containerHeight}px)`)

    // Legend x axis
    xAxisGroup.append('text')
        .classed('legends', true)
        .attr('x', dimensions.containerWidth / 2)
        .attr('y', dimensions.margin)
        .attr('fill', 'black')
        .text('Years')

    const yAxis = d3.axisLeft(yScale)
        .ticks(15)

    const yAxisGroup = container.append('g')
        .call(yAxis)

    yAxisGroup.append('text')
        .classed('legends', true)
        .attr('x', -dimensions.containerHeight / 2 + dimensions.margin)
        .attr('y', -dimensions.margin)
        .style('transform', `rotate(270deg)`)
        .attr('fill', 'black')
        .text('Dollars (in billions)')
        

}

draw()