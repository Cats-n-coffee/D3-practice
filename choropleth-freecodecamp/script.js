async function draw() {
    // Map data
    const mapData = await d3.json('us-counties.json');
    const feature = topojson.feature(mapData, mapData.objects.counties)

    // Education data
    const educData = await d3.json('us-education.json');
    const educAccessor = d => d.bachelorsOrHigher;

    // Containers dimensions
    const dimensions = {
        width: 1200,
        height: 1000,
        margin: 50
    }

    dimensions.containerWidth = dimensions.width - dimensions.margin * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margin * 2;

    // Scale
    const colorScale = d3.scaleQuantize()
        .domain(d3.extent(educData, educAccessor))
        .range(d3.schemeBlues[8])

    // Draw images
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margin}, ${dimensions.margin})`)

    const path = d3.geoPath()

    container.selectAll('path')
        .data(feature.features)
        .join('path')
        .attr('d', path)
        //.attr('transform', 'scale(0.82, 0.62)')
        .attr('class', 'county')
        .attr('data-id', d => d.id)
        .data(educData)
}

draw();

// https://github.com/borntofrappe/FreeCodeCamp-Choropleth-Map

// https://stackoverflow.com/questions/17817849/d3-js-how-to-join-data-from-more-sources