import React, { Component } from 'react';
import * as d3 from "d3";

class View extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
  }

  componentDidMount() {
    this.redraw();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  redraw() {
    clearInterval(this.interval);
    const t0 = new Date().setHours(0,0,0,0);

    const w = window.innerWidth;
    const h = window.innerHeight;

    let planets = [];
    Object.keys(this.props.data).forEach(k => {
      planets.push(this.props.data[k].map(x => ({
        R: x.dist * 100,
        r: Math.sqrt(x.mass),
        speed: 1/x.period,
        phi0: 0,
      })));
    });
    planets = planets.flat();

    const svg = d3.select(this.node.current)
      .attr("width", w)
      .attr("height", h);
    svg.selectAll("*").remove();

    svg.append("circle")
      .attr("r", 10)
      .attr("cx", w/2)
      .attr("cy", h/2)
      .attr("id", "sun");

    const container = svg.append("g")
      .attr("transform", "translate(" + w/2 + "," + h/2 + ")")
      .call(d3.behavior.zoom().on("zoom", () => {
        svg.selectAll(".orbit").attr("r", d => d.R * d3.event.scale);
        svg.selectAll(".planet").attr("cx", d => d.R * d3.event.scale);
      }));

    container.selectAll(".orbit").data(planets).enter()
      .append("circle")
        .attr("r", d => d.R)
        .attr("class", "orbit");
    container.selectAll("g.planet_cluster").data(planets).enter()
      .append("g")
        .attr("class", "planet_cluster")
      .append("circle")
        .attr("r", d => d.r)
        .attr("cx", d => d.R)
        .attr("class", "planet");

    this.interval = setInterval(() => {
      svg.selectAll(".planet_cluster")
        .attr("transform", d => {
          return "rotate(" + (d.phi0 + (Date.now() - t0) * d.speed) + ")";
        });
    }, 100);
  }

  render() {
    this.redraw();
    return (
      <div>
        <svg ref={this.node} />
      </div>
    )
  }
}

export default View;
