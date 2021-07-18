async function draw() {
    // Education data
    const educData = await d3.json('us-education.json');
    const educAccessor = d => d.bachelorsOrHigher;

    // Combined data
    async function combineData() {
        let data = educData;
        const mapData = await d3.json('us-counties.json');
        for (let j = 0; j < data.length; j += 1) {
            let item = data[j];
            let fips = item.fips;

            let geometries = mapData.objects.counties.geometries;
            for (let i = 0; i < geometries.length; i += 1) {
                let countyId = geometries[i].id;
 
                if (fips === countyId) {
                    geometries[i] = {...geometries[i], ...item}
                    break;
                }
            }
        }
        return mapData;
    }

    const data = await combineData();

    const feature = topojson.feature(data, data.objects.counties)

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
        .range(d3.schemeBlues[5])
console.log(d3.schemeBlues[5])
    // Tooltip
    const tooltip = d3.select('#tooltip');
    
    // Draw images
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margin + 30}, ${dimensions.margin})`)

    const path = d3.geoPath()

    container.selectAll('path')
        .data(feature.features)
        .join('path')
        .attr('d', path) 
        .attr('class', 'county')
        .attr('data-id', d => d.id)
        .attr('data-county', (d, i) => data.objects.counties.geometries[i].area_name)
        .attr('data-state', (d, i) => data.objects.counties.geometries[i].state)
        .attr('data-percent', (d, i) => data.objects.counties.geometries[i].bachelorsOrHigher)
        .attr('fill', (d, i) => colorScale(data.objects.counties.geometries[i].bachelorsOrHigher))
        .attr('stroke', 'grey')
        .on('mouseenter', function(event, datum) {
            tooltip.style('display', 'block')
                .style('top', `${event.layerY - 80 }px` )
                .style('left', `${event.layerX - 100 }px`)

            tooltip.select('.tooltip-county span')
                .text(this.getAttribute("data-county"))
                
            tooltip.select('.tooltip-state span')
                .text(this.getAttribute("data-state"))

            tooltip.select('.tooltip-percent span')
                .text(this.getAttribute("data-percent"))
        })
        .on('mouseleave', function(event, datum) {
            tooltip.style('display', 'none')
        })

    // Legend
    const legendData = {
        values: [0, 20, 40, 60, 80, 100],
        colors: ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"]
    }

    const legend = svg.append('g')
        .classed('legend', true)
        .attr('transform', `translate(${dimensions.width / 2 - dimensions.margin * 2})`)
    
    legend.selectAll('rect')
        .data(legendData.colors)
        .join('rect')
        .attr('width', 40)
        .attr('height', 20)
        .attr('x', (d, i) => (i + 1) * 40)
        .attr('y', 0)
        .attr('fill', d => d)
    legend.selectAll('text')
        .data(legendData.values)
        .join('text')
        .attr('x', (d, i) => (i + 1) * 40 - 6)
        .attr('y', 40)
        .attr('fill', 'black')
        .text((d, i) => d + "%")
        .style('font-size', '.8rem')
}

draw();

// https://github.com/borntofrappe/FreeCodeCamp-Choropleth-Map

// https://stackoverflow.com/questions/17817849/d3-js-how-to-join-data-from-more-sources

// https://livebook.manning.com/book/d3-js-in-action/chapter-11/ch11ex16
// https://observablehq.com/@didoesdigital/about-map-data-geojson-and-topojson-with-d3
// https://observablehq.com/@didoesdigital/about-choropleth-maps?collection=@didoesdigital/journal-getting-started-with-data-viz-collection