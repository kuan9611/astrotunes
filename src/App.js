import React, { Component } from 'react';
import View from './View';
import './App.css';

class App extends Component {
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
    .reduce((rv, x) => {
      (rv[x.star] = rv[x.star] || []).push(x);
      return rv;
    }, {});
    this.setState({ data });
    console.log(data);
    // const count = [0,0,0,0,0,0,0,0,0,0];
    // Object.keys(data).forEach(k => {
    //   count[data[k].length]++;
    // });
    // console.log(count);
  }

  render() {
    return (
      <div className="App">
        <View />
      </div>
    );
  }
}

export default App;
