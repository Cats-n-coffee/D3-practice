async function draw() {
    // Map data
    const mapData = await d3.json('us-counties.json');
    const feature = topojson.feature(mapData, mapData.objects.counties)

    // Containers dimensions
    const dimensions = {
        width: 1200,
        height: 1000,
        margin: 50
    }

    dimensions.containerWidth = dimensions.width - dimensions.margin * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margin * 2;

    // Draw images
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margin}, ${dimensions.margin})`)

    const path = d3.geoPath()
    console.log(path(feature))
    container.selectAll('path')
        .data(feature.features)
        .join('path')
        .attr('d', path)
        //.attr('transform', 'scale(0.82, 0.62)')
        .attr('class', 'county')
}

draw();

// https://github.com/borntofrappe/FreeCodeCamp-Choropleth-Map