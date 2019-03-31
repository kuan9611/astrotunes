import node from './orbitView';
import React, { Component } from 'react';
import rd3 from 'react-d3-library';
const RD3Component = rd3.Component;

class View extends Component {
  constructor(props) {
    super(props);
    this.state = {d3: ''};
  }

  componentDidMount() {
    this.setState({d3: node});
  }

  render() {
    return (
      <div>
        <RD3Component data={this.state.d3} />
      </div>
    )
  }
}

export default View;
