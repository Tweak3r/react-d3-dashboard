import React, { Component } from 'react';
import * as d3 from 'd3';

class StackedAreaChart extends Component {
  componentDidMount() {
    this.container = d3.select("#area-chart-container");
    this.containerDimensions = this.container.node().getBoundingClientRect();

    this.margin = { top: 60, right: 180, bottom: 50, left: 50 };
    this.width = this.containerDimensions.width - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.drawChart();
  }

  drawChart() {
    let { chartData } = this.props;

    const svg = this.container
      .append("svg")
      .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
      .attr('preserveAspectRatio','xMinYMin')
      // .attr("width", this.width + this.margin.left + this.margin.right)
      // .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    let keys = d3.keys(chartData[0]).filter(key => (key !== 'date'));

    chartData.forEach(d => {
      if (d.date) { 
        d.date = new Date(d.date);
      }
    });

    let color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeSet2);

    let stackedData = d3.stack()
        .keys(keys)(chartData)

    // X axis
    let x = d3.scaleTime()
      .domain(d3.extent(chartData, (d) => { return d.date } ))
      .range([ 0, this.width ]);

    let xAxis = svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x).ticks(5))

    // Y axis
    let y = d3.scaleLinear()
      .domain([0, 3000])
      .range([ this.height, 0 ]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))

    svg.append("defs")
        .append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", this.width )
        .attr("height", this.height )
        .attr("x", 0)
        .attr("y", 0);

    // Brushing
    let brush = d3.brushX()
        .extent( [ [0, 0], [this.width, this.height] ] )
        .on("end", updateChart)

    let areaChart = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Areas
    let area = d3.area()
      .x((d) => { return x(d.data.date); })
      .y0((d) => { return y(d[0]); })
      .y1((d) => { return y(d[1]); })

    areaChart
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
        .attr("class", (d) => { return "myArea " + d.key })
        .style("fill", (d) => { return color(d.key); })
        .attr("d", area)

    areaChart
      .append("g")
        .attr("class", "brush")
        .call(brush);

    let idleTimeout
    function idled() { 
      idleTimeout = null; 
    }

    function updateChart() {
      let extent = d3.event.selection

      if (!extent) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain(d3.extent(chartData, (d) => { return d.date; }))
      } else {
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
      areaChart
        .selectAll("path")
        .transition().duration(1000)
        .attr("d", area)
    }

    // Highlight area on hover
    let highlight = (d) => {
      d3.selectAll(".myArea").style("opacity", .1);
      d3.select("."+d).style("opacity", 1);
    }

    let noHighlight = (d) => {
      d3.selectAll(".myArea").style("opacity", 1)
    }

    // Legend
    let size = 20
    svg.selectAll("myrect")
      .data(keys)
      .enter()
      .append("rect")
        .attr("x", this.width + this.margin.left) 
        .attr("y", (d, i) => { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", (d) => { return color(d) })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)


    svg.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", this.width + this.margin.left + size * 1.2)
        .attr("y", (d, i) => { return 10 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", (d) => { return color(d) })
        .text((d) => { return d.charAt(0).toUpperCase() + d.slice(1).replace(/Requests/g, ''); })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

  }

  render() {
    return (
      <div id="area-chart-container"></div>
    )
  }
}

export default StackedAreaChart;