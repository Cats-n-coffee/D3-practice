async function draw() {
    const data = await d3.json('data.json');
    const dataset = data.data;

    const dimensions = { 
        width: 1000,
        height: 800,
        margin: 40
    }
    console.log(dataset)

    const svg = d3.select('#chart') // select the only element we have on the HTML
        .append('svg') // append it the svg
        .attr('width', dimensions.width) // set the svg width
        .attr('height', dimensions.height) // set the svg height
    
    const bars = svg.append('g') // append a 'g' to the svg
        .selectAll('rect') // this line will keep the 'rect' inside the 'g'
        .data(dataset) // bind elements to the data
        .join('rect') // with only one string specified, it returns the enter selection, equivalent to append
        .attr('width', 5)
        .attr('height', 20)
        .attr('x', 50)
        .attr('y', 30)
        .attr('fill', 'red')
}

draw()