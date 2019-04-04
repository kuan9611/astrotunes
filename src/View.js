import React, { Component } from 'react';
import * as d3 from "d3";

class View extends Component {
  constructor(props) {
    super(props);
    this.planets = [];
    this.view = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (Object.keys(prevProps.data).length < 
      Object.keys(this.props.data).length) {
      this.makePlanets();
      this.makeView();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  makePlanets() {
    const planets = [];
    Object.values(this.props.data).forEach(x => {
      planets.push(x.planets.map(p => ({
        ...p,
        R: p.dist * 100,
        r: Math.sqrt(p.mass) || p.radius,
        speed: 1/p.period,
        hidden: !x.selected,
      })));
    });
    this.planets = planets.flat();
  }

  makeView() {
    clearInterval(this.interval);
    const t0 = new Date().setHours(0,0,0,0);

    const w = window.innerWidth - 250;
    const h = window.innerHeight;

    const svg = d3.select(this.view.current)
      .attr("width", w)
      .attr("height", h)
      .call(d3.behavior.zoom().on("zoom", () => {
        svg.selectAll(".orbit").attr("r", d => d.R * d3.event.scale);
        svg.selectAll(".planet").attr("cx", d => d.R * d3.event.scale);
      }));
    svg.selectAll("*").remove();

    svg.append("circle")
      .attr("r", 1)
      .attr("cx", w/2)
      .attr("cy", h/2)
      .attr("id", "sun");

    const container = svg.append("g")
      .attr("transform", "translate(" + w/2 + "," + h/2 + ")");

    container.selectAll(".orbit").data(this.planets).enter()
      .append("circle")
        .attr("r", d => d.R)
        .attr("class", "orbit");
    container.selectAll(".planet_cluster").data(this.planets).enter()
      .append("g")
        .attr("class", "planet_cluster")
      .append("circle")
        .attr("r", d => d.r)
        .attr("cx", d => d.R)
        .attr("class", "planet");
    this.updateView();

    this.interval = setInterval(() => {
      svg.selectAll(".planet_cluster")
        .attr("transform", d => {
          return "rotate(" + (Date.now() - t0) * d.speed + ")";
        });
    }, 100);
  }

  updateView() {
    const svg = d3.select(this.view.current);
    svg.selectAll(".orbit").classed("hidden", d => d.hidden);
    svg.selectAll(".planet_cluster").classed("hidden", d => d.hidden);
  }

  updateSelection() {
    this.planets.forEach(p => {
      p.hidden = !this.props.data[p.star].selected;
    });
    this.updateView();
  }

  render() {
    this.updateSelection();
    return (
      <div className="View">
        <svg ref={this.view} />
      </div>
    )
  }
}

export default View;
