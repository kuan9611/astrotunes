import React, { Component } from 'react';
import View from './View';
import Table from './Table';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    const csvPath = require('./catalog.csv');
    const Papa = require('papaparse/papaparse.min.js');
    Papa.parse(csvPath, {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: result => this.updateData(result.data),
    });
  }

  updateData(raw) {
    let data = raw
    .filter(p => {
      return p.planet_status === "Confirmed" &&
        p.orbital_period && p.semi_major_axis && p.star_name;
    })
    .map(p => ({
      name: p["# name"],
      mass: p.mass,
      radius: p.radius,
      period: p.orbital_period,
      dist: p.semi_major_axis,
      star: p.star_name,
    }))
    .reduce((res, p) => {
      (res[p.star] = res[p.star] || {
        star: p.star,
        planets: [],
      }).planets.push(p);
      return res;
    }, {})
    data = Object.values(data);
    this.setState({ data });
  }

  render() {
    return (
      <div className="App">
        {/*<View data={this.state.data} />*/}
        <Table data={this.state.data} />
      </div>
    );
  }
}

export default App;
