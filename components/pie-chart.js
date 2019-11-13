import React, { useEffect } from 'react'
import * as d3 from 'd3'
import { groupBy, sumBy } from 'lodash'

const PieChart = props => {
  const chartContainer = React.createRef()
  useEffect(() => {
    drawChart()
  }, [props.results])

  let svg

  const prepData = () => {
    const groups = groupBy(props.results.items, item => item.fields.Category.id)

    return Object.entries(groups).map(([categoryId, group]) => {
      return {
        key: categoryId,
        value: sumBy(group, i => i.fields.Amount),
        title: group[0].fields.Category.fields.Name
      }
    })
  }

  const drawChart = () => {
    const data = prepData()

    const margin = 150
    const width = d3.select(chartContainer.current).node().getBoundingClientRect().width
    const height = width - 230
    const radius = width / 2 - margin

    if (!svg) {
      // append the svg object to the div called 'my_dataviz'
      svg = d3.select(chartContainer.current)
      .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "pie-chart")
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    }

    // set the color scale
    var color = d3.scaleOrdinal()
      .domain(data.map(d => d.key))
      .range(d3.schemeDark2)

    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(d => d.value)
    var data_ready = pie(data)

    // The arc generator
    var arc = d3.arc()
      .innerRadius(radius * 0)         // This is the size of the donut hole
      .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d){ return(color(d.data.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "1px")
      .style("opacity", 0.7)

    // Add the polylines between chart and labels:
    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
          var posA = arc.centroid(d) // line insertion in the slice
          var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
          var posC = outerArc.centroid(d) // Label position = almost the same as posB
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1) // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC]
        })

    // Add the polylines between chart and labels:
    svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
        .text( d => d.data.title )
        .attr('transform', function(d) {
            var pos = outerArc.centroid(d)
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1)
            return 'translate(' + pos + ')'
        })
        .style('text-anchor', function(d) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
    })
  }

  return (
    <div ref={chartContainer}>
      <style jsx global>{`
        svg.pie-chart {
          width: 100%;
          height: 100%;
        }
        
        path.slice{
          stroke-width:2px;
        }
        
        polyline{
          opacity: .3;
          stroke: black;
          stroke-width: 2px;
          fill: none;
        }
      `}</style>
    </div>
  )
}

export default PieChart
