import React from 'react';
import { connect } from 'react-redux';
import { updatePolygonAction } from '../actions';
import Input from './input';

class PolygonControls extends React.Component {
  render() {
    const { updatePolygon, ...rest } = this.props;

    return (
      <div>
        <h3>Polygon settings</h3>
        { 
          Object.entries(rest).map(([ propName, value ], i) =>
            <Input
              type="text"
              labelText={propName}
              key={`${i}-${propName}`}
              name={propName}
              value={value}
              onInput={updatePolygon}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = ({ polygon }) => ({ ...polygon });
const mapDispatchToProps = dispatch => ({
  updatePolygon(event) {
    const { name, value } = event.target;
    dispatch(updatePolygonAction({ [name]: +value }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PolygonControls);
