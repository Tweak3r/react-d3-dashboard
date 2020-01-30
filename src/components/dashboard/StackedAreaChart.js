import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class StackedAreaChart extends React.Component {
  static propTypes = {
    chartData: PropTypes.arrayOf(
      PropTypes.shape({
        readRequests: PropTypes.number,
        writeRequests: PropTypes.number,
        removeRequests: PropTypes.number,
        date: PropTypes.number
      })
    )
  }

  chartContainerRef = React.createRef();

  componentDidMount() {
    const { chartData } = this.props;
    this.initChart(chartData);
  }

  initChart(data) {
    const keys = d3.keys(data[0]).filter(key => { return key !== 'time' });
    const color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

    data.forEach(d => d.date = new Date(d.time));
    const stackedData = d3.stack().keys(keys)(data);

    // Dimensions and margins for the graphs
    this.chartContainer = d3.select(this.chartContainerRef.current);
    this.chartContainerDimensions = this.chartContainer.node().getBoundingClientRect();

    this.margin = { top: 60, right: 180, bottom: 50, left: 50 };
    this.width = this.chartContainerDimensions.width - this.margin.left - this.margin.right;
    this.height = this.chartContainerDimensions.height - this.margin.top - this.margin.bottom;

    // Main SVG element
    const svg = this.chartContainer.append("svg")
      .attr("viewBox", 
        `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
      .attr('preserveAspectRatio','xMinYMin')
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // Setup and add X axis
    const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => { return d.date }))
      .range([ 0, this.width ]);

    const xAxis = svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x).ticks(5));

    // Setup and add Y axis
    const y = d3.scaleLinear()
      .domain([0, 3000])
      .range([ this.height, 0 ]);

    svg.append("g")
      .call(d3.axisLeft(y)
      .ticks(5));

    // Areas (Setup functions)
    const area = d3.area()
      .x((d) => { return x(d.data.date); })
      .y0((d) => { return y(d[0]); })
      .y1((d) => { return y(d[1]); });

    const areaChart = svg.append('g')
      .attr("clip-path", "url(#clip)");

    // Add area elements
    areaChart
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
        .attr("class", (d) => { return "myArea " + d.key })
        .style("fill", (d) => { return color(d.key); })
        .attr("d", area);

    // Chart clip
    svg.append("defs")
      .append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", this.width )
      .attr("height", this.height )
      .attr("x", 0)
      .attr("y", 0);

    // Brush
    const brush = d3.brushX()
      .extent( [ [0, 0], [this.width, this.height] ] )
      .on("end", updateChart);

    areaChart.append("g")
      .attr("class", "brush")
      .call(brush);

    let idleTimeout;
    function idled() { 
      idleTimeout = null; 
    };

    function updateChart() {
      const extent = d3.event.selection;

      if (!extent) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
        x.domain(d3.extent(data, (d) => { return d.date; }));
      } else {
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ]);
        areaChart.select(".brush").call(brush.move, null);
      }

      xAxis.transition().duration(1000)
        .call(d3.axisBottom(x).ticks(5));

      areaChart.selectAll("path")
        .transition().duration(1000)
        .attr("d", area);
    }

    // Highlight area
    const highlight = (d) => {
      d3.selectAll(".myArea").style("opacity", .1);
      d3.select("."+d).style("opacity", 1);
    }

    const noHighlight = (d) => {
      d3.selectAll(".myArea").style("opacity", 1);
    }

    // Legend
    const size = 20;
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
        .on("mouseleave", noHighlight);

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
        .on("mouseleave", noHighlight);

  }

  render() {
    return (
      <div 
        id="area-chart-container"
        ref={this.chartContainerRef}
      >
      </div>
    )
  }
}

export default StackedAreaChart;