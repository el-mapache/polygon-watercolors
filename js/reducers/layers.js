import types from '../actions/types';

const initialState = {
  // number of layers to draw
  depth: 4,
  // upper bound of times a given layer is drawn
  polygonCount: 200,
  // draws are incremented by this until the total number of draws
  // equals the polygon count
  polygonStep: 2,
};

export default (state = initialState, action) => {
  const { type, ...rest } = action;

  switch(type) {
    case types.UPDATE_LAYER_SETTINGS: {
      return { ...state, ...rest };
    }

    default:
      return state;
  }
};
