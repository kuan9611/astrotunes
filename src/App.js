import React, { Component } from 'react';
import View from './View';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
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
    const data = raw
    .filter(p => {
      return p.planet_status === "Confirmed" &&
        p.orbital_period && p.semi_major_axis;
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
      (res[p.star] = res[p.star] || []).push(p);
      return res;
    }, {});
    this.setState({ data });
  }

  render() {
    return (
      <div className="App">
        <View data={this.state.data} />
      </div>
    );
  }
}

export default App;
