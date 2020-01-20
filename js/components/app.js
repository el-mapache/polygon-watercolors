import React from 'react';
import { connect } from 'react-redux';
import PolygonControls from './polygon-controls';
import LayerControls from './layer-controls';
import draw from '../painter';

const buttonStyle = {
  marginTop: "20px",
  padding: "10px",
  backgroundColor: "transparent",
  border: "2px solid",
  borderRadius: "4px 4px",
  fontSize: "1.1rem",
  cursor: "pointer",
};

class App extends React.Component {
  constructor() {
    super();

    this.draw = this.draw.bind(this);
  }

  draw() {
    draw(this.props);
  }

  render() {
    return (
      <div style={{ width: "70%" }}>
        <div className="wrapper">
          <PolygonControls />
          <LayerControls />
          <button type="button" onClick={this.draw} style={buttonStyle}>
            Redraw
          </button>
        </div>

      </div>
    );
  }
}

export default connect(state => state)(App);
