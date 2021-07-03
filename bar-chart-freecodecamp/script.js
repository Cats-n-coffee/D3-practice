async function draw() {
    const data = await d3.json('data.json');
    const dataset = data.data;

    const xData = dataset.map(item => item[0]); // dates --> string format
    const yData = dataset.map(item => item[1]); // numbers --> floats

    const xAccessor = item => parseInt(item[0].substring(0, 4));
    const yAccessor = item => item[1];

    // console.log(xData)
    // console.log(yData)

    const dimensions = { 
        width: 800,
        height: 700,
        margin: 40
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
        .domain([0, d3.max(newDataset, yAccessor)[1]])
        .range([dimensions.containerHeight, 0])

        console.log(d3.max(newDataset, yAccessor)[1])

    const svg = d3.select('#chart') // select the only element we have on the HTML
        .append('svg') // append it the svg
        .attr('width', dimensions.width) // set the svg width
        .attr('height', dimensions.height) // set the svg height
    
    const container = svg.append('g') // append a 'g' to the svg
        .classed('group', true)    
        .attr('width', dimensions.containerWidth)
        .attr('height', dimensions.containerHeight)    
        .attr('transform', `translate(${dimensions.margin}, ${dimensions.margin})`)

    container.selectAll('rect') // this line will keep the 'rect' inside the 'g'
        .data(newDataset) // bind elements to the data
        .join('rect') // with only one string specified, it returns the enter selection, equivalent to append
        .attr('x', d => xScale(d.x0)) // apply the scale to each item (d), and give it the accessor, which will target its specified field
        .attr('y', d => yScale(yAccessor(d[1]))) // example: current item(d), apply the yScale on item[1] (yAccessor(d))
        .attr('width', 6)
        .attr('height', d => yAccessor(d[1]) / 16)
        .attr('fill', '#325ecf')

    const xAxis = d3.axisBottom(xScale)
        .ticks(10)

    const xAxisGroup = container.append('g')
        .call(xAxis)
        .style('transform', `translateY(${dimensions.containerHeight + 20}px)`)

    const yAxis = d3.axisLeft(yScale)
        .ticks(15)

    const yAxisGroup = container.append('g')
        .call(yAxis)
        

}

draw()