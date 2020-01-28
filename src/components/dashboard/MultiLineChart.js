import React, { Component } from 'react';
import * as d3 from 'd3';

class MultilineChart extends Component {
  componentDidMount() {
    // Set the dimensions and margins for the graphs
    this.container = d3.select("#line-chart-container");
    this.containerDimensions = this.container.node().getBoundingClientRect();

    this.margin = { top: 40, right: 30, bottom: 110, left: 50 };
    this.margin2 = { top: 440, right: 30, bottom: 20, left: 50 };
    
    this.width = this.containerDimensions.width - this.margin.left - this.margin.right;
    this.height = 520 - this.margin.top - this.margin.bottom;
    this.height2 = 520 - this.margin2.top - this.margin2.bottom;

    this.drawChart();
  }

  drawChart() {
    const { chartData } = this.props;

    /* INIT CHART SETUP */
    const color = d3.scaleOrdinal()
      .range(d3.schemeCategory10);
      // .range(["#4a90e2", "#ff4444", "#30c514", "#9321ff", "#ffa62f"]);

    const x = d3.scaleTime().range([0, this.width]);
    const x2 = d3.scaleTime().range([0, this.width]);
    const y = d3.scaleLinear().range([this.height, 0]);
    const y2 = d3.scaleLinear().range([this.height2, 0]);

    const xAxis = d3.axisBottom(x);
    const xAxis2 = d3.axisBottom(x2);
    const yAxis = d3.axisLeft(y).tickSizeInner(-this.width).tickSizeOuter(0).tickPadding(10);

    const line = d3.line()
      .x(d => { return x(d.date); })
      .y(d => { return y(d.value); })
      .curve(d3.curveMonotoneX);

    const line2 = d3.line()
      .x(d => { return x2(d.date); })
      .y(d => { return y2(d.value); })
      .curve(d3.curveMonotoneX);

    const svg = this.container.append("svg")
      .attr("id", "line-chart-svg")
      .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
      .attr('preserveAspectRatio','xMinYMin')
      // .attr("width", this.width + this.margin.left + this.margin.right)
      // .attr("height", this.height + this.margin.top + this.margin.bottom);

    const focus = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    const context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + this.margin2.left + "," + this.margin2.top + ")");

    svg.append("defs")
      .append("clipPath")
      .attr("id", "chart-clip")
      .append("rect")
      .attr("width", this.width)
      .attr("height", this.height);

    const brushed = () => {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;

      const selection = d3.event.selection || x2.range();
      x.domain(selection.map(x2.invert, x2));

      focus.selectAll(".chart-focus-line")
        .transition().duration(500)
        .attr("d", d => line(d.values));
      
      focus.select(".x.chart-axis")
        .transition().duration(500)
        .call(xAxis);

      svg.select(".chart-overlay")
        .call(zoom.transform, 
          d3.zoomIdentity
            .scale(this.width / (selection[1] - selection[0]))
            .translate(-selection[0], 0));
    }

    const zoomed = () => {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;

      var transform = d3.event.transform;
      x.domain(transform.rescaleX(x2).domain());

      focus.selectAll(".chart-focus-line").attr("d", d => line(d.values));
      focus.select(".x.chart-axis").call(xAxis);

      context.select(".chart-brush").call(brush.move, x.range().map(transform.invertX, transform));
    }

    const brush = d3.brushX()
      .extent([ [0, 0], [this.width, this.height2] ])
      .on("end", brushed);

    const zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([ [0, 0], [this.width, this.height] ])
      .extent([ [0, 0], [this.width, this.height] ])
      .on("zoom", zoomed);

    // Tooltip behavior
    svg.append("rect")
      .attr("class", "chart-overlay")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")")
      .call(zoom);

    
    /* APPEND and DRAW elements */
    const keys = d3.keys(chartData[0]).filter(key => (key !== 'time'));

    chartData.forEach(d => {
      if (d.time) d.date = new Date(d.time);
    });

    color.domain(keys);

    const sources = color.domain().map(name => ({
        name,
        values: chartData.map(d => ( { date: d.date, value: +d[name] } ))
      })
    );

    x.domain(d3.extent(chartData.map(d => { return d.date } )));
    y.domain([0, 5000]);
    // y.domain([
    //   d3.min(sources.map(el => { return d3.min(el.values, (f) => { console.log(f.value); return f.value; }); })),
    //   d3.max(sources.map(el => { return d3.max(el.values, (f) => { console.log(f.value); return f.value; }); }))
    // ]);

    x2.domain(x.domain());
    y2.domain(y.domain());

    // Main section / Focus
    const focuslineGroups = focus.selectAll(".keys")
    .data(sources)
    .enter().append("g")
    .attr("class", "keys");

    focuslineGroups.append("path")
      .attr("class", "chart-line chart-focus-line")
      .attr("fill", "none")
      .attr("stroke", d => { return color(d.name); })
      .attr("stroke-width", 1.5)
      .attr("d", d => { return line(d.values); })

    focus.append("g")
      .attr("class", "x chart-axis chart-focus-axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(xAxis);

    focus.append("g")
      .attr("class", "y chart-axis")
      .call(yAxis);

    // Brush / Context
    const contextlineGroups = context.selectAll("g")
    .data(sources)
    .enter().append("g");

    contextlineGroups.append("path")
      .attr("class", "chart-line chart-context-line")
      .attr("fill", "none")
      .attr("stroke", d => { return color(d.name); })
      .attr("stroke-width", 0.8)
      .attr("d", d => { return line2(d.values); })

    context.append("g")
      .attr("class", "x chart-axis chart-context-axis")
      .attr("transform", "translate(0," + this.height2 + ")")
      .call(xAxis2);

    // Brush element
    context.append("g")
      .attr("class", "chart-brush")
      .style("fill", "#3587BC")
      .style("fill-opacity", 0.125)
      // .style("shape-rendering", "crispEdges")
      .call(brush)
      .call(brush.move, x.range());
  }

  render() {
      return (
          <div id="line-chart-container"></div>
      )
  }
}

export default MultilineChart;
