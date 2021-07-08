async function draw() {
    // Dataset and accessors
    const dataset = await d3.json('data.json');

    const xAccessor = d => d;
    const yAccessor = d => d;

    // Dimensions (see below draw function for calculations)
    const dimensions = {
        width: 1148,
        height: 580,
        margin: 50
    }

    dimensions.containerWidth = dimensions.width - dimensions.margin * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margin * 2;

    // Draw the images
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const container = svg.append('g')
        .style('transform', `translate(${dimensions.margin + 15}, ${dimensions.margin})`)

    
}

draw();

// Dataset span 262 years --> 1 year = 4px --> 262 * 4 = 1048px wide
// Dataset shows every month of every year --> 1 month = 40px --> 12 * 40 = 480px high