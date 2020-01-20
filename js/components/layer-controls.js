import React from 'react';
import { connect } from 'react-redux';
import { updateLayerAction } from '../actions';
import Input from './input';

class LayerControls extends React.Component {
  render() {
    const { updateLayer, ...rest } = this.props;

    return (
      <div>
        <h3>Layer settings</h3>
        { 
          Object.entries(rest).map(([ propName, value ], i) =>
            <Input
              type="text"
              labelText={propName}
              key={`layer-${i}-${propName}`}
              name={propName}
              value={value}
              onInput={updateLayer}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = ({ layers }) => ({ ...layers });
const mapDispatchToProps = dispatch => ({
  updateLayer(event) {
    const { name, value } = event.target;
    dispatch(updateLayerAction({ [name]: +value }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerControls);
